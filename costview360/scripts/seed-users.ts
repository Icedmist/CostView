/**
 * Seed 8 demo users with roles — password DemoPass2026! for all
 * Run:  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/seed-users.ts
 * Or via:  npm run seed:users
 *
 * Creates auth.users via supabase.auth.admin.createUser and links to profiles + project_members
 */
import ws from "ws";
(globalThis as any).WebSocket = ws;
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set env then rerun.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

const WORKSPACE_ID = "11111111-1111-1111-1111-111111111111";
const PROJECT_ID = "22222222-2222-2222-2222-222222222222";

const DEMO_USERS = [
  { email: "admin@costview.ng", full_name: "Adebayo Admin", role: "Admin" },
  { email: "pm@costview.ng", full_name: "Babatunde Adeyemi (PM)", role: "Project Manager" },
  { email: "qs@costview.ng", full_name: "Mrs. Nkechi (QS)", role: "Quantity Surveyor" },
  { email: "arch@costview.ng", full_name: "David Okafor (Architect)", role: "Architect" },
  { email: "site@costview.ng", full_name: "Engr. Tayo (Site Engineer)", role: "Site Engineer" },
  { email: "procure@costview.ng", full_name: "Chidi Procurement", role: "Procurement Officer" },
  { email: "acct@costview.ng", full_name: "Funke Accountant", role: "Accountant" },
  { email: "store@costview.ng", full_name: "Musa Storekeeper", role: "Storekeeper" },
] as const;

const PASSWORD = "DemoPass2026!";

async function main() {
  for (const u of DEMO_USERS) {
    console.log(`Creating ${u.email} — ${u.role} ...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: u.full_name, default_role: u.role, workspace_id: WORKSPACE_ID },
    });
    if (error) {
      // @ts-ignore error status
      if (error.message?.includes("already") || error.status === 422) {
        console.log(`  → already exists, fetching id...`);
        const { data: existing } = await supabase.auth.admin.listUsers();
        const found = existing?.users?.find((x) => x.email === u.email);
        if (!found) { console.error(`  ✗ could not find ${u.email}`); continue; }
        await link(found.id, u);
        continue;
      }
      console.error(`  ✗ ${u.email}:`, error.message);
      continue;
    }
    const userId = data.user?.id;
    if (!userId) { console.error(`  ✗ no id for ${u.email}`); continue; }
    await link(userId, u);
    console.log(`  ✓ ${u.email} (${userId})`);
  }
  console.log("\nDone. All demo users password: DemoPass2026!");
}

async function link(userId: string, u: typeof DEMO_USERS[number]) {
  // upsert profile
  await supabase.from("profiles").upsert({
    id: userId,
    workspace_id: WORKSPACE_ID,
    full_name: u.full_name,
    default_role: u.role,
  }, { onConflict: "id" });

  // project membership
  await supabase.from("project_members").upsert({
    project_id: PROJECT_ID,
    user_id: userId,
    role: u.role,
  }, { onConflict: "project_id,user_id" });
}

main().catch((e) => { console.error(e); process.exit(1); });
