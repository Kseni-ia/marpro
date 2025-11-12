'use client'

import React, { useState } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { addExcavator } from '@/lib/excavators'
import { EXCAVATOR_PRESET_DESCRIPTIONS } from '@/lib/excavatorPresets'
import { uploadImage, validateImageFile } from '@/lib/uploadImage'
import Image from 'next/image'

interface AddExcavatorModalProps {
  onClose: () => void
  onSuccess: () => void
}

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
    isActive: true
  })
  const [descriptionMode, setDescriptionMode] = useState<'preset' | 'custom'>('preset')
  const [selectedPreset, setSelectedPreset] = useState<number>(0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl: string | undefined

      // Upload image if one is selected
      if (imageFile) {
        setUploadingImage(true)
        try {
          imageUrl = await uploadImage(imageFile, 'excavators')
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          // Continue without image, but show warning
          alert('Image upload failed. Excavator will be created without an image. Please check Firebase Storage configuration.')
          imageUrl = undefined
        }
        setUploadingImage(false)
      }

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
        isActive: formData.isActive,
        imageUrl
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding excavator:', error)
      alert(t('admin.failedAdd'))
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      validateImageFile(file)
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Invalid image file')
      e.target.value = ''
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
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

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-medium text-gray-dark-text mb-1">
              {t('admin.excavatorImage')}
            </label>
            <div className="space-y-2">
              {imagePreview ? (
                <div className="relative w-full h-48 bg-gray-dark-card border-2 border-gray-dark-border rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-dark-border rounded-lg cursor-pointer bg-gray-dark-card hover:bg-gray-800/60 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
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
              disabled={loading || uploadingImage}
              className="flex-1 px-4 py-2 bg-red-950/40 text-white hover:bg-red-900/60 border border-red-900/50 hover:border-red-600 rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? 'Uploading image...' : loading ? t('admin.adding') : t('admin.addExcavator')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
