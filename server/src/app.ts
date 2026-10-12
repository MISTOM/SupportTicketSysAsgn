import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { all } from '@prisma/orm-postgres/orm-client';
import { db } from './prisma/db';

const STATUSES = ['open', 'in_progress', 'closed'] as const;
const PRIORITIES = ['low', 'medium', 'high'] as const;
type Status = (typeof STATUSES)[number];
type Priority = (typeof PRIORITIES)[number];

const isStatus = (v: unknown): v is Status => STATUSES.includes(v as Status);
const isPriority = (v: unknown): v is Priority => PRIORITIES.includes(v as Priority);
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Row shape -> JSON (createdAt is a db Dateobject)
const toJson = (t: any) => ({ ...t, createdAt: t.createdAt?.toString() });

const app: Express = express();
app.use(express.json());

// POST /tickets
app.post(
  '/tickets',
  async (req, res) => {
    const { title, description, status, priority } = req.body ?? {};

    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (description !== undefined && description !== null && typeof description !== 'string') {
      return res.status(400).json({ error: 'description must be a string' });
    }
    if (status !== undefined && !isStatus(status)) {
      return res.status(400).json({ error: `status must be one of ${STATUSES.join(', ')}` });
    }
    if (priority !== undefined && !isPriority(priority)) {
      return res.status(400).json({ error: `priority must be one of ${PRIORITIES.join(', ')}` });
    }

    const ticket = await db.orm.public.Ticket.create({
      title: title.trim(),
      description: description ?? null,
      ...(status && { status }),
      ...(priority && { priority }),
    });

    res.status(201).json(toJson(ticket));
  },
);

// GET /tickets/stats  
app.get(
  '/tickets/stats',
  async (_req, res) => {
    const rows = await db.orm.public.Ticket.groupBy('status').aggregate((agg) => ({
      count: agg.count(),
    }));

    const stats: Record<Status, number> = { open: 0, in_progress: 0, closed: 0 };
    for (const r of rows) stats[r.status as Status] = Number(r.count);

    res.json(stats);
  },
);

// GET /tickets?status=&page=&limit=
app.get(
  '/tickets',
  async (req, res) => {
    const { status } = req.query;
    console.log('GET /tickets', { status, query: req.query });
    if (status !== undefined && !isStatus(status)) {
      return res.status(400).json({ error: `status must be one of ${STATUSES.join(', ')}` });
    }

    // Pagination
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit ?? '10'), 10) || 10));

    const filter = status ? (t: any) => t.status.eq(status) : () => all();

    const [data, agg] = await Promise.all([
      db.orm.public.Ticket.where(filter)
        .orderBy((t) => t.createdAt.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all(),
      db.orm.public.Ticket.where(filter).aggregate((a) => ({ total: a.count() })),
    ]);

    const total = Number(agg.total);
    res.json({
      data: data.map(toJson),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },
);

// GET /tickets/:id
app.get(
  '/tickets/:id',
  async (req, res) => {
    const id = String(req.params.id);
    console.log('GET /ticket/:id', { id });
    if (!UUID_REGEX.test(id)) return res.status(400).json({ error: 'invalid id' });

    const ticket = await db.orm.public.Ticket.where({ id }).first();
    if (!ticket) return res.status(404).json({ error: 'ticket not found' });

    res.json(toJson(ticket));
  },
);

// PATCH /tickets/:id
app.patch(
  '/tickets/:id',
  async (req, res) => {
    const id = String(req.params.id);
    console.log('PATCH /tickets/:id', { id, body: req.body });
    if (!UUID_REGEX.test(id)) return res.status(400).json({ error: 'invalid id' });

    const { status, priority } = req.body ?? {};
    if (status === undefined && priority === undefined) {
      return res.status(400).json({ error: 'provide status and/or priority' });
    }
    if (status !== undefined && !isStatus(status)) {
      return res.status(400).json({ error: `status must be one of ${STATUSES.join(', ')}` });
    }
    if (priority !== undefined && !isPriority(priority)) {
      return res.status(400).json({ error: `priority must be one of ${PRIORITIES.join(', ')}` });
    }

    const updated = await db.orm.public.Ticket.where({ id }).update({
      ...(status && { status }),
      ...(priority && { priority }),
    });

    if (!updated) return res.status(404).json({ error: 'ticket not found' });
    res.json(toJson(updated));
  },
);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

export default app;
