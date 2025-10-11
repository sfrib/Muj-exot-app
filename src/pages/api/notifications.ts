import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const Body = z.object({
  animal_id: z.string().uuid().optional(),
  title: z.string().min(1),
  due_at: z.string(),
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

    const { data, error } = await supabaseAdmin.from('notifications').insert({
      ...parsed.data,
      user_id: userResp.user.id,
      due_at: new Date(parsed.data.due_at).toISOString()
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ notification: data });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userResp.user.id)
      .order('due_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ notifications: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
