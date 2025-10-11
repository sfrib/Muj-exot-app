'use client';

import { useEffect, useState } from 'react';
import QRCodeCard from '@/components/QRCodeCard';
import HusbandryForm from '@/components/HusbandryForm';

export default function AnimalDetail({ params }: { params: { id: string }}) {
  const [animal, setAnimal] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const token = ''; // TODO: Supabase auth token

  async function loadAnimal() {
    const res = await fetch('/api/animals', { headers: { Authorization: `Bearer ${token}` }});
    const json = await res.json();
    const found = (json.animals ?? []).find((a: any) => a.id === params.id);
    setAnimal(found);
  }

  async function loadLogs() {
    const res = await fetch(`/api/husbandry?animal_id=${params.id}`, { headers: { Authorization: `Bearer ${token}` }});
    const json = await res.json();
    setLogs(json.logs ?? []);
  }

  useEffect(() => {
    (async () => {
      try {
        await loadAnimal();
        await loadLogs();
      } catch (e: any) {
        setErr(e.message);
      }
    })();
    const onCreated = () => loadLogs();
    document.addEventListener('husbandry:created', onCreated as any);
    return () => document.removeEventListener('husbandry:created', onCreated as any);
  }, [params.id]);

  if (err) return <div className="p-6 text-red-600">Chyba: {err}</div>;
  if (!animal) return <div className="p-6">Načítám…</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{animal.name}</h1>
        {animal.photo_url && <img src={animal.photo_url} alt={animal.name} className="mt-2 w-48 h-48 object-cover rounded-2xl" />}
        {animal.acute_note && <p className="mt-2 text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-2xl">{animal.acute_note}</p>}
      </header>

      <section>
        <h2 className="text-xl font-medium mb-2">Nouzová karta (QR)</h2>
        <QRCodeCard animalId={animal.id} name={animal.name} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Husbandry</h2>
        <HusbandryForm animalId={animal.id} />
        <div className="border rounded-2xl bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Datum</th>
                <th className="p-3">Typ</th>
                <th className="p-3">Množství</th>
                <th className="p-3">Poznámka</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-b last:border-b-0">
                  <td className="p-3">{new Date(l.event_at).toLocaleString()}</td>
                  <td className="p-3">{l.type}</td>
                  <td className="p-3">{l.quantity ?? ''} {l.unit ?? ''}</td>
                  <td className="p-3">{l.note ?? ''}</td>
                </tr>
              ))}
              {logs.length === 0 ? <tr><td colSpan={4} className="p-3 text-gray-500">Zatím žádné záznamy.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
