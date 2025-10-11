# 🦜 Můj Exot – Digital Pass (Starter)

MVP Next.js + Supabase pro **digital pass** exotických zvířat (QR nouzová karta + husbandry logy + připomínky).  
Vychází z požadavků VetExotic ekosystému (Alfonso AI, ExoMix, RegistrPtaku.cz).

## ✨ Funkce v tomto balíčku
- Přidání zvířete (jméno, druh, foto, akutní poznámka)
- Generování **QR** kódu s veřejnou **nouzovou kartou** (`/emergency/[slug]`)
- API pro **husbandry logy** (krmení, svlek, vážení, UVB, čištění, léčba)
- **Připomínky** (API + DB), připravené pro pozdější web push
- **RLS** politiky – uživatel vidí jen svá zvířata a logy

## 🧱 Technologie
- Next.js 14 (App Router), TypeScript, TailwindCSS
- Supabase (Postgres + RLS + Auth)
- Zod, React Hook Form
- QRCode, NanoID

## 🚀 Rychlý start (lokálně)
1) **Klonuj repo** a nainstaluj závislosti
```bash
npm i
```

2) **Nastav proměnné** – zkopíruj `.env.example` do `.env.local` a doplň hodnoty ze Supabase (URL, anon key, service role key, BASE_URL).

3) **Vytvoř tabulky** – otevři Supabase SQL editor a vlož obsah `supabase/schema.sql`.

4) **Spusť app**
```bash
npm run dev
```
- Lokální app: `http://localhost:3000`
- Nouzová karta bude žít na `http://localhost:3000/emergency/<slug>`

## 🔐 Poznámka k autentizaci
- API routy očekávají **Bearer token** z Supabase Auth (zatím jednoduché placeholdery v UI).
- V produkci přidej login (e.g., `@supabase/auth-ui-react`) a doplň získání tokenu na klientu.

## 📁 Struktura
```
src/
  app/
    animals/
      new/page.tsx           # formulář nové zvíře
      [id]/page.tsx          # detail zvířete + QR komponenta
    emergency/[slug]/page.tsx# veřejná nouzová karta
    layout.tsx, page.tsx
  components/
    QRCodeCard.tsx
  pages/api/
    animals.ts
    husbandry.ts
    notifications.ts
    qr.ts
    emergency.ts
  supabase/
    supabaseClient.ts
  utils/
    qr.ts
supabase/
  schema.sql
```

## 🛣️ Další kroky (doporučení)
- Přidat **/auth** (login, registrace), uložit session a dávat `access_token` do API volání.
- Detail zvířete rozšířit o **husbandry log formulář** + tabulku posledních událostí.
- **Web Push** (VAPID) a crony pro notifikace (Supabase Edge Functions).
- Import/Export CSV, fotogalerie, sdílení zvířete přes time‑limited link.
- Propojení s **ExoMix** (nutriční profil, dávkování), **VetCloud**, **RegistrPtaku.cz**.

---
MIT © VetExotic Group / Můj Exot


---

**Status:** v1.0 Core hotovo (Pass + QR + Husbandry + Species list + RLS). Pro přihlášení přidej Supabase Auth UI a tokeny v klientovi.
