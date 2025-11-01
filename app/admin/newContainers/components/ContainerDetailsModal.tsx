'use client'

import React, { useState, useEffect } from 'react'
import { X, Edit2 } from 'lucide-react'
import { Container, updateContainer } from '@/lib/containers'
import { CONTAINER_PRESET_DESCRIPTIONS } from '@/lib/containerPresets'

interface ContainerDetailsModalProps {
  container: Container
  onClose: () => void
  onUpdate: () => void
}

// Available container images
const CONTAINER_IMAGES = [
  { id: 'container-1', name: 'Standard Container', path: '/containers/container-1.svg' },
  { id: 'container-2', name: 'Large Container', path: '/containers/container-2.svg' },
  { id: 'container-3', name: 'Small Container', path: '/containers/container-3.svg' },
  { id: 'container-4', name: 'Wide Container', path: '/containers/container-4.svg' },
]

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
    image: container.image || 'container-1'
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
        // Validate that all dimension fields are filled
        if (!formData.length || !formData.width || !formData.height) {
          alert('Please fill in all dimension fields (length, width, height)')
          setLoading(false)
          return
        }
        // Construct dimensions string from separate fields
        updateData.dims = `${formData.length} × ${formData.width} × ${formData.height} m`
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
      image: container.image || 'container-1'
    })
    setEditingField(null)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-red-900/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900/98 to-gray-800/98 backdrop-blur-xl border-b border-gray-700/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Container Details</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
              container.isActive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {container.isActive ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-950/60 to-red-900/40 text-white hover:from-red-900/80 hover:to-red-800/60 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-red-900/50 hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Volume, Dimensions, and Price in one row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Volume */}
            <div 
              className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-4 rounded-xl cursor-pointer hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 border border-gray-700/30 hover:border-red-500/50 shadow-lg hover:shadow-red-900/20"
              onClick={() => editingField !== 'volume' && setEditingField('volume')}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-3 h-3 text-red-400" />
              </div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">
                Volume (m³)
              </label>
              {editingField === 'volume' ? (
                <div className="space-y-2">
                  <input
                    type="number"
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveField('volume'); }}
                      className="flex-1 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 rounded-lg text-xs font-semibold shadow-lg hover:shadow-red-500/50 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                      className="flex-1 px-3 py-1.5 bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 rounded-lg text-xs font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-3xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">{container.volume}</p>
              )}
            </div>
            
            {/* Dimensions */}
            <div 
              className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-4 rounded-xl cursor-pointer hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 border border-gray-700/30 hover:border-red-500/50 shadow-lg hover:shadow-red-900/20"
              onClick={() => editingField !== 'dims' && setEditingField('dims')}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-3 h-3 text-red-400" />
              </div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">
                Dimensions (m)
              </label>
              {editingField === 'dims' ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      min="0.1"
                      step="0.1"
                      className="w-16 px-2 py-1.5 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-center"
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
                      className="w-16 px-2 py-1.5 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-center"
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
                      className="w-16 px-2 py-1.5 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-center"
                      placeholder="3.8"
                    />
                    <span className="text-white text-sm font-medium ml-1">m</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveField('dims'); }}
                      className="flex-1 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 rounded-lg text-xs font-semibold shadow-lg hover:shadow-red-500/50 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                      className="flex-1 px-3 py-1.5 bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 rounded-lg text-xs font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-base font-bold text-white">{container.dims}</p>
              )}
            </div>
            
            {/* Price */}
            <div 
              className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-4 rounded-xl cursor-pointer hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 border border-gray-700/30 hover:border-red-500/50 shadow-lg hover:shadow-red-900/20"
              onClick={() => editingField !== 'price' && setEditingField('price')}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-3 h-3 text-red-400" />
              </div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">
                Price (CZK)
              </label>
              {editingField === 'price' ? (
                <div className="space-y-2">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveField('price'); }}
                      className="flex-1 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 rounded-lg text-xs font-semibold shadow-lg hover:shadow-red-500/50 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                      className="flex-1 px-3 py-1.5 bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 rounded-lg text-xs font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xl font-bold text-white">{container.price.toLocaleString('cs-CZ')}</p>
              )}
            </div>
          </div>

          {/* Container Image Selector */}
          <div 
            className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-5 rounded-xl cursor-pointer hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 border border-gray-700/30 hover:border-red-500/50 shadow-lg hover:shadow-red-900/20"
            onClick={() => editingField !== 'image' && setEditingField('image')}
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit2 className="w-4 h-4 text-red-400" />
            </div>
            <label className="text-sm font-semibold text-gray-300 mb-3 block">
              Container Image
            </label>
            {editingField === 'image' ? (
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-4 gap-3">
                  {CONTAINER_IMAGES.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setFormData(prev => ({ ...prev, image: img.id }))}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.image === img.id
                          ? 'border-red-500 bg-red-950/30 shadow-lg shadow-red-500/30 scale-105'
                          : 'border-gray-600/50 hover:border-gray-500 hover:scale-102'
                      }`}
                    >
                      <div className="text-[10px] text-gray-400 mb-2 text-center font-medium">{img.name}</div>
                      <div className="bg-gray-700/50 rounded-lg p-2 h-14 flex items-center justify-center">
                        <span className="text-xs text-gray-400 font-semibold">IMG</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveField('image')}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 rounded-lg text-sm font-semibold shadow-lg hover:shadow-red-500/50 transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 rounded-lg text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="bg-gray-700/50 rounded-xl p-3 h-20 w-20 flex items-center justify-center shadow-inner">
                  <span className="text-sm text-gray-400 font-semibold">IMG</span>
                </div>
                <span className="text-base text-white font-medium">
                  {CONTAINER_IMAGES.find(img => img.id === (container.image || 'container-1'))?.name || 'Standard Container'}
                </span>
              </div>
            )}
          </div>

          {/* Description - Optional with Presets */}
          <div 
            className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-5 rounded-xl cursor-pointer hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 border border-gray-700/30 hover:border-red-500/50 shadow-lg hover:shadow-red-900/20"
            onClick={() => editingField !== 'description' && setEditingField('description')}
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit2 className="w-4 h-4 text-red-400" />
            </div>
            <label className="text-sm font-semibold text-gray-300 mb-3 block">
              Description <span className="text-xs text-gray-500 font-normal">(Optional)</span>
            </label>
            {editingField === 'description' ? (
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setDescriptionMode('preset'); setFormData(prev => ({ ...prev, description: CONTAINER_PRESET_DESCRIPTIONS[selectedPreset] || '' })) }}
                    className={`px-2 py-1 rounded border text-xs ${descriptionMode === 'preset' ? 'bg-red-900/40 border-red-700 text-white' : 'bg-gray-800/40 border-gray-700 text-gray-300'}`}
                  >
                    Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescriptionMode('custom')}
                    className={`px-2 py-1 rounded border text-xs ${descriptionMode === 'custom' ? 'bg-red-900/40 border-red-700 text-white' : 'bg-gray-800/40 border-gray-700 text-gray-300'}`}
                  >
                    Custom
                  </button>
                </div>
                {descriptionMode === 'preset' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  rows={3}
                  placeholder="Add an optional description for this container..."
                  disabled={descriptionMode === 'preset'}
                  className={`w-full px-4 py-3 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 placeholder-gray-500 ${descriptionMode === 'preset' ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveField('description')}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 rounded-lg text-sm font-semibold shadow-lg hover:shadow-red-500/50 transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 rounded-lg text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed">
                {container.description || <span className="text-gray-500 italic">No description added</span>}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/60 to-gray-700/60 text-gray-300 hover:from-gray-700/80 hover:to-gray-600/80 border border-gray-600/50 hover:border-gray-500 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-gray-900/50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
