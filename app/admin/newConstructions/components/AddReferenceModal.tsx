'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { createReference } from '@/lib/constructions'
import { uploadMultipleImages, validateMultipleImages } from '@/lib/imageUpload'

interface AddReferenceModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddReferenceModal({ onClose, onSuccess }: AddReferenceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrls: [] as string[],
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const validation = validateMultipleImages(files)
    if (!validation.isValid) {
      setError(validation.error || 'Neplatné soubory')
      return
    }

    // Check total images limit (existing + new)
    const totalImages = formData.imageUrls.length + files.length
    if (totalImages > 10) {
      setError(`Celkový počet fotografií nesmí přesáhnout 10. Aktuálně máte ${formData.imageUrls.length}, přidáváte ${files.length}`)
      return
    }

    const newFiles = Array.from(files)
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    
    setImageFiles(prev => [...prev, ...newFiles])
    setImagePreviews(prev => [...prev, ...newPreviews])
    setError('')
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index)
      // Revoke the blob URL to prevent memory leaks
      URL.revokeObjectURL(prev[index])
      return newPreviews
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrls = formData.imageUrls

      // Upload new images if any are selected
      if (imageFiles.length > 0) {
        setUploadProgress(10)
        const uploadedUrls = await uploadMultipleImages(imageFiles, 'references')
        setUploadProgress(100)
        imageUrls = [...imageUrls, ...uploadedUrls]
      }

      // Create reference with all image URLs
      await createReference({
        ...formData,
        imageUrls
      })
      
      onSuccess()
      onClose()
    } catch (error) {
      setError('Nepodařilo se vytvořit referenci')
    } finally {
      setLoading(false)
      setUploadProgress(0)
      // Clean up blob URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Přidat novou referenci</h3>
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
              Fotografie ({imageFiles.length + formData.imageUrls.length}/10)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              multiple
              onChange={handleImageChange}
              disabled={imageFiles.length + formData.imageUrls.length >= 10}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-red-600 file:text-white hover:file:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Povolené formáty: JPEG, PNG, GIF, WebP (max 500KB na soubor, max 10 fotografií celkem)
            </p>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Náhled fotografií
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Náhled ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Odstranit fotografii"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

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
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={loading || imageFiles.length === 0}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Vytváří se...' : 'Vytvořit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
