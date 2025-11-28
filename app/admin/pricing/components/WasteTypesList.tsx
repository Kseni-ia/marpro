'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Eye, EyeOff, DollarSign } from 'lucide-react'
import { 
  WasteType, 
  getAllWasteTypes, 
  deleteWasteType, 
  toggleWasteTypeStatus,
  addWasteType,
  DEFAULT_WASTE_TYPES
} from '@/lib/wasteTypes'
import { useLanguage } from '@/contexts/LanguageContext'
import AddWasteTypeModal from './AddWasteTypeModal'
import WasteTypeDetailsModal from './WasteTypeDetailsModal'

export default function WasteTypesList() {
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedWasteType, setSelectedWasteType] = useState<WasteType | null>(null)
  const [seedingDefaults, setSeedingDefaults] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    fetchWasteTypes()
  }, [])

  const fetchWasteTypes = async () => {
    setLoading(true)
    try {
      const data = await getAllWasteTypes()
      setWasteTypes(data)
    } catch (error) {
      console.error('Error fetching waste types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (wasteTypeId: string) => {
    if (!confirm('Opravdu chcete smazat tento typ odpadu?')) return
    
    try {
      await deleteWasteType(wasteTypeId)
      await fetchWasteTypes()
    } catch (error) {
      console.error('Error deleting waste type:', error)
      alert('Nepodařilo se smazat typ odpadu')
    }
  }

  const handleToggleStatus = async (wasteTypeId: string, currentStatus: boolean) => {
    try {
      await toggleWasteTypeStatus(wasteTypeId, !currentStatus)
      await fetchWasteTypes()
    } catch (error) {
      console.error('Error toggling waste type status:', error)
      alert('Nepodařilo se změnit stav typu odpadu')
    }
  }

  const handleSeedDefaults = async () => {
    if (!confirm('Toto přidá výchozí typy odpadu do databáze. Pokračovat?')) return
    
    setSeedingDefaults(true)
    try {
      for (const wasteType of DEFAULT_WASTE_TYPES) {
        await addWasteType(wasteType)
      }
      await fetchWasteTypes()
      alert('Výchozí typy odpadu byly úspěšně přidány!')
    } catch (error) {
      console.error('Error seeding defaults:', error)
      alert('Nepodařilo se přidat výchozí typy odpadu')
    } finally {
      setSeedingDefaults(false)
    }
  }

  const getLocalizedName = (wasteType: WasteType) => {
    return wasteType.name[language] || wasteType.name.cs || wasteType.name.en
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-dark-textSecondary">Načítání...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
        {wasteTypes.length === 0 && (
          <button
            onClick={handleSeedDefaults}
            disabled={seedingDefaults}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <DollarSign className="w-4 h-4" />
            {seedingDefaults ? 'Přidávám...' : 'Přidat výchozí typy'}
          </button>
        )}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Přidat typ odpadu
        </button>
      </div>

      {/* Waste Types Grid */}
      {wasteTypes.length === 0 ? (
        <div className="text-center py-12 bg-gradient-card-dark border-2 border-gray-dark-border rounded-2xl">
          <DollarSign className="w-12 h-12 mx-auto text-gray-dark-textMuted mb-4" />
          <p className="text-gray-dark-textSecondary mb-4">Zatím nejsou definovány žádné typy odpadu</p>
          <p className="text-gray-dark-textMuted text-sm">Klikněte na "Přidat výchozí typy" pro přidání standardních typů odpadu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wasteTypes.map((wasteType) => (
            <div
              key={wasteType.id}
              className={`bg-gradient-card-dark border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg ${
                wasteType.isActive 
                  ? 'border-gray-dark-border hover:border-red-500/50' 
                  : 'border-gray-700/50 opacity-60'
              }`}
              onClick={() => setSelectedWasteType(wasteType)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {getLocalizedName(wasteType)}
                  </h3>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                    wasteType.isActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {wasteType.isActive ? 'Aktivní' : 'Neaktivní'}
                  </span>
                </div>
              </div>

              {/* Pricing List - Compact */}
              <div className="space-y-1 mb-4">
                {wasteType.pricing.slice(0, 4).map((p) => (
                  <div key={p.volume} className="flex items-center justify-between bg-gray-800/40 rounded-lg px-3 py-2">
                    <span className="text-sm font-medium text-gray-300">{p.volume} m³</span>
                    <span className="text-sm font-bold text-green-400">{p.price.toLocaleString('cs-CZ')} Kč</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-gray-700/50">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleStatus(wasteType.id, wasteType.isActive)
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    wasteType.isActive
                      ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                      : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  {wasteType.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {wasteType.isActive ? 'Skrýt' : 'Zobrazit'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedWasteType(wasteType)
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  Upravit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(wasteType.id)
                  }}
                  className="flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddWasteTypeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchWasteTypes()
          }}
        />
      )}

      {/* Details/Edit Modal */}
      {selectedWasteType && (
        <WasteTypeDetailsModal
          wasteType={selectedWasteType}
          onClose={() => setSelectedWasteType(null)}
          onUpdate={() => {
            fetchWasteTypes()
          }}
        />
      )}
    </div>
  )
}
