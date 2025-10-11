import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') return res.status(400).json({ error: 'Missing slug' });

  const { data: link, error: linkErr } = await supabaseAdmin.from('qr_links').select('animal_id').eq('public_slug', slug).maybeSingle();
  if (linkErr || !link) return res.status(404).json({ error: 'Not found' });

  const { data: animal, error: aErr } = await supabaseAdmin.from('animals').select('id,name,photo_url,acute_note').eq('id', link.animal_id).maybeSingle();
  if (aErr || !animal) return res.status(404).json({ error: 'Not found' });

  return res.status(200).json({ animal });
}
