import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { RoleName } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

interface DefaultUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  default_role: RoleName;
  created_at: string;
}

const DEFAULT_USERS: DefaultUser[] = [];

export async function GET() {
  const admin = createAdminClient();

  if (!admin) {
    return NextResponse.json({ users: DEFAULT_USERS, roleAccess: [] });
  }

  try {
    // 1. Fetch profiles
    const { data: profiles, error: profileError } = await (admin as any)
      .from("profiles")
      .select("id, full_name, phone, default_role, avatar_url, created_at")
      .order("created_at", { ascending: true });

    // 2. Fetch role_access permissions
    const { data: roleAccess } = await (admin as any)
      .from("role_access")
      .select("id, role, permission_key, allowed");

    if (profileError || !profiles || (profiles as any[]).length === 0) {
      return NextResponse.json({ users: DEFAULT_USERS, roleAccess: roleAccess || [] });
    }

    // Try fetching emails from auth if possible
    let authUsers: any[] = [];
    try {
      const { data: authData } = await admin.auth.admin.listUsers();
      authUsers = authData?.users || [];
    } catch {
      // Fallback if listUsers has restrictions
    }

    const emailMap = new Map(authUsers.map((u: any) => [u.id, u.email]));

    const merged = (profiles as any[]).map((p: any) => ({
      id: p.id,
      full_name: p.full_name,
      email: emailMap.get(p.id) || `${p.full_name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@costview.app`,
      phone: p.phone,
      default_role: p.default_role as RoleName,
      avatar_url: p.avatar_url,
      created_at: p.created_at,
    }));

    return NextResponse.json({ users: merged.length > 0 ? merged : DEFAULT_USERS, roleAccess: roleAccess || [] });
  } catch (err: any) {
    console.error("Error in GET /api/admin/users:", err);
    return NextResponse.json({ users: DEFAULT_USERS, roleAccess: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name, phone, role } = body;

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, full_name, and role are required." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    if (!admin) {
      // Preview/fallback mode: simulate user creation
      const mockId = "usr-" + Math.random().toString(36).substring(2, 9);
      const newUser = {
        id: mockId,
        full_name,
        email,
        phone: phone || null,
        default_role: role as RoleName,
        created_at: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, user: newUser, preview: true });
    }

    // 1. Create User in Supabase Auth
    const { data: authResult, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        default_role: role,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authResult.user.id;

    // 2. Fetch default workspace if exists
    const { data: ws } = await (admin as any).from("workspaces").select("id").limit(1).single();
    const workspaceId = ws?.id || null;

    // 3. Upsert Profile
    await (admin as any).from("profiles").upsert({
      id: userId,
      workspace_id: workspaceId,
      full_name,
      phone: phone || null,
      default_role: role as RoleName,
    });

    // 4. Fetch first project and link member
    const { data: proj } = await (admin as any).from("projects").select("id").limit(1).single();
    if (proj?.id) {
      await (admin as any).from("project_members").upsert({
        project_id: proj.id,
        user_id: userId,
        role: role as RoleName,
      });
    }

    // 5. Create Audit Log
    try {
      await (admin as any).from("audit_logs").insert({
        actor_id: userId,
        action: "USER_CREATED",
        entity_type: "profiles",
        entity_id: userId,
        old_values: null,
        new_values: { full_name, email, role },
      });
    } catch {
      // non-blocking
    }

    const newUser = {
      id: userId,
      full_name,
      email,
      phone: phone || null,
      default_role: role as RoleName,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, user: newUser });
  } catch (err: any) {
    console.error("Error in POST /api/admin/users:", err);
    return NextResponse.json({ error: err.message || "Failed to create user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const admin = createAdminClient();

    if (action === "update_role") {
      const { userId, role } = body;
      if (!userId || !role) {
        return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
      }

      if (admin) {
        // Update profile
        await (admin as any).from("profiles").update({ default_role: role as RoleName }).eq("id", userId);

        // Update project members
        await (admin as any).from("project_members").update({ role: role as RoleName }).eq("user_id", userId);

        // Audit log
        try {
          await (admin as any).from("audit_logs").insert({
            actor_id: userId,
            action: "ROLE_UPDATED",
            entity_type: "profiles",
            entity_id: userId,
            old_values: null,
            new_values: { default_role: role },
          });
        } catch {
          // non-blocking
        }
      }

      return NextResponse.json({ success: true, userId, role });
    }

    if (action === "update_permission") {
      const { role, permission_key, allowed } = body;
      if (!role || !permission_key || allowed === undefined) {
        return NextResponse.json({ error: "role, permission_key, and allowed boolean are required" }, { status: 400 });
      }

      if (admin) {
        const { data: ws } = await (admin as any).from("workspaces").select("id").limit(1).single();
        if (ws?.id) {
          await (admin as any).from("role_access").upsert({
            workspace_id: ws.id,
            role: role as RoleName,
            permission_key,
            allowed,
          }, { onConflict: "workspace_id,role,permission_key" });
        }
      }

      return NextResponse.json({ success: true, role, permission_key, allowed });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Error in PATCH /api/admin/users:", err);
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: 500 });
  }
}
