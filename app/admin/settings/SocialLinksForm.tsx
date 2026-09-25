'use client'

import { FormEvent, useEffect, useState } from 'react'
import { doc, getDocFromServer, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { DEFAULT_SOCIAL_LINKS, readSocialLinks, SOCIAL_NETWORKS, validateSocialLinks } from '@/lib/socialLinks'

export default function SocialLinksForm() {
  const [links, setLinks] = useState(DEFAULT_SOCIAL_LINKS)
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
    getDocFromServer(doc(db, 'settings', 'socialLinks')).then((snapshot) => {
      if (cancelled) return
      setLinks(readSocialLinks(snapshot.exists() ? snapshot.data() : undefined))
      setLoaded(true)
    }).catch(() => {
      if (!cancelled) setError('Odkazy se nepodařilo načíst. Zkuste to znovu.')
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [attempt])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!loaded || saving) return
    setError('')
    setSuccess(false)
    setSaving(true)
    try {
      const normalized = validateSocialLinks(links)
      await setDoc(doc(db, 'settings', 'socialLinks'), normalized)
      setLinks(normalized)
      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Uložení se nezdařilo.')
    } finally { setSaving(false) }
  }

  return <form onSubmit={save} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-8">
    <h2 className="text-lg font-semibold text-white">Sociální sítě</h2>
    <p className="mt-2 mb-6 text-sm text-gray-400">Vložte úplné odkazy na profily. Prázdné pole skryje danou síť v patičce webu. Změny se zobrazí po uložení.</p>
    {loading && <p role="status" className="text-gray-400">Načítání odkazů…</p>}
    <fieldset disabled={loading || !loaded || saving} className="space-y-5 disabled:opacity-60">
      {SOCIAL_NETWORKS.map(({ key, label, placeholder }) => <div key={key}>
        <label htmlFor={`social-${key}`} className="mb-2 block text-sm font-medium text-gray-200">{label}</label>
        <input id={`social-${key}`} type="url" inputMode="url" maxLength={2048} placeholder={placeholder} value={links[key]}
          onChange={(event) => { setLinks({ ...links, [key]: event.target.value }); setSuccess(false); setError('') }}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-gray-600 focus:border-red-400 focus:outline-none" />
      </div>)}
      <button type="submit" className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-500 disabled:opacity-50" disabled={saving}>
        {saving ? 'Ukládání…' : 'Uložit odkazy'}
      </button>
    </fieldset>
    {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    {!loading && !loaded && <button type="button" onClick={() => setAttempt(attempt + 1)} className="mt-4 text-sm text-white underline">Zkusit znovu</button>}
    {success && <p role="status" className="mt-4 text-sm text-green-300">Odkazy byly uloženy a jsou zveřejněny na webu.</p>}
  </form>
}
