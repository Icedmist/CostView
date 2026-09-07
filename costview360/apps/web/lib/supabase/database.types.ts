export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RoleName =
  | "Admin"
  | "Project Manager"
  | "Quantity Surveyor"
  | "Architect"
  | "Site Engineer"
  | "Procurement Officer"
  | "Accountant"
  | "Storekeeper";

export type ProjectStatus = "Planning" | "Active" | "On Hold" | "Completed" | "Archived";
export type POStatus = "Draft" | "Sent to Suppliers" | "Approved" | "Partially Delivered" | "Delivered" | "Cancelled";
export type ApprovalStatus = "Draft" | "Pending" | "Approved" | "Rejected";
export type MatchStatus = "Pending" | "Matched" | "Discrepancy" | "Paid";
export type TransferStatus = "Requested" | "Approved" | "In Transit" | "Received" | "Cancelled";
export type SnagSeverity = "Low" | "Medium" | "High" | "Critical";
export type SnagStatus = "Open" | "In Progress" | "Remediated" | "Closed";
export type ClaimStatus = "Submitted" | "Verified" | "Certified" | "Approved" | "Paid";
export type VariationStatus = "Draft" | "QS Valuation" | "PM Review" | "Client Approved" | "Rejected";

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          currency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          currency?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          currency?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          workspace_id: string | null;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          default_role: RoleName;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          workspace_id?: string | null;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          default_role?: RoleName;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string | null;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          default_role?: RoleName;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          code: string;
          description: string | null;
          project_type: "contractor" | "developer";
          location: string | null;
          budget_total: number;
          currency: string;
          status: ProjectStatus;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          code: string;
          description?: string | null;
          project_type?: "contractor" | "developer";
          location?: string | null;
          budget_total?: number;
          currency?: string;
          status?: ProjectStatus;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          code?: string;
          description?: string | null;
          project_type?: "contractor" | "developer";
          location?: string | null;
          budget_total?: number;
          currency?: string;
          status?: ProjectStatus;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
        };
      };
      boq_items: {
        Row: {
          id: string;
          project_id: string;
          parent_id: string | null;
          code: string;
          description: string;
          unit: string;
          quantity: number;
          rate: number;
          budget_amount: number;
          committed_amount: number;
          actual_amount: number;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          parent_id?: string | null;
          code: string;
          description: string;
          unit: string;
          quantity: number;
          rate: number;
          budget_amount?: number;
          committed_amount?: number;
          actual_amount?: number;
          category?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          parent_id?: string | null;
          code?: string;
          description?: string;
          unit?: string;
          quantity?: number;
          rate?: number;
          budget_amount?: number;
          committed_amount?: number;
          actual_amount?: number;
          category?: string;
          created_at?: string;
        };
      };
      budget_revisions: {
        Row: {
          id: string;
          boq_item_id: string;
          delta_quantity: number;
          delta_rate: number;
          delta_amount: number;
          reason: string;
          status: ApprovalStatus;
          requested_by: string | null;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          boq_item_id: string;
          delta_quantity?: number;
          delta_rate?: number;
          delta_amount: number;
          reason: string;
          status?: ApprovalStatus;
          requested_by?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          boq_item_id?: string;
          delta_quantity?: number;
          delta_rate?: number;
          delta_amount?: number;
          reason?: string;
          status?: ApprovalStatus;
          requested_by?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
        };
      };
      purchase_orders: {
        Row: {
          id: string;
          project_id: string;
          supplier_id: string;
          po_number: string;
          status: POStatus;
          total_amount: number;
          currency: string;
          notes: string | null;
          created_by: string | null;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
        };
      };
      goods_received_notes: {
        Row: {
          id: string;
          purchase_order_id: string;
          grn_number: string;
          received_by: string | null;
          delivery_date: string;
          delivery_note_photo_url: string | null;
          remarks: string | null;
          created_at: string;
        };
      };
      snags_and_ncrs: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string;
          location: string;
          severity: SnagSeverity;
          status: SnagStatus;
          photo_before_url: string | null;
          photo_after_url: string | null;
          assigned_to: string | null;
          raised_by: string | null;
          resolved_at: string | null;
          created_at: string;
        };
      };
    };
  };
}
