import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const Body = z.object({
  species_id: z.string().uuid().optional(),
  name: z.string().min(1),
  sex: z.enum(['male','female','unknown']).optional().default('unknown'),
  birth_date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  acute_note: z.string().max(500).optional(),
  photo_url: z.string().url().optional(),
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    const { data: userResp, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userResp.user) return res.status(401).json({ error: 'Unauthorized' });

    const payload: any = {
      owner_id: userResp.user.id,
      ...parsed.data,
      birth_date: parsed.data.birth_date ? new Date(parsed.data.birth_date).toISOString() : null
    };

    const { data, error } = await supabaseAdmin.from('animals').insert(payload).select().single();
    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ animal: data });
  }

  if (req.method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    const { data: userResp, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userResp.user) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabaseAdmin
      .from('animals')
      .select('*')
      .eq('owner_id', userResp.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ animals: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
