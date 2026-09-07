import {
  pgTable, uuid, text, timestamp, numeric, integer, boolean, pgEnum, jsonb,
} from "drizzle-orm/pg-core";

// ---------- Enums ----------
export const roleNameEnum = pgEnum("role_name", [
  "Admin", "Project Manager", "Quantity Surveyor", "Architect",
  "Site Engineer", "Procurement Officer", "Accountant", "Storekeeper",
]);

export const poStatusEnum = pgEnum("po_status", [
  "Draft", "Sent To Suppliers", "Partially Delivered", "Delivered", "Cancelled",
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "Draft", "Pending", "Approved", "Rejected",
]);

// ---------- Tenancy ----------
export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  currency: text("currency").notNull().default("NGN"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id).notNull(),
  name: text("name").notNull(),
  currency: text("currency").notNull().default("NGN"),
  status: text("status").notNull().default("Active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Per-project role assignment — a user can hold different roles on different projects
export const projectMembers = pgTable("project_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  role: roleNameEnum("role").notNull(),
});

// Editable permission matrix per workspace (Admin -> Roles screen writes here)
export const roleAccess = pgTable("role_access", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id).notNull(),
  role: roleNameEnum("role").notNull(),
  permissionKey: text("permission_key").notNull(), // e.g. "Budget", "Procurement"
  allowed: boolean("allowed").notNull().default(false),
});

// ---------- Budget / BOQ ----------
export const boqItems = pgTable("boq_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  code: text("code").notNull(),
  description: text("description").notNull(),
  unit: text("unit").notNull(),
  quantity: numeric("quantity", { precision: 14, scale: 2 }).notNull(),
  rate: numeric("rate", { precision: 14, scale: 2 }).notNull(),
  budgetAmount: numeric("budget_amount", { precision: 16, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const budgetRevisions = pgTable("budget_revisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  boqItemId: uuid("boq_item_id").references(() => boqItems.id).notNull(),
  reason: text("reason").notNull(),
  deltaAmount: numeric("delta_amount", { precision: 16, scale: 2 }).notNull(),
  status: approvalStatusEnum("status").notNull().default("Pending"),
  approvedByUserId: uuid("approved_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Procurement ----------
export const suppliers = pgTable("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id).notNull(),
  name: text("name").notNull(),
  contact: text("contact"),
});

export const purchaseOrders = pgTable("purchase_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  boqItemId: uuid("boq_item_id").references(() => boqItems.id),
  supplierId: uuid("supplier_id").references(() => suppliers.id).notNull(),
  status: poStatusEnum("status").notNull().default("Draft"),
  amount: numeric("amount", { precision: 16, scale: 2 }).notNull(),
  createdByUserId: uuid("created_by_user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const goodsReceivedNotes = pgTable("grns", {
  id: uuid("id").defaultRandom().primaryKey(),
  purchaseOrderId: uuid("purchase_order_id").references(() => purchaseOrders.id).notNull(),
  orderedQty: text("ordered_qty").notNull(),
  deliveredQty: text("delivered_qty").notNull(),
  discrepancy: text("discrepancy"),
  receivedByUserId: uuid("received_by_user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Audit ----------
// Every approval-chain mutation should also write here (see PRD section 7 - Auditability)
export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id).notNull(),
  actorUserId: uuid("actor_user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
