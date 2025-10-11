export const dynamic = 'force-dynamic';

async function getAnimal(slug: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/emergency?slug=${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function EmergencyPage({ params }: { params: { slug: string }}) {
  const data = await getAnimal(params.slug);
  if (!data) return <div className="p-6">Nenalezeno.</div>;

  const { animal } = data;
  return (
    <main className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Nouzová karta: {animal?.name}</h1>
      {animal?.photo_url && <img src={animal.photo_url} alt={animal.name} className="w-56 h-56 object-cover rounded-2xl" />}
      {animal?.acute_note && (
        <div className="p-4 rounded-2xl border bg-amber-50 text-amber-800">
          <strong>Důležité:</strong> {animal.acute_note}
        </div>
      )}
      <p className="text-sm text-gray-600">
        Tato stránka je veřejná pouze pro účely rychlé identifikace a nouzových pokynů.
      </p>
    </main>
  );
}
