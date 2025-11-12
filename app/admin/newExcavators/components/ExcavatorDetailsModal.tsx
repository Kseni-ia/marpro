'use client'

import React, { useState } from 'react'
import { X, Edit2 } from 'lucide-react'
import { Excavator, updateExcavator } from '@/lib/excavators'
import Image from 'next/image'

interface ExcavatorDetailsModalProps {
  excavator: Excavator
  onClose: () => void
  onUpdate: () => void
}

export default function ExcavatorDetailsModal({ excavator, onClose, onUpdate }: ExcavatorDetailsModalProps) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Available excavator images
  const excavatorImages = [
    { path: '/TB145.svg', name: 'TB145' },
    { path: '/TB290-1.svg', name: 'TB290-1' },
    { path: '/TB290-2.svg.svg', name: 'TB290-2' }
  ]
  
  const [formData, setFormData] = useState({
    model: excavator.model,
    type: excavator.type,
    description: excavator.description.en || '',
    price: excavator.price,
    weight: excavator.specs.weight,
    bucketCapacity: excavator.specs.bucketCapacity,
    maxReach: excavator.specs.maxReach,
    svgPath: excavator.svgPath || '/TB145.svg',
    isActive: excavator.isActive
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveField = async (field: string) => {
    setLoading(true)
    try {
      const updateData: any = {}
      
      if (field === 'model') updateData.model = formData.model
      if (field === 'type') updateData.type = formData.type
      if (field === 'price') updateData.price = Number(formData.price)
      if (field === 'svgPath') updateData.svgPath = formData.svgPath
      if (field === 'specs') {
        updateData.specs = {
          weight: formData.weight,
          bucketCapacity: formData.bucketCapacity,
          maxReach: formData.maxReach
        }
      }
      if (field === 'description') {
        updateData.description = {
          en: formData.description,
          cs: formData.description,
          ru: formData.description
        }
      }
      
      await updateExcavator(excavator.id, updateData)
      
      // Update local excavator object immediately
      Object.assign(excavator, updateData)
      if (updateData.description) {
        excavator.description = updateData.description
      }
      if (updateData.specs) {
        excavator.specs = updateData.specs
      }
      
      setEditingField(null)
      onUpdate() // This will refresh the list in background
    } catch (error) {
      console.error('Error updating excavator:', error)
      alert('Failed to update excavator')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      model: excavator.model,
      type: excavator.type,
      description: excavator.description.en || '',
      price: excavator.price,
      weight: excavator.specs.weight,
      bucketCapacity: excavator.specs.bucketCapacity,
      maxReach: excavator.specs.maxReach,
      svgPath: excavator.svgPath || '/TB145.svg',
      isActive: excavator.isActive
    })
    setEditingField(null)
  }


  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-red-900/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900/98 to-gray-800/98 backdrop-blur-xl border-b border-gray-700/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Excavator Details</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
              excavator.isActive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {excavator.isActive ? 'Visible' : 'Hidden'}
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
          {/* Model, Type, and Price in one row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Model */}
            <div 
              className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-4 rounded-xl cursor-pointer hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 border border-gray-700/30 hover:border-red-500/50 shadow-lg hover:shadow-red-900/20"
              onClick={() => editingField !== 'model' && setEditingField('model')}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-3 h-3 text-red-400" />
              </div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">
                Model
              </label>
              {editingField === 'model' ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveField('model'); }}
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
                <p className="text-3xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">{excavator.model}</p>
              )}
            </div>
            
            {/* Type */}
            <div 
              className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-4 rounded-xl cursor-pointer hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 border border-gray-700/30 hover:border-red-500/50 shadow-lg hover:shadow-red-900/20"
              onClick={() => editingField !== 'type' && setEditingField('type')}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-3 h-3 text-red-400" />
              </div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">
                Type
              </label>
              {editingField === 'type' ? (
                <div className="space-y-2">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  >
                    <option value="mini">Mini</option>
                    <option value="standard">Standard</option>
                    <option value="large">Large</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveField('type'); }}
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
                <p className="text-base font-bold text-white capitalize">{excavator.type}</p>
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
                Price (CZK/hour)
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
                <p className="text-xl font-bold text-white">{excavator.price.toLocaleString('cs-CZ')}</p>
              )}
            </div>
          </div>

          {/* Specs */}
          <div 
            className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-5 rounded-xl cursor-pointer hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 border border-gray-700/30 hover:border-red-500/50 shadow-lg hover:shadow-red-900/20"
            onClick={() => editingField !== 'specs' && setEditingField('specs')}
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit2 className="w-4 h-4 text-red-400" />
            </div>
            <label className="text-sm font-semibold text-gray-300 mb-3 block">
              Specifications
            </label>
            {editingField === 'specs' ? (
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                      placeholder="e.g., 1.5t"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Bucket</label>
                    <input
                      type="text"
                      name="bucketCapacity"
                      value={formData.bucketCapacity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                      placeholder="e.g., 0.04m³"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Max Reach</label>
                    <input
                      type="text"
                      name="maxReach"
                      value={formData.maxReach}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                      placeholder="e.g., 3.8m"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveField('specs')}
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Weight</p>
                  <p className="text-base text-white font-medium">{excavator.specs.weight}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Bucket Capacity</p>
                  <p className="text-base text-white font-medium">{excavator.specs.bucketCapacity}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Max Reach</p>
                  <p className="text-base text-white font-medium">{excavator.specs.maxReach}</p>
                </div>
              </div>
            )}
          </div>

          {/* Excavator Image */}
          <div 
            className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-5 rounded-xl cursor-pointer hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 border border-gray-700/30 hover:border-red-500/50 shadow-lg hover:shadow-red-900/20"
            onClick={() => editingField !== 'svgPath' && setEditingField('svgPath')}
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit2 className="w-4 h-4 text-red-400" />
            </div>
            <label className="text-sm font-semibold text-gray-300 mb-3 block">
              Excavator Image
            </label>
            {editingField === 'svgPath' ? (
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-3 gap-3">
                  {excavatorImages.map((image) => (
                    <div
                      key={image.path}
                      onClick={() => setFormData(prev => ({ ...prev, svgPath: image.path }))}
                      className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 ${
                        formData.svgPath === image.path
                          ? 'border-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                          : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
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
                      <p className="text-xs text-center text-gray-300 font-medium">
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
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveField('svgPath')}
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
              <div className="flex items-center justify-center">
                <div className="w-32 h-20 bg-gray-700/20 rounded-lg flex items-center justify-center">
                  <Image 
                    src={excavator.svgPath || '/TB145.svg'} 
                    alt={`${excavator.model} excavator`}
                    width={128}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description - Optional */}
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
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add an optional description for this excavator..."
                  className="w-full px-4 py-3 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 placeholder-gray-500"
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
                {excavator.description.en || <span className="text-gray-500 italic">No description added</span>}
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
