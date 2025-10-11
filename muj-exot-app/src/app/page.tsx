export default function Home() {
  return (
    <main className="space-y-4">
      <section className="p-5 rounded-2xl border bg-white">
        <h2 className="text-xl font-medium mb-2">Vítej v Můj Exot</h2>
        <p className="text-sm text-gray-700">
          Přidej své zvíře, vygeneruj QR nouzovou kartu, a začni logovat krmení, svlékání, vážení a další.
        </p>
        <div className="mt-4">
          <a className="inline-block px-4 py-2 rounded bg-black text-white" href="/animals/new">+ Nové zvíře</a>
        </div>
      </section>
    </main>
  )
}
