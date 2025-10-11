import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const Body = z.object({
  animal_id: z.string().uuid(),
  type: z.enum(['feed','shed','weigh','uvb_change','clean','medication']),
  note: z.string().optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  event_at: z.string().optional(),
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '') || '';
  const { data: userResp, error: userErr } = await supabaseAdmin.auth.getUser(token);
  if (userErr || !userResp.user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { data: animal } = await supabaseAdmin.from('animals').select('owner_id').eq('id', parsed.data.animal_id).single();
    if (!animal || animal.owner_id !== userResp.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { data, error } = await supabaseAdmin.from('husbandry_logs').insert({
      ...parsed.data,
      event_at: parsed.data.event_at ? new Date(parsed.data.event_at).toISOString() : new Date().toISOString(),
      created_by: userResp.user.id
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ log: data });
  }

  if (req.method === 'GET') {
    const { animal_id } = req.query;
    let q = supabaseAdmin.from('husbandry_logs').select('*');

    if (animal_id && typeof animal_id === 'string') {
      const { data: animal } = await supabaseAdmin.from('animals').select('owner_id').eq('id', animal_id).single();
      if (!animal || animal.owner_id !== userResp.user.id) return res.status(403).json({ error: 'Forbidden' });
      q = q.eq('animal_id', animal_id);
    } else {
      // fallback: fetch logs for all user's animals
      const { data: animals } = await supabaseAdmin.from('animals').select('id').eq('owner_id', userResp.user.id);
      const ids = (animals ?? []).map(a => a.id);
      if (ids.length === 0) return res.status(200).json({ logs: [] });
      q = q.in('animal_id', ids);
    }

    const { data, error } = await q.order('event_at', { ascending: false }).limit(200);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ logs: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
