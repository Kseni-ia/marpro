'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createReference, REFERENCE_CATEGORIES, ReferenceCategory } from '@/lib/constructions'
import { uploadMultipleMedia, validateMultipleMedia } from '@/lib/imageUpload'
import { clearReferenceDraft, loadReferenceDraft, saveReferenceDraft } from '@/lib/referenceDraft'
import ImagePreviewLightbox from './ImagePreviewLightbox'
import MediaUploader from './MediaUploader'

interface AddReferenceModalProps {
  onClose: () => void
  onSuccess: () => void
}

const CATEGORY_ACCENTS: Record<ReferenceCategory, { primary: string; tint: string; tintStrong: string; border: string; borderStrong: string; text: string }> = {
  demolice: {
    primary: '#fb7185',
    tint: 'rgba(251, 113, 133, 0.12)',
    tintStrong: 'rgba(251, 113, 133, 0.18)',
    border: 'rgba(251, 113, 133, 0.22)',
    borderStrong: 'rgba(251, 113, 133, 0.38)',
    text: '#ffe4e6',
  },
  instalace: {
    primary: '#60a5fa',
    tint: 'rgba(96, 165, 250, 0.12)',
    tintStrong: 'rgba(96, 165, 250, 0.18)',
    border: 'rgba(96, 165, 250, 0.22)',
    borderStrong: 'rgba(96, 165, 250, 0.38)',
    text: '#dbeafe',
  },
  stavebni_prace: {
    primary: '#34d399',
    tint: 'rgba(52, 211, 153, 0.12)',
    tintStrong: 'rgba(52, 211, 153, 0.18)',
    border: 'rgba(52, 211, 153, 0.22)',
    borderStrong: 'rgba(52, 211, 153, 0.38)',
    text: '#d1fae5',
  },
  odvoz_materialu: {
    primary: '#f59e0b',
    tint: 'rgba(245, 158, 11, 0.12)',
    tintStrong: 'rgba(245, 158, 11, 0.18)',
    border: 'rgba(245, 158, 11, 0.22)',
    borderStrong: 'rgba(245, 158, 11, 0.38)',
    text: '#fef3c7',
  },
}

