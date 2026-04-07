'use client'

import React, { useState } from 'react'
import { X, Edit2 } from 'lucide-react'
import { Container, updateContainer } from '@/lib/containers'
import { CONTAINER_PRESET_DESCRIPTIONS } from '@/lib/containerPresets'
import Image from 'next/image'
import { getContainerAccent } from '@/lib/containerAccent'
import { CONTAINER_IMAGE_OPTIONS, isFramedContainerImage, resolveContainerImage } from '@/lib/containerImages'

interface ContainerDetailsModalProps {
  container: Container
  onClose: () => void
  onUpdate: () => void
}

export default function ContainerDetailsModal({ container, onClose, onUpdate }: ContainerDetailsModalProps) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const initialPresetIndex = CONTAINER_PRESET_DESCRIPTIONS.indexOf(container.description || '')
  const [descriptionMode, setDescriptionMode] = useState<'preset' | 'custom'>(initialPresetIndex >= 0 ? 'preset' : 'custom')
  const [selectedPreset, setSelectedPreset] = useState<number>(initialPresetIndex >= 0 ? initialPresetIndex : 0)
  
  // Parse existing dimensions when component mounts
  const parseDimensions = (dims: string) => {
    // Parse format like "2 × 0.5 × 3.8 m" to extract numbers
    const match = dims.match(/([\d.]+)\s*[x×]\s*([\d.]+)\s*[x×]\s*([\d.]+)/)
    if (match) {
      return {
        length: match[1],
        width: match[2],
        height: match[3]
      }
    }
    return { length: '', width: '', height: '' }
  }
  
  const parsedDims = parseDimensions(container.dims)
  
  const [formData, setFormData] = useState({
    volume: container.volume,
    length: parsedDims.length,
    width: parsedDims.width,
    height: parsedDims.height,
    description: container.description || '',
    price: container.price,
    isActive: container.isActive,
    image: resolveContainerImage(container.image)
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveField = async (field: string) => {
    setLoading(true)
    try {
      const updateData: any = {}
      
      if (field === 'volume') updateData.volume = Number(formData.volume)
      if (field === 'dims') {
        // Construct dimensions string from separate fields (optional)
        updateData.dims = (formData.length && formData.width && formData.height) 
          ? `${formData.length} × ${formData.width} × ${formData.height} m`
          : ''
      }
      if (field === 'price') updateData.price = Number(formData.price)
      if (field === 'image') updateData.image = formData.image
      if (field === 'description') updateData.description = formData.description
      
      await updateContainer(container.id, updateData)
      
      // Update local container object immediately
      Object.assign(container, updateData)
      if (typeof updateData.description === 'string') {
        container.description = updateData.description
      }
      
      setEditingField(null)
      onUpdate() // This will refresh the list in background
    } catch (error) {
      console.error('Error updating container:', error)
      alert('Failed to update container')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    const parsedDims = parseDimensions(container.dims)
    setFormData({
      volume: container.volume,
      length: parsedDims.length,
      width: parsedDims.width,
      height: parsedDims.height,
      description: container.description || '',
      price: container.price,
      isActive: container.isActive,
      image: resolveContainerImage(container.image)
    })
    setEditingField(null)
  }

  const panelClass = 'rounded-[22px] border border-white/8 bg-white/[0.035] p-4 transition-all duration-300'
  const editablePanelClass = `${panelClass} group relative cursor-pointer hover:border-red-500/25 hover:bg-white/[0.05]`
  const primaryButtonClass = 'rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60'
  const secondaryButtonClass = 'rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-gray-200 transition-all duration-300 hover:bg-white/[0.08]'
  const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0b1220]/80 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-red-500/40 focus:bg-[#0b1220]'
  const currentImage = resolveContainerImage(container.image)
  const currentImageLabel = CONTAINER_IMAGE_OPTIONS.find(img => img.path === currentImage)?.name || 'Container A'
  const accent = getContainerAccent(container.volume)
  const framedCurrentImage = isFramedContainerImage(currentImage)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-white/10 bg-[#111827]/95 shadow-[0_26px_60px_rgba(0,0,0,0.42)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-white/8 bg-[#111827]/95 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="mb-2 text-xs font-semibold uppercase tracking-[0.24em]"
                style={{ color: accent.primary }}
              >
                Container
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h2
                  className="text-2xl font-semibold tracking-tight"
                  style={{ color: accent.text }}
                >
                  {container.volume} m<sup>3</sup>
                </h2>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                  container.isActive
                    ? 'bg-emerald-500/12 text-emerald-300 ring-1 ring-inset ring-emerald-500/25'
                    : 'bg-red-500/12 text-red-300 ring-1 ring-inset ring-red-500/25'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${container.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  {container.isActive ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-gray-400">
                Update the core details shown on the website.
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 transition-all duration-300 hover:bg-red-500/12 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div
              className={`${editablePanelClass} ${editingField === 'volume' ? 'border-red-500/35 bg-red-500/[0.05]' : ''}`}
              style={editingField === 'volume' ? undefined : {
                borderColor: accent.border,
                background: `linear-gradient(145deg, ${accent.tint} 0%, rgba(255,255,255,0.035) 100%)`,
              }}
              onClick={() => editingField !== 'volume' && setEditingField('volume')}
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <Edit2 className="h-4 w-4 text-red-300" />
              </div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Volume (m³)
              </label>
              {editingField === 'volume' ? (
                <div className="space-y-3">
                  <input
                    type="number"
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveField('volume'); }}
                      disabled={loading}
                      className={`flex-1 ${primaryButtonClass}`}
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                      className={`flex-1 ${secondaryButtonClass}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className="text-3xl font-semibold tracking-tight"
                  style={{ color: accent.text }}
                >
                  {container.volume}
                </p>
              )}
            </div>

            <div
              className={`${editablePanelClass} ${editingField === 'dims' ? 'border-red-500/35 bg-red-500/[0.05]' : ''}`}
              style={editingField === 'dims' ? undefined : { borderColor: accent.border }}
              onClick={() => editingField !== 'dims' && setEditingField('dims')}
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <Edit2 className="h-4 w-4 text-red-300" />
              </div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Dimensions (m)
              </label>
              {editingField === 'dims' ? (
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      min="0.1"
                      step="0.1"
                      className={`${inputClass} w-16 px-2.5 py-2 text-center`}
                      placeholder="2"
                    />
                    <span className="text-white text-lg font-medium">×</span>
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleChange}
                      min="0.1"
                      step="0.1"
                      className={`${inputClass} w-16 px-2.5 py-2 text-center`}
                      placeholder="0.5"
                    />
                    <span className="text-white text-lg font-medium">×</span>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      min="0.1"
                      step="0.1"
                      className={`${inputClass} w-16 px-2.5 py-2 text-center`}
                      placeholder="3.8"
                    />
                    <span className="ml-1 text-sm font-medium text-gray-300">m</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveField('dims'); }}
                      disabled={loading}
                      className={`flex-1 ${primaryButtonClass}`}
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                      className={`flex-1 ${secondaryButtonClass}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className="text-xl font-semibold"
                  style={{ color: accent.text }}
                >
                  {container.dims || 'Not set'}
                </p>
              )}
            </div>

            <div
              className={`${editablePanelClass} ${editingField === 'price' ? 'border-red-500/35 bg-red-500/[0.05]' : ''}`}
              style={editingField === 'price' ? undefined : {
                borderColor: accent.border,
                background: `linear-gradient(145deg, rgba(255,255,255,0.035) 0%, ${accent.tint} 100%)`,
              }}
              onClick={() => editingField !== 'price' && setEditingField('price')}
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <Edit2 className="h-4 w-4 text-red-300" />
              </div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Price (CZK)
              </label>
              {editingField === 'price' ? (
                <div className="space-y-3">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveField('price'); }}
                      disabled={loading}
                      className={`flex-1 ${primaryButtonClass}`}
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                      className={`flex-1 ${secondaryButtonClass}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className="text-2xl font-semibold tracking-tight"
                  style={{ color: accent.text }}
                >
                  {container.price.toLocaleString('cs-CZ')}
                </p>
              )}
            </div>
          </div>

          <div
            className={`${editablePanelClass} ${editingField === 'image' ? 'border-red-500/35 bg-red-500/[0.05]' : ''}`}
            style={editingField === 'image' ? undefined : { borderColor: accent.border }}
            onClick={() => editingField !== 'image' && setEditingField('image')}
          >
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
              <Edit2 className="h-4 w-4 text-red-300" />
            </div>
            <label className="mb-4 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Container Image
            </label>
            {editingField === 'image' ? (
              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  {CONTAINER_IMAGE_OPTIONS.map((img) => {
                    const framedImage = isFramedContainerImage(img.path)

                    return (
                    <div
                      key={img.id}
                      onClick={() => setFormData(prev => ({ ...prev, image: img.path }))}
                      className={`rounded-[18px] border p-3 transition-all duration-300 ${
                        formData.image === img.path
                          ? 'border-red-500/35 bg-red-500/[0.08]'
                          : 'border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.05]'
                      }`}
                      style={formData.image === img.path ? {
                        borderColor: accent.borderStrong,
                        backgroundColor: accent.tintStrong,
                      } : undefined}
                    >
                      <div className="mb-2 text-xs font-medium text-gray-200">{img.name}</div>
                      <div className="flex h-20 items-center justify-center overflow-hidden rounded-xl border border-white/6 bg-[#0b1220]/60 p-2.5">
                        <Image
                          src={img.path}
                          alt={img.name}
                          width={60}
                          height={30}
                          className={`h-full w-full ${framedImage ? 'scale-[1.24] object-cover' : 'object-contain'}`}
                        />
                      </div>
                    </div>
                    )
                  })}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveField('image')}
                    disabled={loading}
                    className={`flex-1 ${primaryButtonClass}`}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className={`flex-1 ${secondaryButtonClass}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[150px_1fr]">
                <div
                  className="flex h-28 items-center justify-center overflow-hidden rounded-[20px] border p-3"
                  style={{
                    borderColor: accent.border,
                    background: `linear-gradient(145deg, rgba(11,18,32,0.84) 0%, ${accent.tint} 100%)`,
                  }}
                >
                  <Image
                    src={currentImage}
                    alt={`${container.volume}m³ container`}
                    width={128}
                    height={64}
                    className={`h-full w-full ${framedCurrentImage ? 'scale-[1.3] object-cover' : 'object-contain'}`}
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{currentImageLabel}</p>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                    Choose the illustration that best matches this container size.
                  </p>
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
            <label className="mb-4 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Description <span className="ml-2 text-[11px] font-normal uppercase tracking-normal text-gray-500">(Optional)</span>
            </label>
            {editingField === 'description' ? (
              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setDescriptionMode('preset'); setFormData(prev => ({ ...prev, description: CONTAINER_PRESET_DESCRIPTIONS[selectedPreset] || '' })) }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${descriptionMode === 'preset' ? 'bg-red-500/14 text-red-200 ring-1 ring-inset ring-red-500/30' : 'bg-white/[0.04] text-gray-300 ring-1 ring-inset ring-white/10'}`}
                  >
                    Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescriptionMode('custom')}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${descriptionMode === 'custom' ? 'bg-red-500/14 text-red-200 ring-1 ring-inset ring-red-500/30' : 'bg-white/[0.04] text-gray-300 ring-1 ring-inset ring-white/10'}`}
                  >
                    Custom
                  </button>
                </div>
                {descriptionMode === 'preset' && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {CONTAINER_PRESET_DESCRIPTIONS.map((text, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setSelectedPreset(idx); setFormData(prev => ({ ...prev, description: text })) }}
                        className={`rounded-2xl border px-4 py-3 text-left text-xs leading-5 transition-all ${
                          selectedPreset === idx
                            ? 'border-red-500/30 bg-red-500/[0.08] text-white'
                            : 'border-white/8 bg-white/[0.03] text-gray-300 hover:border-white/14 hover:bg-white/[0.05]'
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
                  rows={3}
                  placeholder="Add an optional description for this container..."
                  disabled={descriptionMode === 'preset'}
                  className={`${inputClass} min-h-[104px] resize-none ${descriptionMode === 'preset' ? 'cursor-not-allowed opacity-60' : ''}`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveField('description')}
                    disabled={loading}
                    className={`flex-1 ${primaryButtonClass}`}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className={`flex-1 ${secondaryButtonClass}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl">
                <p className="text-sm leading-6 text-gray-300">
                  {container.description || <span className="italic text-gray-500">No description added</span>}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end border-t border-white/8 pt-4">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-gray-200 transition-all duration-300 hover:bg-white/[0.08]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
