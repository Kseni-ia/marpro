'use client'

import React, { useState } from 'react'
import { Edit2, X } from 'lucide-react'
import Image from 'next/image'
import { Excavator, updateExcavator } from '@/lib/excavators'
import { getExcavatorAccent } from '@/lib/excavatorAccent'

interface ExcavatorDetailsModalProps {
  excavator: Excavator
  onClose: () => void
  onUpdate: () => void
}

const EXCAVATOR_IMAGES = [
  { path: '/TB145.svg', name: 'TB145', type: 'mini' },
  { path: '/TB290-1.svg', name: 'TB290-1', type: 'standard' },
  { path: '/TB290-2.svg.svg', name: 'TB290-2', type: 'large' }
]

export default function ExcavatorDetailsModal({ excavator, onClose, onUpdate }: ExcavatorDetailsModalProps) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    model: excavator.model,
    type: excavator.type,
    description: excavator.description.en || '',
    price: excavator.price,
    weight: excavator.specs.weight,
    bucketCapacity: excavator.specs.bucketCapacity,
    maxReach: excavator.specs.maxReach,
    svgPath: excavator.svgPath || '/TB145.svg',
    isActive: excavator.isActive,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveField = async (field: string) => {
    setLoading(true)
    try {
      const updateData: any = {}

      if (field === 'model') updateData.model = formData.model
      if (field === 'type') updateData.type = formData.type
      if (field === 'price') updateData.price = Number(formData.price)
      if (field === 'svgPath') updateData.svgPath = formData.svgPath
      if (field === 'specs') {
        updateData.specs = {
          weight: formData.weight,
          bucketCapacity: formData.bucketCapacity,
          maxReach: formData.maxReach,
        }
      }
      if (field === 'description') {
        updateData.description = {
          en: formData.description,
          cs: formData.description,
          ru: formData.description,
        }
      }

      await updateExcavator(excavator.id, updateData)
      Object.assign(excavator, updateData)
      if (updateData.description) excavator.description = updateData.description
      if (updateData.specs) excavator.specs = updateData.specs

      setEditingField(null)
      onUpdate()
    } catch (error) {
      console.error('Error updating excavator:', error)
      alert('Failed to update excavator')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      model: excavator.model,
      type: excavator.type,
      description: excavator.description.en || '',
      price: excavator.price,
      weight: excavator.specs.weight,
      bucketCapacity: excavator.specs.bucketCapacity,
      maxReach: excavator.specs.maxReach,
      svgPath: excavator.svgPath || '/TB145.svg',
      isActive: excavator.isActive,
    })
    setEditingField(null)
  }

  const accent = getExcavatorAccent(formData.type)
  const currentImage = formData.svgPath || '/TB145.svg'
  const currentImageLabel = EXCAVATOR_IMAGES.find((image) => image.path === currentImage)?.name || 'TB145'
  const panelClass = 'rounded-[22px] border border-white/8 bg-white/[0.035] p-4 transition-all duration-300'
  const editablePanelClass = `${panelClass} group relative cursor-pointer hover:border-red-500/25 hover:bg-white/[0.05]`
  const primaryButtonClass = 'rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60'
  const secondaryButtonClass = 'rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-gray-200 transition-all duration-300 hover:bg-white/[0.08]'
  const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0b1220]/80 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-red-500/40 focus:bg-[#0b1220]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-white/10 bg-[#111827]/95 shadow-[0_26px_60px_rgba(0,0,0,0.42)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-white/8 bg-[#111827]/95 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: accent.primary }}>
                Excavator
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold tracking-tight" style={{ color: accent.text }}>
                  {excavator.model}
                </h2>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    excavator.isActive
                      ? 'bg-emerald-500/12 text-emerald-300 ring-1 ring-inset ring-emerald-500/25'
                      : 'bg-red-500/12 text-red-300 ring-1 ring-inset ring-red-500/25'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${excavator.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  {excavator.isActive ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-gray-400">Update the excavator card details shown in the admin and on the website.</p>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 transition-all duration-300 hover:bg-red-500/12 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div
              className={`${editablePanelClass} ${editingField === 'model' ? 'border-red-500/35 bg-red-500/[0.05]' : ''}`}
              style={editingField === 'model' ? undefined : { borderColor: accent.border, background: `linear-gradient(145deg, ${accent.tint} 0%, rgba(255,255,255,0.035) 100%)` }}
              onClick={() => editingField !== 'model' && setEditingField('model')}
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <Edit2 className="h-4 w-4 text-red-300" />
              </div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Model</label>
              {editingField === 'model' ? (
                <div className="space-y-3">
                  <input type="text" name="model" value={formData.model} onChange={handleChange} onClick={(e) => e.stopPropagation()} className={inputClass} />
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleSaveField('model') }} disabled={loading} className={`flex-1 ${primaryButtonClass}`}>Save</button>
                    <button onClick={(e) => { e.stopPropagation(); handleCancelEdit() }} className={`flex-1 ${secondaryButtonClass}`}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-3xl font-semibold tracking-tight" style={{ color: accent.text }}>{excavator.model}</p>
              )}
            </div>

            <div
              className={`${editablePanelClass} ${editingField === 'type' ? 'border-red-500/35 bg-red-500/[0.05]' : ''}`}
              style={editingField === 'type' ? undefined : { borderColor: accent.border }}
              onClick={() => editingField !== 'type' && setEditingField('type')}
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <Edit2 className="h-4 w-4 text-red-300" />
              </div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Type</label>
              {editingField === 'type' ? (
                <div className="space-y-3">
                  <select name="type" value={formData.type} onChange={handleChange} onClick={(e) => e.stopPropagation()} className={inputClass}>
                    <option value="mini">Mini</option>
                    <option value="standard">Standard</option>
                    <option value="large">Large</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleSaveField('type') }} disabled={loading} className={`flex-1 ${primaryButtonClass}`}>Save</button>
                    <button onClick={(e) => { e.stopPropagation(); handleCancelEdit() }} className={`flex-1 ${secondaryButtonClass}`}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-xl font-semibold capitalize" style={{ color: accent.text }}>{excavator.type}</p>
              )}
            </div>

            <div
              className={`${editablePanelClass} ${editingField === 'price' ? 'border-red-500/35 bg-red-500/[0.05]' : ''}`}
              style={editingField === 'price' ? undefined : { borderColor: accent.border, background: `linear-gradient(145deg, rgba(255,255,255,0.035) 0%, ${accent.tint} 100%)` }}
              onClick={() => editingField !== 'price' && setEditingField('price')}
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <Edit2 className="h-4 w-4 text-red-300" />
              </div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Price (CZK/hour)</label>
              {editingField === 'price' ? (
                <div className="space-y-3">
                  <input type="number" name="price" value={formData.price} onChange={handleChange} onClick={(e) => e.stopPropagation()} className={inputClass} />
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleSaveField('price') }} disabled={loading} className={`flex-1 ${primaryButtonClass}`}>Save</button>
                    <button onClick={(e) => { e.stopPropagation(); handleCancelEdit() }} className={`flex-1 ${secondaryButtonClass}`}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-2xl font-semibold tracking-tight" style={{ color: accent.text }}>{excavator.price.toLocaleString('cs-CZ')}</p>
              )}
            </div>
          </div>

          <div
            className={`${editablePanelClass} ${editingField === 'specs' ? 'border-red-500/35 bg-red-500/[0.05]' : ''}`}
            style={editingField === 'specs' ? undefined : { borderColor: accent.border }}
            onClick={() => editingField !== 'specs' && setEditingField('specs')}
          >
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
              <Edit2 className="h-4 w-4 text-red-300" />
            </div>
            <label className="mb-4 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Specifications</label>
            {editingField === 'specs' ? (
              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  <input type="text" name="weight" value={formData.weight} onChange={handleChange} className={inputClass} placeholder="Weight" />
                  <input type="text" name="bucketCapacity" value={formData.bucketCapacity} onChange={handleChange} className={inputClass} placeholder="Bucket capacity" />
                  <input type="text" name="maxReach" value={formData.maxReach} onChange={handleChange} className={inputClass} placeholder="Max reach" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveField('specs')} disabled={loading} className={`flex-1 ${primaryButtonClass}`}>Save</button>
                  <button onClick={handleCancelEdit} className={`flex-1 ${secondaryButtonClass}`}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Weight</p>
                  <p className="mt-1.5 text-base font-semibold text-white">{excavator.specs.weight}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Bucket</p>
                  <p className="mt-1.5 text-base font-semibold text-white">{excavator.specs.bucketCapacity}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Reach</p>
                  <p className="mt-1.5 text-base font-semibold text-white">{excavator.specs.maxReach}</p>
                </div>
              </div>
            )}
          </div>

          <div
            className={`${editablePanelClass} ${editingField === 'svgPath' ? 'border-red-500/35 bg-red-500/[0.05]' : ''}`}
            style={editingField === 'svgPath' ? undefined : { borderColor: accent.border }}
            onClick={() => editingField !== 'svgPath' && setEditingField('svgPath')}
          >
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
              <Edit2 className="h-4 w-4 text-red-300" />
            </div>
            <label className="mb-4 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Excavator Image</label>
            {editingField === 'svgPath' ? (
              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  {EXCAVATOR_IMAGES.map((image) => {
                    const imageAccent = getExcavatorAccent(image.type)
                    const isSelected = formData.svgPath === image.path

                    return (
                      <button
                        key={image.path}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, svgPath: image.path }))}
                        className="rounded-[18px] border p-3 text-left transition-all duration-300"
                        style={{
                          borderColor: isSelected ? imageAccent.borderStrong : 'rgba(255,255,255,0.08)',
                          background: isSelected ? `linear-gradient(145deg, ${imageAccent.tintStrong} 0%, rgba(255,255,255,0.04) 100%)` : 'rgba(255,255,255,0.03)',
                        }}
                      >
                        <div className="mb-2 text-xs font-medium text-gray-200">{image.name}</div>
                        <div className="flex h-20 items-center justify-center rounded-xl border border-white/6 bg-[#0b1220]/60 p-2.5">
                          <Image src={image.path} alt={image.name} width={108} height={64} className="h-full w-full object-contain" />
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveField('svgPath')} disabled={loading} className={`flex-1 ${primaryButtonClass}`}>Save</button>
                  <button onClick={handleCancelEdit} className={`flex-1 ${secondaryButtonClass}`}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[150px_1fr]">
                <div className="flex h-28 items-center justify-center rounded-[20px] border p-3" style={{ borderColor: accent.border, background: `linear-gradient(145deg, rgba(11,18,32,0.84) 0%, ${accent.tint} 100%)` }}>
                  <Image src={currentImage} alt={`${excavator.model} excavator`} width={142} height={80} className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{currentImageLabel}</p>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">Choose the machine illustration that best matches this excavator card.</p>
                </div>
              </div>
            )}
          </div>

          <div
            className={`${editablePanelClass} ${editingField === 'description' ? 'border-red-500/35 bg-red-500/[0.05]' : ''}`}
            style={editingField === 'description' ? undefined : { borderColor: accent.border }}
            onClick={() => editingField !== 'description' && setEditingField('description')}
          >
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
              <Edit2 className="h-4 w-4 text-red-300" />
            </div>
            <label className="mb-4 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Description</label>
            {editingField === 'description' ? (
              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add an optional description for this excavator..."
                  className={`${inputClass} min-h-[104px] resize-none`}
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSaveField('description')} disabled={loading} className={`flex-1 ${primaryButtonClass}`}>Save</button>
                  <button onClick={handleCancelEdit} className={`flex-1 ${secondaryButtonClass}`}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl">
                <p className="text-sm leading-6 text-gray-300">
                  {excavator.description.en || <span className="italic text-gray-500">No description added</span>}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end border-t border-white/8 pt-4">
            <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-gray-200 transition-all duration-300 hover:bg-white/[0.08]">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