export default function AddReferenceModal({ onClose, onSuccess }: AddReferenceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrls: [] as string[],
    category: 'demolice' as ReferenceCategory,
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState<Record<number, number> | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)
  const [draftRestored, setDraftRestored] = useState(false)

  const accent = CATEGORY_ACCENTS[formData.category]
  const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0b1220]/80 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-red-500/40 focus:bg-[#0b1220]'
  const sectionClass = 'rounded-[22px] border border-white/8 bg-white/[0.035] p-4'

  useEffect(() => {
    const draft = loadReferenceDraft()
    if (!draft) return

    setFormData((prev) => ({ ...prev, ...draft }))
    setDraftRestored(true)
  }, [])

  useEffect(() => {
    saveReferenceDraft(formData)
  }, [formData])

  const handleAddFiles = (files: FileList) => {
    const validation = validateMultipleMedia(files)
    if (!validation.isValid) {
      setError(validation.error || 'Neplatné soubory')
      return
    }

    const totalImages = formData.imageUrls.length + imageFiles.length + files.length
    if (totalImages > 10) {
      setError(`Celkový počet souborů nesmí přesáhnout 10. Aktuálně máte ${formData.imageUrls.length + imageFiles.length}, přidáváte ${files.length}`)
      return
    }

    const newFiles = Array.from(files)
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

    setImageFiles((prev) => [...prev, ...newFiles])
    setImagePreviews((prev) => [...prev, ...newPreviews])
    setError('')
  }

  const removeImage = (index: number) => {
    if (selectedPreview === imagePreviews[index]) {
      setSelectedPreview(null)
    }

    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => {
      const next = prev.filter((_, i) => i !== index)
      URL.revokeObjectURL(prev[index])
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrls = formData.imageUrls

      if (imageFiles.length > 0) {
        setUploadProgress(Object.fromEntries(imageFiles.map((_, index) => [index, 0])))
        const uploadedUrls = await uploadMultipleMedia(imageFiles, 'references', (index, percent) => {
          setUploadProgress((prev) => (prev ? { ...prev, [index]: percent } : prev))
        })
        imageUrls = [...imageUrls, ...uploadedUrls]
      }

      await createReference({
        ...formData,
        imageUrls,
      })

      clearReferenceDraft()
      onSuccess()
      onClose()
    } catch (submitError) {
      setError('Nepodařilo se vytvořit referenci')
    } finally {
      setLoading(false)
      setUploadProgress(null)
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-white/10 bg-[#111827]/95 shadow-[0_26px_60px_rgba(0,0,0,0.42)]">
        <div className="sticky top-0 z-10 border-b border-white/8 bg-[#111827]/95 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: accent.primary }}>
                Reference
              </p>
              <h3 className="text-2xl font-semibold tracking-tight text-white">Přidat novou referenci</h3>
              <p className="mt-1.5 text-sm text-gray-400">Vytvořte novou referenční kartu s kategorií, popisem a fotkami.</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 transition-all duration-300 hover:bg-red-500/12 hover:text-white"
              title="Zavřít"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div
            className="rounded-[22px] border p-4"
            style={{
              borderColor: accent.border,
              background: `linear-gradient(145deg, ${accent.tint} 0%, rgba(255,255,255,0.035) 100%)`,
            }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: accent.tintStrong,
                  border: `1px solid ${accent.borderStrong}`,
                  color: accent.text,
                }}
              >
                {REFERENCE_CATEGORIES.find((cat) => cat.value === formData.category)?.label}
              </span>
              <span className="text-sm text-gray-400">Kategorie určuje barevný akcent této reference.</span>
            </div>
          </div>

          {error && (
            <div className="rounded-[18px] border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {draftRestored && (
            <div className="flex items-center justify-between gap-3 rounded-[18px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              <span>Koncept byl obnoven z prohlížeče.</span>
              <button
                type="button"
                onClick={() => {
                  clearReferenceDraft()
                  setDraftRestored(false)
                  setFormData({
                    title: '',
                    description: '',
                    imageUrls: [],
                    category: 'demolice',
                    isActive: true,
                  })
                }}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
              >
                Smazat koncept
              </button>
            </div>
          )}

          <div className={sectionClass}>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Název</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Zadejte název reference"
            />
          </div>

          <div className={sectionClass}>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Popis</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className={`${inputClass} min-h-[112px] resize-none`}
              placeholder="Zadejte popis reference"
            />
          </div>

          <div className={sectionClass}>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Kategorie</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as ReferenceCategory }))}
              required
              className={inputClass}
            >
              {REFERENCE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-gray-900">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className={sectionClass}>
            <MediaUploader
              files={imageFiles}
              previews={imagePreviews}
              existingUrls={formData.imageUrls}
              accent={accent}
              uploadProgress={uploadProgress}
              onAddFiles={handleAddFiles}
              onRemoveFile={removeImage}
              onRemoveExisting={(index) =>
                setFormData((prev) => ({
                  ...prev,
                  imageUrls: prev.imageUrls.filter((_, i) => i !== index),
                }))
              }
              onPreviewClick={setSelectedPreview}
            />
          </div>

          <div className={sectionClass}>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 rounded border-white/20 bg-[#0b1220] text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-200">Viditelné na webu</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/8 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-gray-200 transition-all duration-300 hover:bg-white/[0.08]"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={loading || imageFiles.length === 0}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#0b1220] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: accent.primary }}
            >
              {uploadProgress ? 'Nahrává se…' : loading ? 'Vytváří se…' : 'Vytvořit'}
            </button>
          </div>
        </form>
      </div>

      {selectedPreview && (
        <ImagePreviewLightbox
          previewUrl={selectedPreview}
          onClose={() => setSelectedPreview(null)}
        />
      )}
    </div>
  )
}
