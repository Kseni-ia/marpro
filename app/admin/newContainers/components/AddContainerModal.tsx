'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { addContainer } from '@/lib/containers'
import { CONTAINER_PRESET_DESCRIPTIONS } from '@/lib/containerPresets'
import Image from 'next/image'

interface AddContainerModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddContainerModal({ onClose, onSuccess }: AddContainerModalProps) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  
  // Available container images
  const containerImages = [
    { path: '/container-small.svg', name: 'Small (3m³)' },
    { path: '/container-medium.svg', name: 'Medium (5m³)' },
    { path: '/container-large.svg', name: 'Large (7m³)' }
  ]
  
  const [formData, setFormData] = useState({
    volume: '',
    length: '',
    width: '',
    height: '',
    description: CONTAINER_PRESET_DESCRIPTIONS[0] || '',
    price: '',
    image: '/container-medium.svg', // Default image
    isActive: true
  })
  const [descriptionMode, setDescriptionMode] = useState<'preset' | 'custom'>('preset')
  const [selectedPreset, setSelectedPreset] = useState<number>(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Construct dimensions string from separate fields (optional)
      const dims = (formData.length && formData.width && formData.height) 
        ? `${formData.length} × ${formData.width} × ${formData.height} m`
        : ''
      
      await addContainer({
        volume: Number(formData.volume),
        dims: dims,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image,
        isActive: formData.isActive
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding container:', error)
      alert(t('admin.failedAdd'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-card-dark border-b border-gray-dark-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-dark-text">{t('admin.addNewContainer')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-red-950/40 text-white hover:bg-red-900/60 flex items-center justify-center transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Volume and Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-dark-text mb-1">
                {t('admin.volume')} *
              </label>
              <input
                type="number"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
                placeholder="e.g., 3"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-medium text-gray-dark-text mb-1">
                {t('admin.price')} (CZK) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
                placeholder="e.g., 400"
              />
            </div>
          </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-dark-text mb-1">
                {t('admin.dimensions')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  className="w-20 px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 text-center"
                  placeholder="2"
                />
                <span className="text-gray-dark-text text-lg font-medium">×</span>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  className="w-20 px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 text-center"
                  placeholder="0.5"
                />
                <span className="text-gray-dark-text text-lg font-medium">×</span>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  className="w-20 px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 text-center"
                  placeholder="3.8"
                />
                <span className="text-gray-dark-text text-sm font-medium ml-1">m</span>
              </div>
            </div>

          {/* Container Image Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-dark-text mb-2">
              {t('admin.containerImage')} *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {containerImages.map((image) => (
                <div
                  key={image.path}
                  onClick={() => setFormData(prev => ({ ...prev, image: image.path }))}
                  className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 ${
                    formData.image === image.path
                      ? 'border-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                      : 'border-gray-dark-border hover:border-gray-dark-accent hover:bg-gray-dark-bg/50'
                  }`}
                >
                  <div className="aspect-square mb-2">
                    <Image
                      src={image.path}
                      alt={image.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-center text-gray-dark-text font-medium">
                    {image.name}
                  </p>
                  {formData.image === image.path && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-dark-text mb-1">
              {t('admin.description')} *
            </label>
            <div className="flex items-center gap-2 mb-2 text-xs">
              <button
                type="button"
                onClick={() => { setDescriptionMode('preset'); setFormData(prev => ({ ...prev, description: CONTAINER_PRESET_DESCRIPTIONS[selectedPreset] || '' })) }}
                className={`px-2 py-1 rounded border ${descriptionMode === 'preset' ? 'bg-red-900/40 border-red-700 text-white' : 'bg-gray-800/40 border-gray-700 text-gray-300'}`}
              >
                {t('admin.preset')}
              </button>
              <button
                type="button"
                onClick={() => setDescriptionMode('custom')}
                className={`px-2 py-1 rounded border ${descriptionMode === 'custom' ? 'bg-red-900/40 border-red-700 text-white' : 'bg-gray-800/40 border-gray-700 text-gray-300'}`}
              >
                {t('admin.custom')}
              </button>
            </div>
            {descriptionMode === 'preset' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                {CONTAINER_PRESET_DESCRIPTIONS.map((text, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setSelectedPreset(idx); setFormData(prev => ({ ...prev, description: text })) }}
                    className={`text-left px-3 py-2 rounded-lg border text-xs ${selectedPreset === idx ? 'border-red-600 bg-red-950/30 text-white' : 'border-gray-700 bg-gray-800/40 text-gray-300 hover:border-gray-600'}`}
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
              rows={2}
              disabled={descriptionMode === 'preset'}
              className={`w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 ${descriptionMode === 'preset' ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="Perfect for small renovations and household waste"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-dark-border bg-gray-dark-card text-red-600 focus:ring-red-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-dark-text">
              {t('admin.makeVisible')}
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800/40 text-gray-400 hover:bg-gray-700/60 border border-gray-700/50 hover:border-gray-600 rounded-lg transition-all duration-300 text-sm font-medium"
            >
              {t('admin.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-950/40 text-white hover:bg-red-900/60 border border-red-900/50 hover:border-red-600 rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('admin.adding') : t('admin.addContainer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
