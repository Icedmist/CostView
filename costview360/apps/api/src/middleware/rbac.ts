import type { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/client.js";
import { projectMembers, roleAccess } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

/**
 * Server-side permission check. The prototype's canAccess() only hid nav
 * items in the browser — every mutating and data-reading route must re-check
 * here, since a hidden button is not access control.
 */
export function requirePermission(permissionKey: string) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.userId; // set by an auth middleware, not shown here
    const projectId = (req.params as { projectId?: string }).projectId;

    if (!userId || !projectId) {
      return reply.code(401).send({ error: "Unauthenticated" });
    }

    const [member] = await db
      .select()
      .from(projectMembers)
      .where(and(eq(projectMembers.userId, userId), eq(projectMembers.projectId, projectId)));

    if (!member) return reply.code(403).send({ error: "Not a project member" });

    const [access] = await db
      .select()
      .from(roleAccess)
      .where(and(eq(roleAccess.role, member.role), eq(roleAccess.permissionKey, permissionKey)));

    if (!access?.allowed) {
      return reply.code(403).send({ error: `Role '${member.role}' cannot access '${permissionKey}'` });
    }
  };
}
