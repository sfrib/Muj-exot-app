'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
  name: z.string().min(1, 'Jméno je povinné'),
  species_id: z.string().optional(),
  sex: z.enum(['male','female','unknown']).default('unknown'),
  birth_date: z.string().optional(),
  tags: z.string().optional(),
  acute_note: z.string().max(500).optional(),
  photo_url: z.string().url().optional()
});

type FormValues = z.infer<typeof FormSchema>;

export default function NewAnimalPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { sex: 'unknown' }
  });

  const onSubmit = async (values: FormValues) => {
    const token = ''; // TODO: get Supabase auth token if you use auth
    const res = await fetch('/api/animals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...values,
        tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      })
    });
    const json = await res.json();
    if (!res.ok) {
      alert('Chyba: ' + JSON.stringify(json.error ?? json));
      return;
    }
    window.location.href = `/animals/${json.animal.id}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Nové zvíře</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Jméno *</label>
          <input {...register('name')} className="w-full border rounded p-2" />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Druh (species_id)</label>
            <input {...register('species_id')} className="w-full border rounded p-2" placeholder="UUID" />
          </div>
          <div>
            <label className="block text-sm font-medium">Pohlaví</label>
            <select {...register('sex')} className="w-full border rounded p-2">
              <option value="unknown">Neznámé</option>
              <option value="male">Samec</option>
              <option value="female">Samice</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Datum narození</label>
            <input type="date" {...register('birth_date')} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Tagy (čárkou)</label>
            <input {...register('tags')} className="w-full border rounded p-2" placeholder="např. adult, tame" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Akutní poznámka (nouzová karta)</label>
          <textarea {...register('acute_note')} className="w-full border rounded p-2" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium">Foto URL</label>
          <input {...register('photo_url')} className="w-full border rounded p-2" placeholder="https://..." />
        </div>
        <button disabled={isSubmitting} className="px-4 py-2 rounded bg-black text-white">
          {isSubmitting ? 'Ukládám…' : 'Uložit'}
        </button>
      </form>
    </div>
  );
}
