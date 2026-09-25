import ws from "ws";
(globalThis as any).WebSocket = ws;
import { createClient } from "@supabase/supabase-js";
import * as path from "path";
import * as fs from "fs";

// Load .env.local if present
const envLocalPath = path.resolve(__dirname, "../apps/web/.env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [k, ...v] = trimmed.split("=");
    if (k && v.length) {
      process.env[k.trim()] = v.join("=").trim().replace(/^["']|["']$/g, "");
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_EMAILS = [
  "admin@costview.ng",
  "pm@costview.ng",
  "qs@costview.ng",
  "arch@costview.ng",
  "site@costview.ng",
  "procure@costview.ng",
  "acct@costview.ng",
  "store@costview.ng",
  "test-contractor@costview.ng",
];

async function main() {
  console.log("Fetching all Supabase auth users...");
  const { data: authData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Failed to list users:", listError.message);
    process.exit(1);
  }

  const allUsers = authData?.users || [];
  const demoUsers = allUsers.filter((u) => DEMO_EMAILS.includes(u.email || ""));
  const realUsers = allUsers.filter((u) => !DEMO_EMAILS.includes(u.email || ""));

  console.log(`Found ${allUsers.length} total users.`);
  console.log(`Demo accounts to clear (${demoUsers.length}):`, demoUsers.map((u) => u.email));
  console.log(`Real accounts preserved (${realUsers.length}):`, realUsers.map((u) => u.email));

  if (demoUsers.length === 0) {
    console.log("No demo accounts found to clear.");
    return;
  }

  const demoUserIds = demoUsers.map((u) => u.id);

  // Find primary admin user (talk2icedmist@gmail.com or first real user) to reassign created records
  const primaryAdmin = realUsers.find((u) => u.email === "talk2icedmist@gmail.com") || realUsers[0];
  const primaryAdminId = primaryAdmin ? primaryAdmin.id : null;

  if (primaryAdminId) {
    console.log(`Reassigning transactional FK references to admin user: ${primaryAdmin.email} (${primaryAdminId})...`);

    const reassignments = [
      ["purchase_orders", "created_by"],
      ["purchase_orders", "approved_by"],
      ["three_way_matches", "resolved_by"],
      ["site_diaries", "logged_by"],
      ["audit_logs", "actor_id"],
      ["goods_received_notes", "received_by"],
      ["daily_attendance", "logged_by"],
      ["snags_and_ncrs", "assigned_to"],
      ["snags_and_ncrs", "raised_by"],
      ["variation_orders", "raised_by"],
      ["variation_orders", "approved_by"],
      ["material_issues", "issued_by"],
      ["material_transfers", "requested_by"],
      ["material_transfers", "approved_by"],
      ["drawings", "uploaded_by"],
      ["budget_revisions", "requested_by"],
      ["budget_revisions", "approved_by"],
    ];

    for (const [tbl, col] of reassignments) {
      const { error } = await supabase
        .from(tbl)
        .update({ [col]: primaryAdminId })
        .in(col, demoUserIds);
      if (error && !error.message.includes("Could not find")) {
        console.warn(`Notice updating ${tbl}.${col}:`, error.message);
      }
    }
  }

  // Delete project_members for demo users
  console.log("Cleaning up project_members...");
  const { error: pmErr } = await supabase.from("project_members").delete().in("user_id", demoUserIds);
  if (pmErr) console.warn("project_members deletion:", pmErr.message);

  // Delete profiles for demo users
  console.log("Cleaning up profiles...");
  const { error: profErr } = await supabase.from("profiles").delete().in("id", demoUserIds);
  if (profErr) console.warn("profiles deletion:", profErr.message);

  // Delete from Supabase Auth
  console.log("Deleting demo users from Supabase Auth...");
  for (const u of demoUsers) {
    const { error: delErr } = await supabase.auth.admin.deleteUser(u.id);
    if (delErr) {
      console.error(`✗ Failed to delete ${u.email}:`, delErr.message);
    } else {
      console.log(`✓ Deleted ${u.email} (${u.id})`);
    }
  }

  // Verify
  console.log("\nVerifying remaining accounts in Supabase Auth...");
  const { data: verifyData } = await supabase.auth.admin.listUsers();
  const remaining = verifyData?.users || [];
  console.log(`Remaining users count: ${remaining.length}`);
  remaining.forEach((u) => console.log(` - ${u.email} (${u.id})`));

  console.log("\nAll demo accounts have been successfully cleared.");
}

main().catch((err) => {
  console.error("Error clearing demo accounts:", err);
  process.exit(1);
});
