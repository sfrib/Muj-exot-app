'use client';

import { useEffect, useState } from 'react';
import QRCodeCard from '@/components/QRCodeCard';

export default function AnimalDetail({ params }: { params: { id: string }}) {
  const [animal, setAnimal] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const token = '';
      const res = await fetch('/api/animals', { headers: { Authorization: `Bearer ${token}` }});
      const json = await res.json();
      const found = (json.animals ?? []).find((a: any) => a.id === params.id);
      setAnimal(found);
    })();
  }, [params.id]);

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
    </div>
  );
}
