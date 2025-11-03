'use client'

import React, { useState, useEffect } from 'react'
import { getAllContainers, toggleContainerStatus, deleteContainer, Container } from '@/lib/containers'
import { Edit, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import AddContainerModal from './AddContainerModal'
import ContainerDetailsModal from './ContainerDetailsModal'

export default function ContainersList() {
  const { t } = useLanguage()
  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null)

  const fetchContainers = async () => {
    setLoading(true)
    const data = await getAllContainers()
    setContainers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchContainers()
  }, [])

  const handleToggleStatus = async (containerId: string, currentStatus: boolean) => {
    try {
      await toggleContainerStatus(containerId, !currentStatus)
      await fetchContainers()
    } catch (error) {
      console.error('Error toggling status:', error)
      alert(t('admin.failedUpdateStatus'))
    }
  }

  const handleDelete = async (containerId: string, volume: number) => {
    if (confirm(t('admin.confirmDelete').replace('{volume}', volume.toString()))) {
      try {
        await deleteContainer(containerId)
        await fetchContainers()
      } catch (error) {
        console.error('Error deleting container:', error)
        alert(t('admin.failedDelete'))
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-dark-textSecondary">{t('admin.loadingContainers')}</div>
      </div>
    )
  }

  return (
    <>
      {showAddModal && (
        <AddContainerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchContainers}
        />
      )}

      {selectedContainer && (
        <ContainerDetailsModal
          container={selectedContainer}
          onClose={() => setSelectedContainer(null)}
          onUpdate={() => {
            fetchContainers()
          }}
        />
      )}

      {/* Grid Layout - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {containers.map((container) => (
          <div
            key={container.id}
            onClick={() => setSelectedContainer(container)}
            className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/30 hover:border-red-500/50 rounded-xl p-5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-900/20 hover:scale-102"
          >
            {/* Status Badge - Top Right */}
            <div className="absolute top-3 right-3 z-10">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-lg ${
                container.isActive 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {container.isActive ? t('admin.visible') : t('admin.hidden')}
              </span>
            </div>

            {/* Volume Header */}
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-4xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                {container.volume}
              </span>
              <span className="text-lg text-gray-400 font-medium">
                m<sup>3</sup>
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-4">container</p>

            {/* Dimensions */}
            <div className="bg-gray-700/30 px-3 py-1.5 rounded-lg mb-3 inline-block">
              <span className="text-xs text-gray-300 font-medium">{container.dims}</span>
            </div>

            {/* Container Image Placeholder */}
            <div className="flex justify-center items-center h-16 mb-4 bg-gray-700/20 rounded-lg">
              <svg width="120" height="50" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Container body */}
                <rect x="40" y="20" width="120" height="40" fill="#6B7280" rx="2"/>
                <rect x="50" y="25" width="100" height="30" fill="#9CA3AF" rx="1"/>
                {/* Wheels */}
                <circle cx="60" cy="65" r="8" fill="#4B5563"/>
                <circle cx="60" cy="65" r="4" fill="#6B7280"/>
                <circle cx="140" cy="65" r="8" fill="#4B5563"/>
                <circle cx="140" cy="65" r="4" fill="#6B7280"/>
              </svg>
            </div>

            {/* Description */}
            {container.description && (
              <p className="text-gray-400 text-xs mb-3 line-clamp-2 min-h-[32px]">
                {container.description}
              </p>
            )}

            {/* Price */}
            <div className="bg-gradient-to-r from-gray-700/40 to-gray-800/40 px-3 py-2 rounded-lg mb-4 border border-gray-600/30">
              <p className="text-white font-semibold text-sm">
                {container.price.toLocaleString('cs-CZ')} <span className="text-gray-400 text-xs font-normal">CZK excl. VAT</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleToggleStatus(container.id, container.isActive)}
                className={`px-2 py-2 border rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-[10px] font-semibold shadow-md ${
                  container.isActive
                    ? 'bg-gray-700/40 text-gray-300 hover:bg-gray-600/60 border-gray-600/50 hover:border-gray-500'
                    : 'bg-green-900/40 text-green-400 hover:bg-green-800/60 border-green-900/50 hover:border-green-600 hover:shadow-green-500/30'
                }`}
                title={container.isActive ? t('admin.hide') : t('admin.show')}
              >
                {container.isActive ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('admin.hide')}</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('admin.show')}</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => setSelectedContainer(container)}
                className="px-2 py-2 bg-blue-950/40 text-blue-400 hover:bg-blue-900/60 border border-blue-900/50 hover:border-blue-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-[10px] font-semibold shadow-md hover:shadow-blue-500/30"
                title={t('admin.edit')}
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('admin.edit')}</span>
              </button>
              
              <button
                onClick={() => handleDelete(container.id, container.volume)}
                className="px-2 py-2 bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-900/50 hover:border-red-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-[10px] font-semibold shadow-md hover:shadow-red-500/30"
                title={t('admin.delete')}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Del</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Container Button - Moved to bottom */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="w-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border-2 border-dashed border-gray-600/50 hover:border-red-500/70 rounded-xl p-4 transition-all duration-300 flex items-center justify-center gap-3 text-gray-400 hover:text-white group shadow-lg hover:shadow-red-900/20 hover:scale-[1.01]"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-red-950/50 to-red-900/30 rounded-xl flex items-center justify-center group-hover:from-red-900/70 group-hover:to-red-800/50 transition-all duration-300 shadow-lg">
          <Plus className="w-6 h-6 text-red-400 group-hover:text-red-300" />
        </div>
        <div className="text-left">
          <span className="text-sm font-semibold block">{t('admin.addNewContainer')}</span>
          <span className="text-xs text-gray-500 group-hover:text-gray-400">{t('admin.addNewContainerDesc')}</span>
        </div>
      </button>
    </>
  )
}
