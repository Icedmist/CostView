import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/client.js";
import { boqItems, budgetRevisions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { requirePermission } from "../middleware/rbac.js";

const boqItemInput = z.object({
  code: z.string(),
  description: z.string(),
  unit: z.string(),
  quantity: z.number(),
  rate: z.number(),
});

export async function boqRoutes(app: FastifyInstance) {
  // List BOQ items for a project, with running budget-vs-actual left to a
  // future join against procurement/progress data.
  app.get(
    "/projects/:projectId/boq",
    { preHandler: requirePermission("Budget") },
    async (req) => {
      const { projectId } = req.params as { projectId: string };
      return db.select().from(boqItems).where(eq(boqItems.projectId, projectId));
    }
  );

  app.post(
    "/projects/:projectId/boq",
    { preHandler: requirePermission("Budget") },
    async (req, reply) => {
      const { projectId } = req.params as { projectId: string };
      const body = boqItemInput.parse(req.body);
      const [item] = await db
        .insert(boqItems)
        .values({
          projectId,
          ...body,
          quantity: String(body.quantity),
          rate: String(body.rate),
          budgetAmount: String(body.quantity * body.rate),
        })
        .returning();
      return reply.code(201).send(item);
    }
  );

  // Rate/quantity revisions go through budget_revisions so every change to a
  // live budget line carries an approval trail (PRD Section 4 - Budget module).
  app.post(
    "/boq/:boqItemId/revisions",
    { preHandler: requirePermission("Budget") },
    async (req, reply) => {
      const { boqItemId } = req.params as { boqItemId: string };
      const { reason, deltaAmount } = z
        .object({ reason: z.string(), deltaAmount: z.number() })
        .parse(req.body);

      const [revision] = await db
        .insert(budgetRevisions)
        .values({ boqItemId, reason, deltaAmount: String(deltaAmount) })
        .returning();
      return reply.code(201).send(revision);
    }
  );
}
