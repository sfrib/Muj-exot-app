import type { NextApiRequest, NextApiResponse } from 'next';
import { toDataUrl } from '@/utils/qr';
import { createClient } from '@supabase/supabase-js';
import { customAlphabet } from 'nanoid';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { animal_id } = req.query;
  if (!animal_id || typeof animal_id !== 'string') return res.status(400).json({ error: 'Missing animal_id' });

  const { data: existing } = await supabaseAdmin.from('qr_links').select('*').eq('animal_id', animal_id).maybeSingle();

  let slug = existing?.public_slug as string | undefined;
  if (!slug) {
    slug = nanoid();
    const { error } = await supabaseAdmin.from('qr_links').insert({ animal_id, public_slug: slug });
    if (error) return res.status(500).json({ error: error.message });
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/emergency/${slug}`;
  const dataUrl = await toDataUrl(publicUrl);
  return res.status(200).json({ dataUrl, url: publicUrl });
}
