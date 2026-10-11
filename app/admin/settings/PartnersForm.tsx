'use client'

import { FormEvent, useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { doc, getDocFromServer, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { MAX_PARTNER_NAME_LENGTH, MAX_PARTNERS, Partner, readPartners, validatePartners } from '@/lib/partners'

const inputClass = 'w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-gray-600 focus:border-red-400 focus:outline-none'
const iconButtonClass = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-gray-300 hover:border-red-400/50 hover:text-red-300 disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-gray-300'

export default function PartnersForm() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getDocFromServer(doc(db, 'settings', 'partners')).then((snapshot) => {
      if (cancelled) return
      setPartners(readPartners(snapshot.exists() ? snapshot.data() : undefined))
      setLoaded(true)
    }).catch(() => {
      if (!cancelled) setError('Seznam firem se nepodařilo načíst. Zkuste to znovu.')
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [attempt])

  function change(next: Partner[]) {
    setPartners(next)
    setSuccess(false)
    setError('')
  }

  function move(index: number, offset: number) {
    const next = [...partners]
    ;[next[index], next[index + offset]] = [next[index + offset], next[index]]
    change(next)
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!loaded || saving) return
    setError('')
    setSuccess(false)
    setSaving(true)
    try {
      const normalized = validatePartners(partners)
      await setDoc(doc(db, 'settings', 'partners'), { companies: normalized })
      setPartners(normalized)
      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Uložení se nezdařilo.')
    } finally { setSaving(false) }
  }

  return <form onSubmit={save} className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-8">
    <h2 className="text-lg font-semibold text-white">Partnerské firmy</h2>
    <p className="mt-2 mb-6 text-sm text-gray-400">Firmy, se kterými spolupracujete, se zobrazí v patičce webu v sekci „Spolupracujeme s“. Odkaz na web firmy je nepovinný. Pokud je seznam prázdný, sekce se nezobrazí.</p>
    {loading && <p role="status" className="text-gray-400">Načítání firem…</p>}
    <fieldset disabled={loading || !loaded || saving} className="space-y-4 disabled:opacity-60">
      {loaded && !partners.length && <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-gray-500">Zatím nejsou přidány žádné firmy.</p>}
      {partners.map((partner, index) => <div key={index} className="rounded-xl border border-white/10 bg-black/10 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="lg:w-2/5">
            <label htmlFor={`partner-name-${index}`} className="mb-2 block text-sm font-medium text-gray-200">Název firmy</label>
            <input id={`partner-name-${index}`} type="text" maxLength={MAX_PARTNER_NAME_LENGTH} placeholder="např. Gasco" value={partner.name}
              onChange={(event) => change(partners.map((item, i) => i === index ? { ...item, name: event.target.value } : item))}
              className={inputClass} />
          </div>
          <div className="flex-1">
            <label htmlFor={`partner-url-${index}`} className="mb-2 block text-sm font-medium text-gray-200">Web firmy <span className="font-normal text-gray-500">(nepovinné)</span></label>
            <input id={`partner-url-${index}`} type="url" inputMode="url" maxLength={2048} placeholder="https://www.firma.cz" value={partner.url}
              onChange={(event) => change(partners.map((item, i) => i === index ? { ...item, url: event.target.value } : item))}
              className={inputClass} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Posunout ${partner.name || 'firmu'} nahoru`} title="Posunout nahoru" className={iconButtonClass}>
              <ArrowUp className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => move(index, 1)} disabled={index === partners.length - 1} aria-label={`Posunout ${partner.name || 'firmu'} dolů`} title="Posunout dolů" className={iconButtonClass}>
              <ArrowDown className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => change(partners.filter((_, i) => i !== index))} aria-label={`Odebrat ${partner.name || 'firmu'}`} title="Odebrat" className={iconButtonClass}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>)}
      <div className="flex flex-wrap gap-3 pt-1">
        <button type="button" onClick={() => change([...partners, { name: '', url: '' }])} disabled={partners.length >= MAX_PARTNERS}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-medium text-gray-200 hover:border-red-400/60 hover:text-white disabled:opacity-50">
          <Plus className="h-4 w-4" /> Přidat firmu
        </button>
        <button type="submit" className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-500 disabled:opacity-50" disabled={saving}>
          {saving ? 'Ukládání…' : 'Uložit firmy'}
        </button>
      </div>
    </fieldset>
    {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    {!loading && !loaded && <button type="button" onClick={() => setAttempt(attempt + 1)} className="mt-4 text-sm text-white underline">Zkusit znovu</button>}
    {success && <p role="status" className="mt-4 text-sm text-green-300">Seznam firem byl uložen a je zveřejněn na webu.</p>}
  </form>
}
