'use client';

import { useState } from 'react';

type Props = { animalId: string };

export default function HusbandryForm({ animalId }: Props) {
  const [type, setType] = useState<'feed'|'shed'|'weigh'|'uvb_change'|'clean'|'medication'>('feed');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = ''; // TODO: auth token
      const res = await fetch('/api/husbandry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          animal_id: animalId,
          type,
          quantity: quantity ? Number(quantity) : undefined,
          unit: unit || undefined,
          note: note || undefined
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json.error ?? json));
      setQuantity(''); setUnit(''); setNote('');
      // emit a simple event for parent to refetch logs
      document.dispatchEvent(new CustomEvent('husbandry:created', { detail: json.log }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded-2xl p-4 bg-white space-y-3">
      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Typ</label>
          <select className="w-full border rounded p-2" value={type} onChange={e => setType(e.target.value as any)}>
            <option value="feed">Krmení</option>
            <option value="shed">Svlékání</option>
            <option value="weigh">Vážení</option>
            <option value="uvb_change">Výměna UVB</option>
            <option value="clean">Čištění</option>
            <option value="medication">Medikace</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Množství</label>
          <input className="w-full border rounded p-2" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="např. 35" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Jednotka</label>
          <input className="w-full border rounded p-2" value={unit} onChange={e => setUnit(e.target.value)} placeholder="g / ml / ks" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Poznámka</label>
          <input className="w-full border rounded p-2" value={note} onChange={e => setNote(e.target.value)} placeholder="detail..." />
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button onClick={submit} disabled={saving} className="px-4 py-2 rounded bg-black text-white">
        {saving ? 'Ukládám…' : 'Přidat záznam'}
      </button>
    </div>
  );
}
