'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { addWasteType, VolumePricing } from '@/lib/wasteTypes'

interface AddWasteTypeModalProps {
  onClose: () => void
  onSuccess: () => void
}

// Common container volumes
const COMMON_VOLUMES = [3, 5, 10, 15, 40]

export default function AddWasteTypeModal({ onClose, onSuccess }: AddWasteTypeModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    pricing: [
      { volume: 3, price: 0, weightLimit: 4 },
      { volume: 5, price: 0, weightLimit: 6 },
      { volume: 10, price: 0, weightLimit: 14 },
      { volume: 15, price: 0, weightLimit: 17 }
    ] as VolumePricing[]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Vyplňte název typu odpadu')
      return
    }

    if (formData.pricing.some(p => p.price <= 0)) {
      alert('Všechny ceny musí být větší než 0')
      return
    }

    setLoading(true)
    try {
      await addWasteType({
        name: {
          cs: formData.name,
          en: formData.name,
          ru: formData.name
        },
        pricing: formData.pricing,
        isActive: true,
        order: Date.now()
      })
      onSuccess()
    } catch (error) {
      console.error('Error adding waste type:', error)
      alert('Nepodařilo se přidat typ odpadu')
    } finally {
      setLoading(false)
    }
  }

  const updatePricing = (index: number, field: keyof VolumePricing, value: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: prev.pricing.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }))
  }

  const addPricingRow = () => {
    const usedVolumes = formData.pricing.map(p => p.volume)
    const availableVolume = COMMON_VOLUMES.find(v => !usedVolumes.includes(v)) || 20
    
    setFormData(prev => ({
      ...prev,
      pricing: [...prev.pricing, { volume: availableVolume, price: 0, weightLimit: 5 }]
    }))
  }

  const removePricingRow = (index: number) => {
    if (formData.pricing.length <= 1) return
    setFormData(prev => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index)
    }))
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900/98 to-gray-800/98 backdrop-blur-xl border-b border-gray-700/50 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Přidat typ odpadu</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-red-950/40 text-white hover:bg-red-900/60 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Název typu odpadu *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white text-base focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="např. Suť a betony, Zemina, Čisté dřevo..."
              required
            />
          </div>

          {/* Pricing Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Ceny dle objemu</h3>
              <button
                type="button"
                onClick={addPricingRow}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Přidat objem
              </button>
            </div>

            <div className="space-y-2">
              {formData.pricing.map((pricing, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 mb-1">Objem (m³)</label>
                    <select
                      value={pricing.volume}
                      onChange={(e) => updatePricing(index, 'volume', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-red-500"
                    >
                      {COMMON_VOLUMES.map(v => (
                        <option key={v} value={v}>{v} m³</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 mb-1">Cena (Kč)</label>
                    <input
                      type="number"
                      value={pricing.price || ''}
                      onChange={(e) => updatePricing(index, 'price', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-red-500"
                      placeholder="3090"
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 mb-1">Max. váha (t)</label>
                    <input
                      type="number"
                      value={pricing.weightLimit || ''}
                      onChange={(e) => updatePricing(index, 'weightLimit', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-red-500"
                      placeholder="4"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  {formData.pricing.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePricingRow(index)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors mt-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 rounded-xl text-sm font-semibold transition-all"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Ukládám...' : 'Přidat typ odpadu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
