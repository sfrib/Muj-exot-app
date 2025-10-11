'use client';

import { useEffect, useState } from 'react';

export default function QRCodeCard({ animalId, name }: { animalId: string; name: string }) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/qr?animal_id=${animalId}`);
      const json = await res.json();
      setDataUrl(json.dataUrl);
    })();
  }, [animalId]);

  return (
    <div className="border rounded-2xl p-4 flex items-center gap-4 bg-white">
      {dataUrl ? <img src={dataUrl} alt={`QR ${name}`} className="w-40 h-40" /> : <div>Generuji QR…</div>}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Naskenuj pro nouzovou kartu {name}.</p>
        {dataUrl && (
          <a href={dataUrl} download={`qr-${name}.png`} className="inline-block px-3 py-2 rounded bg-black text-white text-sm">
            Stáhnout PNG
          </a>
        )}
      </div>
    </div>
  );
}
