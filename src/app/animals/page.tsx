'use client';

import { useEffect, useState } from 'react';

export default function AnimalsListPage() {
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = ''; // TODO: Supabase auth token
        const res = await fetch('/api/animals', { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(json.error ?? json));
        setAnimals(json.animals ?? []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Načítám…</div>;
  if (error) return <div className="text-red-600">Chyba: {error}</div>;

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Moje zvířata</h1>
        <a className="px-4 py-2 rounded bg-black text-white" href="/animals/new">+ Nové zvíře</a>
      </div>
      {animals.length === 0 ? (
        <p>Nemáš žádná zvířata. Přidej první.</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4">
          {animals.map((a) => (
            <li key={a.id} className="border rounded-2xl p-4 bg-white">
              <div className="flex gap-4">
                {a.photo_url ? <img src={a.photo_url} alt={a.name} className="w-20 h-20 object-cover rounded-xl" /> : <div className="w-20 h-20 bg-gray-100 rounded-xl" />}
                <div>
                  <h2 className="text-lg font-medium">{a.name}</h2>
                  {a.tags?.length ? <p className="text-xs text-gray-600">{a.tags.join(', ')}</p> : null}
                  <a className="inline-block mt-2 text-sm underline" href={`/animals/${a.id}`}>Otevřít kartu</a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
