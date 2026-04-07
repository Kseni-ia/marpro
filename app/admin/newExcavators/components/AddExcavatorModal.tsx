'use client'

import React, { useState } from 'react'
import { Check, X } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { addExcavator } from '@/lib/excavators'
import { EXCAVATOR_PRESET_DESCRIPTIONS } from '@/lib/excavatorPresets'
import { getExcavatorAccent } from '@/lib/excavatorAccent'

interface AddExcavatorModalProps {
  onClose: () => void
  onSuccess: () => void
}

const EXCAVATOR_IMAGES = [
  { path: '/TB145.svg', name: 'TB145', type: 'mini' },
  { path: '/TB290-1.svg', name: 'TB290-1', type: 'standard' },
  { path: '/TB290-2.svg.svg', name: 'TB290-2', type: 'large' },
]

export default function AddExcavatorModal({ onClose, onSuccess }: AddExcavatorModalProps) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    model: '',
    type: 'mini',
    description: EXCAVATOR_PRESET_DESCRIPTIONS[0] || '',
    price: '',
    weight: '',
    bucketCapacity: '',
    maxReach: '',
    svgPath: '/TB145.svg',
    isActive: true,
  })
  const [descriptionMode, setDescriptionMode] = useState<'preset' | 'custom'>('preset')
  const [selectedPreset, setSelectedPreset] = useState<number>(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addExcavator({
        model: formData.model,
        type: formData.type,
        description: {
          en: formData.description,
          cs: formData.description,
          ru: formData.description,
        },
        price: Number(formData.price),
        specs: {
          weight: formData.weight,
          bucketCapacity: formData.bucketCapacity,
          maxReach: formData.maxReach,
        },
        svgPath: formData.svgPath,
        isActive: formData.isActive,
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding excavator:', error)
      alert(t('error.failedAdd'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const selectedImageConfig = EXCAVATOR_IMAGES.find((image) => image.path === formData.svgPath) || EXCAVATOR_IMAGES[0]
  const accent = getExcavatorAccent(formData.type || selectedImageConfig.type)
  const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0b1220]/80 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-red-500/40 focus:bg-[#0b1220]'
  const sectionClass = 'rounded-[22px] border border-white/8 bg-white/[0.035] p-4'
  const secondaryButtonClass = 'rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-gray-200 transition-all duration-300 hover:bg-white/[0.08]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-white/10 bg-[#111827]/95 shadow-[0_26px_60px_rgba(0,0,0,0.42)]">
        <div className="sticky top-0 z-10 border-b border-white/8 bg-[#111827]/95 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: accent.primary }}>
                Excavator
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-white">{t('admin.addNewExcavator')}</h2>
              <p className="mt-1.5 text-sm text-gray-400">Create a new excavator card with a consistent type accent and cleaner admin layout.</p>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 transition-all duration-300 hover:bg-red-500/12 hover:text-white"
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
                {selectedImageConfig.name}
              </span>
              <span className="text-sm text-gray-400">Accent color updates by excavator type.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className={sectionClass}>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{t('admin.model')} *</label>
              <input type="text" name="model" value={formData.model} onChange={handleChange} required className={inputClass} placeholder="e.g., TB145" />
            </div>

            <div className={sectionClass}>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{t('admin.type')} *</label>
              <select name="type" value={formData.type} onChange={handleChange} required className={inputClass}>
                <option value="mini">{t('admin.mini')}</option>
                <option value="standard">{t('admin.standard')}</option>
                <option value="large">{t('admin.large')}</option>
              </select>
            </div>
          </div>

          <div className={sectionClass}>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{t('admin.price')} *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className={inputClass} placeholder="e.g., 2500" />
          </div>

          <div className={sectionClass}>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{t('admin.specs')}</label>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} required className={inputClass} placeholder={t('admin.weight')} />
              <input type="text" name="bucketCapacity" value={formData.bucketCapacity} onChange={handleChange} required className={inputClass} placeholder={t('admin.bucketCapacity')} />
              <input type="text" name="maxReach" value={formData.maxReach} onChange={handleChange} required className={inputClass} placeholder={t('admin.maxReach')} />
            </div>
          </div>

          <div className={sectionClass}>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{t('admin.excavatorImage')} *</label>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
              {EXCAVATOR_IMAGES.map((image) => {
                const imageAccent = getExcavatorAccent(image.type)
                const isSelected = formData.svgPath === image.path

                return (
                  <button
                    key={image.path}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, svgPath: image.path, type: image.type }))}
                    className="relative rounded-[20px] border p-3 text-left transition-all duration-300"
                    style={{
                      borderColor: isSelected ? imageAccent.borderStrong : 'rgba(255,255,255,0.08)',
                      background: isSelected ? `linear-gradient(145deg, ${imageAccent.tintStrong} 0%, rgba(255,255,255,0.04) 100%)` : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    {isSelected && (
                      <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: imageAccent.primary }}>
                        <Check className="h-3.5 w-3.5 text-[#0b1220]" />
                      </span>
                    )}

                    <div
                      className="mb-3 flex h-24 items-center justify-center rounded-[16px] border p-3"
                      style={{
                        borderColor: isSelected ? imageAccent.border : 'rgba(255,255,255,0.06)',
                        background: `linear-gradient(145deg, rgba(11,18,32,0.8) 0%, ${imageAccent.tint} 100%)`,
                      }}
                    >
                      <Image src={image.path} alt={image.name} width={136} height={82} className="h-full w-full object-contain" />
                    </div>

                    <p className="text-sm font-semibold" style={{ color: isSelected ? imageAccent.text : '#f3f4f6' }}>
                      {image.name}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className={sectionClass}>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{t('admin.description')} *</label>
            <div className="mb-3 flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setDescriptionMode('preset')
                  setFormData((prev) => ({ ...prev, description: EXCAVATOR_PRESET_DESCRIPTIONS[selectedPreset] || '' }))
                }}
                className={`rounded-full px-3 py-1.5 font-medium transition-all ${
                  descriptionMode === 'preset' ? 'bg-red-500/14 text-red-200 ring-1 ring-inset ring-red-500/30' : 'bg-white/[0.04] text-gray-300 ring-1 ring-inset ring-white/10'
                }`}
              >
                {t('admin.preset')}
              </button>
              <button
                type="button"
                onClick={() => setDescriptionMode('custom')}
                className={`rounded-full px-3 py-1.5 font-medium transition-all ${
                  descriptionMode === 'custom' ? 'bg-red-500/14 text-red-200 ring-1 ring-inset ring-red-500/30' : 'bg-white/[0.04] text-gray-300 ring-1 ring-inset ring-white/10'
                }`}
              >
                {t('admin.custom')}
              </button>
            </div>

            {descriptionMode === 'preset' && (
              <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {EXCAVATOR_PRESET_DESCRIPTIONS.map((text, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(idx)
                      setFormData((prev) => ({ ...prev, description: text }))
                    }}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs leading-5 transition-all ${
                      selectedPreset === idx ? 'border-red-500/30 bg-red-500/[0.08] text-white' : 'border-white/8 bg-white/[0.03] text-gray-300 hover:border-white/14 hover:bg-white/[0.05]'
                    }`}
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              disabled={descriptionMode === 'preset'}
              className={`${inputClass} min-h-[104px] resize-none ${descriptionMode === 'preset' ? 'cursor-not-allowed opacity-60' : ''}`}
              placeholder="Perfect for small excavation work around house and garden"
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
              <span className="text-sm text-gray-200">{t('admin.makeVisible')}</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/8 pt-4">
            <button type="button" onClick={onClose} className={secondaryButtonClass}>
              {t('admin.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#0b1220] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: accent.primary }}
            >
              {loading ? t('admin.adding') : t('admin.addExcavator')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
