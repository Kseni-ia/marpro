'use client'

import React, { useState, useEffect } from 'react'
import { getAllExcavators, toggleExcavatorStatus, deleteExcavator, Excavator } from '@/lib/excavators'
import { Edit, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import AddExcavatorModal from './AddExcavatorModal'
import ExcavatorDetailsModal from './ExcavatorDetailsModal'

export default function ExcavatorsList() {
  const [excavators, setExcavators] = useState<Excavator[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedExcavator, setSelectedExcavator] = useState<Excavator | null>(null)

  const fetchExcavators = async () => {
    setLoading(true)
    const data = await getAllExcavators()
    setExcavators(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchExcavators()
  }, [])

  const handleToggleStatus = async (excavatorId: string, currentStatus: boolean) => {
    try {
      await toggleExcavatorStatus(excavatorId, !currentStatus)
      await fetchExcavators()
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Failed to update excavator status')
    }
  }

  const handleDelete = async (excavatorId: string, model: string) => {
    if (confirm(`Are you sure you want to delete the ${model} excavator?`)) {
      try {
        await deleteExcavator(excavatorId)
        await fetchExcavators()
      } catch (error) {
        console.error('Error deleting excavator:', error)
        alert('Failed to delete excavator')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-dark-textSecondary">Loading excavators...</div>
      </div>
    )
  }

  return (
    <>
      {/* Add New Excavator Button - Moved to top */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="w-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border-2 border-dashed border-gray-600/50 hover:border-red-500/70 rounded-xl p-4 transition-all duration-300 flex items-center justify-center gap-3 text-gray-400 hover:text-white group mb-6 shadow-lg hover:shadow-red-900/20 hover:scale-[1.01]"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-red-950/50 to-red-900/30 rounded-xl flex items-center justify-center group-hover:from-red-900/70 group-hover:to-red-800/50 transition-all duration-300 shadow-lg">
          <Plus className="w-6 h-6 text-red-400 group-hover:text-red-300" />
        </div>
        <div className="text-left">
          <span className="text-sm font-semibold block">Add New Excavator</span>
          <span className="text-xs text-gray-500 group-hover:text-gray-400">Create a new excavator option</span>
        </div>
      </button>

      {showAddModal && (
        <AddExcavatorModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchExcavators}
        />
      )}

      {selectedExcavator && (
        <ExcavatorDetailsModal
          excavator={selectedExcavator}
          onClose={() => setSelectedExcavator(null)}
          onUpdate={() => {
            fetchExcavators()
          }}
        />
      )}

      {/* Grid Layout - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {excavators.map((excavator) => (
          <div
            key={excavator.id}
            onClick={() => setSelectedExcavator(excavator)}
            className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/30 hover:border-red-500/50 rounded-xl p-5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-900/20 hover:scale-102"
          >
            {/* Status Badge - Top Right */}
            <div className="absolute top-3 right-3 z-10">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-lg ${
                excavator.isActive 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {excavator.isActive ? 'Visible' : 'Hidden'}
              </span>
            </div>

            {/* Model Header */}
            <div className="mb-1">
              <span className="text-3xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                {excavator.model}
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-4">{excavator.type}</p>

            {/* Specs */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Weight:</span>
                <span className="text-gray-300 font-medium">{excavator.specs.weight}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Bucket:</span>
                <span className="text-gray-300 font-medium">{excavator.specs.bucketCapacity}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Reach:</span>
                <span className="text-gray-300 font-medium">{excavator.specs.maxReach}</span>
              </div>
            </div>

            {/* Excavator Image Placeholder */}
            <div className="flex justify-center items-center h-16 mb-4 bg-gray-700/20 rounded-lg">
              <svg width="120" height="50" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Excavator body */}
                <rect x="60" y="40" width="60" height="20" fill="#6B7280" rx="2"/>
                <rect x="50" y="30" width="30" height="30" fill="#9CA3AF" rx="2"/>
                {/* Arm */}
                <rect x="80" y="20" width="40" height="8" fill="#6B7280" rx="1" transform="rotate(-30 80 20)"/>
                <rect x="110" y="10" width="30" height="6" fill="#9CA3AF" rx="1" transform="rotate(-45 110 10)"/>
                {/* Tracks */}
                <rect x="50" y="60" width="70" height="10" fill="#4B5563" rx="2"/>
              </svg>
            </div>

            {/* Description */}
            {excavator.description.en && (
              <p className="text-gray-400 text-xs mb-3 line-clamp-2 min-h-[32px]">
                {excavator.description.en}
              </p>
            )}

            {/* Price */}
            <div className="bg-gradient-to-r from-gray-700/40 to-gray-800/40 px-3 py-2 rounded-lg mb-4 border border-gray-600/30">
              <p className="text-white font-semibold text-sm">
                {excavator.price.toLocaleString('cs-CZ')} <span className="text-gray-400 text-xs font-normal">CZK/day excl. VAT</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleToggleStatus(excavator.id, excavator.isActive)}
                className={`px-2 py-2 border rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-[10px] font-semibold shadow-md ${
                  excavator.isActive
                    ? 'bg-gray-700/40 text-gray-300 hover:bg-gray-600/60 border-gray-600/50 hover:border-gray-500'
                    : 'bg-green-900/40 text-green-400 hover:bg-green-800/60 border-green-900/50 hover:border-green-600 hover:shadow-green-500/30'
                }`}
                title={excavator.isActive ? 'Hide from website' : 'Show on website'}
              >
                {excavator.isActive ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Show</span>
                  </>
                )}
              </button>
              
              <button
                className="px-2 py-2 bg-blue-950/40 text-blue-400 hover:bg-blue-900/60 border border-blue-900/50 hover:border-blue-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-[10px] font-semibold shadow-md hover:shadow-blue-500/30"
                title="Edit Excavator"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              
              <button
                onClick={() => handleDelete(excavator.id, excavator.model)}
                className="px-2 py-2 bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-900/50 hover:border-red-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-[10px] font-semibold shadow-md hover:shadow-red-500/30"
                title="Delete Excavator"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Del</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
