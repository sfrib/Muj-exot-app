import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const Body = z.object({
  common_name: z.string().min(1),
  scientific_name: z.string().optional(),
  origin: z.string().optional(),
  temp_min: z.number().optional(),
  temp_max: z.number().optional(),
  humidity_min: z.number().optional(),
  humidity_max: z.number().optional(),
  uvb_need: z.string().optional(),
  enclosure_notes: z.string().optional(),
  wild_diet: z.string().optional(),
  captive_diet: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('species').select('*').order('common_name');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ species: data });
  }

  if (req.method === 'POST') {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { data, error } = await supabaseAdmin.from('species').insert(parsed.data).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ species: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
