'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { addExcavator } from '@/lib/excavators'
import { EXCAVATOR_PRESET_DESCRIPTIONS } from '@/lib/excavatorPresets'
import Image from 'next/image'

interface AddExcavatorModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddExcavatorModal({ onClose, onSuccess }: AddExcavatorModalProps) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  
  // Available excavator images
  const excavatorImages = [
    { path: '/TB145.svg', name: 'TB145' },
    { path: '/TB290-1.svg', name: 'TB290-1' },
    { path: '/TB290-2.svg.svg', name: 'TB290-2' }
  ]
  
  const [formData, setFormData] = useState({
    model: '',
    type: 'mini',
    description: EXCAVATOR_PRESET_DESCRIPTIONS[0] || '',
    price: '',
    weight: '',
    bucketCapacity: '',
    maxReach: '',
    svgPath: '/TB145.svg', // Default image
    isActive: true
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
          ru: formData.description
        },
        price: Number(formData.price),
        specs: {
          weight: formData.weight,
          bucketCapacity: formData.bucketCapacity,
          maxReach: formData.maxReach
        },
        svgPath: formData.svgPath,
        isActive: formData.isActive
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding excavator:', error)
      alert(t('admin.failedAdd'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }


  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-card-dark border-b border-gray-dark-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-dark-text">{t('admin.addNewExcavator')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-red-950/40 text-white hover:bg-red-900/60 flex items-center justify-center transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Model and Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-dark-text mb-1">
                {t('admin.model')} *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
                placeholder="e.g., TB145"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-dark-text mb-1">
                {t('admin.type')} *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
              >
                <option value="mini">{t('admin.mini')}</option>
                <option value="standard">{t('admin.standard')}</option>
                <option value="large">{t('admin.large')}</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-gray-dark-text mb-1">
              {t('admin.price')} (CZK/hour) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
              placeholder="e.g., 2500"
            />
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-dark-text mb-1">
                {t('admin.weight')} *
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
                placeholder="e.g., 1.5t"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-dark-text mb-1">
                {t('admin.bucketCapacity')} *
              </label>
              <input
                type="text"
                name="bucketCapacity"
                value={formData.bucketCapacity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
                placeholder="e.g., 0.04m³"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-dark-text mb-1">
                {t('admin.maxReach')} *
              </label>
              <input
                type="text"
                name="maxReach"
                value={formData.maxReach}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
                placeholder="e.g., 3.8m"
              />
            </div>
          </div>

          {/* Excavator Image Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-dark-text mb-2">
              {t('admin.excavatorImage')} *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {excavatorImages.map((image) => (
                <div
                  key={image.path}
                  onClick={() => setFormData(prev => ({ ...prev, svgPath: image.path }))}
                  className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 ${
                    formData.svgPath === image.path
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
                  {formData.svgPath === image.path && (
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

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-dark-text mb-1">
              {t('admin.description')} *
            </label>
            <div className="flex items-center gap-2 mb-2 text-xs">
              <button
                type="button"
                onClick={() => { setDescriptionMode('preset'); setFormData(prev => ({ ...prev, description: EXCAVATOR_PRESET_DESCRIPTIONS[selectedPreset] || '' })) }}
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
                {EXCAVATOR_PRESET_DESCRIPTIONS.map((text, idx) => (
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
              placeholder="Perfect for small excavation work around house and garden"
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
              {loading ? t('admin.adding') : t('admin.addExcavator')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
