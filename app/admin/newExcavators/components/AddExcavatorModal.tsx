'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { addExcavator } from '@/lib/excavators'

interface AddExcavatorModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddExcavatorModal({ onClose, onSuccess }: AddExcavatorModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    model: '',
    type: 'mini',
    descriptionEn: '',
    descriptionCs: '',
    descriptionRu: '',
    price: '',
    weight: '',
    bucketCapacity: '',
    maxReach: '',
    isActive: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addExcavator({
        model: formData.model,
        type: formData.type,
        description: {
          en: formData.descriptionEn,
          cs: formData.descriptionCs,
          ru: formData.descriptionRu
        },
        price: Number(formData.price),
        specs: {
          weight: formData.weight,
          bucketCapacity: formData.bucketCapacity,
          maxReach: formData.maxReach
        },
        isActive: formData.isActive
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding excavator:', error)
      alert('Failed to add excavator. Please try again.')
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
          <h2 className="text-xl font-bold text-gray-dark-text">Add New Excavator</h2>
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
                Model *
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
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
              >
                <option value="mini">Mini</option>
                <option value="standard">Standard</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-gray-dark-text mb-1">
              Price (CZK/day) *
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
                Weight *
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
                Bucket Capacity *
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
                Max Reach *
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

          {/* Description English */}
          <div>
            <label className="block text-xs font-medium text-gray-dark-text mb-1">
              Description (English) *
            </label>
            <textarea
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
              placeholder="Perfect for small excavation work"
            />
          </div>

          {/* Description Czech */}
          <div>
            <label className="block text-xs font-medium text-gray-dark-text mb-1">
              Description (Czech) *
            </label>
            <textarea
              name="descriptionCs"
              value={formData.descriptionCs}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
              placeholder="Ideální pro malé výkopové práce"
            />
          </div>

          {/* Description Russian */}
          <div>
            <label className="block text-xs font-medium text-gray-dark-text mb-1">
              Description (Russian) *
            </label>
            <textarea
              name="descriptionRu"
              value={formData.descriptionRu}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
              placeholder="Идеально подходит для небольших земляных работ"
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
              Make visible on website immediately
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800/40 text-gray-400 hover:bg-gray-700/60 border border-gray-700/50 hover:border-gray-600 rounded-lg transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-950/40 text-white hover:bg-red-900/60 border border-red-900/50 hover:border-red-600 rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Excavator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
