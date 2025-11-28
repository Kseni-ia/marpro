'use client'

import React, { useState, useEffect } from 'react'
import { getAllReferences, toggleReferenceStatus, deleteReference, Reference, REFERENCE_CATEGORIES, ReferenceCategory } from '@/lib/constructions'
import { Edit, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import AddReferenceModal from './AddReferenceModal'
import ReferenceDetailsModal from './ReferenceDetailsModal'
import Image from 'next/image'

export default function ConstructionsList() {
  const { t } = useLanguage()
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null)
  const [filterCategory, setFilterCategory] = useState<ReferenceCategory | 'all'>('all')

  const getCategoryLabel = (category: ReferenceCategory | undefined) => {
    if (!category) return 'Bez kategorie'
    const cat = REFERENCE_CATEGORIES.find(c => c.value === category)
    return cat ? cat.label : 'Bez kategorie'
  }

  const getCategoryColor = (category: ReferenceCategory | undefined) => {
    switch (category) {
      case 'demolice': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'instalace': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'stavebni_prace': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'odvoz_materialu': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const filteredReferences = filterCategory === 'all' 
    ? references 
    : references.filter(ref => ref.category === filterCategory)

  const fetchReferences = async () => {
    setLoading(true)
    try {
      const data = await getAllReferences()
      setReferences(data)
    } catch (error) {
      console.error('Error fetching references:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReferences()
  }, [])

  const handleToggleStatus = async (referenceId: string, currentStatus: boolean) => {
    try {
      await toggleReferenceStatus(referenceId, currentStatus)
      await fetchReferences()
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Nepodařilo se aktualizovat stav')
    }
  }

  const handleDelete = async (referenceId: string, title: string) => {
    if (confirm(`Opravdu chcete smazat referenci "${title}"?`)) {
      try {
        await deleteReference(referenceId)
        await fetchReferences()
      } catch (error) {
        console.error('Error deleting reference:', error)
        alert('Nepodařilo se smazat referenci')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-dark-textSecondary">Načítání referencí...</div>
      </div>
    )
  }

  return (
    <>
      {showAddModal && (
        <AddReferenceModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchReferences}
        />
      )}

      {selectedReference && (
        <ReferenceDetailsModal
          reference={selectedReference}
          onClose={() => setSelectedReference(null)}
          onUpdate={() => {
            fetchReferences()
          }}
        />
      )}

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterCategory === 'all' ? 'bg-white/20 text-white border border-white/30' : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'}`}
        >
          Všechny
        </button>
        {REFERENCE_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilterCategory(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterCategory === cat.value ? getCategoryColor(cat.value) + ' border' : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid Layout - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {filteredReferences.map((reference) => (
          <div
            key={reference.id}
            onClick={() => setSelectedReference(reference)}
            className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/30 hover:border-red-500/50 rounded-xl p-5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-900/20 hover:scale-102"
          >
            {/* Category Badge - Top Left */}
            <div className="absolute top-3 left-3 z-10">
              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold shadow-lg border ${getCategoryColor(reference.category)}`}>
                {getCategoryLabel(reference.category)}
              </span>
            </div>

            {/* Status Badge - Top Right */}
            <div className="absolute top-3 right-3 z-10">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-lg ${
                reference.isActive 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {reference.isActive ? 'Viditelné' : 'Skryté'}
              </span>
            </div>

            {/* Reference Images */}
            <div className="mb-4">
              {(reference.imageUrls && reference.imageUrls.length > 0) ? (
                <div className="grid grid-cols-2 gap-1 aspect-video">
                  {reference.imageUrls.slice(0, 4).map((url, index) => (
                    <div 
                      key={index} 
                      className={`${reference.imageUrls.length === 1 ? 'col-span-2 row-span-2' : reference.imageUrls.length === 2 ? 'col-span-1 row-span-2' : ''} relative bg-gray-700/50 rounded-lg overflow-hidden`}
                    >
                      <Image
                        src={url}
                        alt={`${reference.title} ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg'
                        }}
                      />
                      {reference.imageUrls.length > 4 && index === 3 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            +{reference.imageUrls.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-video bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-2xl mb-1">📷</div>
                    <div className="text-xs">Žádné obrázky</div>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="mb-2">
              <h3 className="text-lg font-bold text-white truncate">
                {reference.title}
              </h3>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-gray-400 text-sm line-clamp-3">
                {reference.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleStatus(reference.id, reference.isActive)
                }}
                className={`flex-1 px-2 py-2 ${
                  reference.isActive 
                    ? 'bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-900/50 hover:border-red-600' 
                    : 'bg-green-950/40 text-green-400 hover:bg-green-900/60 border border-green-900/50 hover:border-green-600'
                } rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-[10px] font-semibold shadow-md`}
                title={reference.isActive ? 'Skrýt' : 'Zobrazit'}
              >
                {reference.isActive ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Skrýt</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Zobrazit</span>
                  </>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedReference(reference)
                }}
                className="px-2 py-2 bg-blue-950/40 text-blue-400 hover:bg-blue-900/60 border border-blue-900/50 hover:border-blue-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-[10px] font-semibold shadow-md hover:shadow-blue-500/30"
                title="Upravit"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upravit</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(reference.id, reference.title)
                }}
                className="px-2 py-2 bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-900/50 hover:border-red-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-[10px] font-semibold shadow-md hover:shadow-red-500/30"
                title="Smazat"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Smazat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Reference Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="w-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border-2 border-dashed border-gray-600/50 hover:border-red-500/70 rounded-xl p-4 transition-all duration-300 flex items-center justify-center gap-3 text-gray-400 hover:text-white group shadow-lg hover:shadow-red-900/20 hover:scale-[1.01]"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-red-950/50 to-red-900/30 rounded-xl flex items-center justify-center group-hover:from-red-900/70 group-hover:to-red-800/50 transition-all duration-300 shadow-lg">
          <Plus className="w-6 h-6 text-red-400 group-hover:text-red-300" />
        </div>
        <div className="text-left">
          <span className="text-sm font-semibold block">Přidat novou referenci</span>
          <span className="text-xs text-gray-500 group-hover:text-gray-400">Vytvořit novou referenční kartu</span>
        </div>
      </button>

      {/* Empty State */}
      {references.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-gray-dark-textSecondary text-lg mb-4">
              Žádné reference k zobrazení
            </div>
            <div className="text-gray-dark-textSecondary/60 text-sm mb-6">
              Přidejte první referenci pomocí tlačítka níže
            </div>
          </div>
        </div>
      )}
    </>
  )
}
