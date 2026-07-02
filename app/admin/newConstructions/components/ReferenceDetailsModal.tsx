'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { updateReference, deleteReference, Reference, REFERENCE_CATEGORIES, ReferenceCategory } from '@/lib/constructions'
import { uploadMultipleMedia, validateMultipleMedia } from '@/lib/imageUpload'
import MediaUploader from './MediaUploader'

interface ReferenceDetailsModalProps {
  reference: Reference
  onClose: () => void
  onUpdate: () => void
}

export default function ReferenceDetailsModal({ reference, onClose, onUpdate }: ReferenceDetailsModalProps) {
  const [formData, setFormData] = useState({
    title: reference.title,
    description: reference.description,
    imageUrls: reference.imageUrls || [],
    category: reference.category || 'demolice' as ReferenceCategory,
    isActive: reference.isActive
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState<Record<number, number> | null>(null)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

  const handleAddFiles = (files: FileList) => {
    const validation = validateMultipleMedia(files)
    if (!validation.isValid) {
      setError(validation.error || 'Neplatné soubory')
      return
    }

    // Check total media limit (existing + new)
    const totalImages = formData.imageUrls.length + newImageFiles.length + files.length
    if (totalImages > 10) {
      setError(`Celkový počet souborů nesmí přesáhnout 10. Aktuálně máte ${formData.imageUrls.length + newImageFiles.length}, přidáváte ${files.length}`)
      return
    }

    const newFiles = Array.from(files)
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    
    setNewImageFiles(prev => [...prev, ...newFiles])
    setNewImagePreviews(prev => [...prev, ...newPreviews])
    setError('')
  }

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index)
      // Revoke the blob URL to prevent memory leaks
      URL.revokeObjectURL(prev[index])
      return newPreviews
    })
  }

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrls = formData.imageUrls

      // Upload new media if any are selected
      if (newImageFiles.length > 0) {
        setUploadProgress(Object.fromEntries(newImageFiles.map((_, index) => [index, 0])))
        const uploadedUrls = await uploadMultipleMedia(newImageFiles, 'references', (index, percent) => {
          setUploadProgress((prev) => (prev ? { ...prev, [index]: percent } : prev))
        })
        imageUrls = [...imageUrls, ...uploadedUrls]
      }

      // Update reference with all image URLs
      await updateReference(reference.id, {
        ...formData,
        imageUrls
      })
      
      onUpdate()
      onClose()
    } catch (error) {
      setError('Nepodařilo se aktualizovat referenci')
    } finally {
      setLoading(false)
      setUploadProgress(null)
      // Clean up blob URLs
      newImagePreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDelete = async () => {
    if (confirm('Opravdu chcete smazat tuto referenci?')) {
      try {
        await deleteReference(reference.id)
        onUpdate()
        onClose()
      } catch (error) {
        setError('Nepodařilo se smazat referenci')
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Upravit referenci</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
            title="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Název
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Zadejte název reference"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Popis
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Zadejte popis reference"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Kategorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ReferenceCategory }))}
              required
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {REFERENCE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-gray-800">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <MediaUploader
            files={newImageFiles}
            previews={newImagePreviews}
            existingUrls={formData.imageUrls}
            uploadProgress={uploadProgress}
            onAddFiles={handleAddFiles}
            onRemoveFile={removeNewImage}
            onRemoveExisting={removeExistingImage}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-red-500 text-red-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
              Viditelné na webu
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Smazat
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {uploadProgress ? 'Nahrává se…' : loading ? 'Ukládá se…' : 'Uložit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
