'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Save } from 'lucide-react'
import { WasteType, VolumePricing, updateWasteType } from '@/lib/wasteTypes'

interface WasteTypeDetailsModalProps {
  wasteType: WasteType
  onClose: () => void
  onUpdate: () => void
}

// Common container volumes
const COMMON_VOLUMES = [3, 5, 10, 15, 40]

export default function WasteTypeDetailsModal({ wasteType, onClose, onUpdate }: WasteTypeDetailsModalProps) {
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: wasteType.name.cs || '',
    pricing: [...wasteType.pricing],
    order: wasteType.order
  })

  useEffect(() => {
    setFormData({
      name: wasteType.name.cs || '',
      pricing: [...wasteType.pricing],
      order: wasteType.order
    })
  }, [wasteType])

  const handleSave = async () => {
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
      await updateWasteType(wasteType.id, {
        name: {
          cs: formData.name,
          en: formData.name,
          ru: formData.name
        },
        pricing: formData.pricing,
        order: formData.order
      })
      onUpdate()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating waste type:', error)
      alert('Nepodařilo se aktualizovat typ odpadu')
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
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? 'Upravit typ odpadu' : 'Detail typu odpadu'}
            </h2>
            <p className="text-sm text-gray-400">{wasteType.name.cs}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-red-950/40 text-white hover:bg-red-900/60 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {isEditing ? (
            <>
              {/* Edit Mode - Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Název typu odpadu *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white text-base focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="např. Suť a betony"
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

              {/* Order */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Pořadí zobrazení</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                  className="w-24 px-3 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                  min="0"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: wasteType.name.cs || '',
                      pricing: [...wasteType.pricing],
                      order: wasteType.order
                    })
                    setIsEditing(false)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 rounded-xl text-sm font-semibold transition-all"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Ukládám...' : 'Uložit změny'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              <div className="space-y-4">
                {/* Name Display */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Název</span>
                  <p className="text-xl font-bold text-white mt-1">{wasteType.name.cs || '-'}</p>
                </div>

                {/* Pricing Table - Improved */}
                <div className="bg-gray-800/50 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 bg-gray-700/50 px-4 py-2">
                    <span className="text-xs font-bold text-gray-300 uppercase">Objem</span>
                    <span className="text-xs font-bold text-gray-300 uppercase text-center">Cena</span>
                    <span className="text-xs font-bold text-gray-300 uppercase text-right">Max. váha</span>
                  </div>
                  {wasteType.pricing.map((p, index) => (
                    <div key={index} className="grid grid-cols-3 px-4 py-3 border-t border-gray-700/30 hover:bg-gray-700/30 transition-colors">
                      <span className="text-white font-semibold">{p.volume} m³</span>
                      <span className="text-green-400 font-bold text-center text-lg">{p.price.toLocaleString('cs-CZ')} Kč</span>
                      <span className="text-gray-400 text-right">{p.weightLimit} t</span>
                    </div>
                  ))}
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${wasteType.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {wasteType.isActive ? '✓ Aktivní' : '✗ Neaktivní'}
                  </span>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 rounded-xl font-semibold transition-all"
                >
                  <Save className="w-4 h-4" />
                  Upravit ceník
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
