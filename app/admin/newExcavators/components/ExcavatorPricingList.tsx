'use client'

import React, { useState, useEffect } from 'react'
import { Edit2, Save, X, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { Excavator, getAllExcavators, updateExcavator, addExcavator, deleteExcavator } from '@/lib/excavators'

interface ExcavatorPricingListProps {
  onRefreshList?: () => void
}

export default function ExcavatorPricingList({ onRefreshList }: ExcavatorPricingListProps) {
  const [excavators, setExcavators] = useState<Excavator[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<number>(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newExcavator, setNewExcavator] = useState({
    type: '',
    model: '',
    weight: '',
    price: 0
  })

  useEffect(() => {
    fetchExcavators()
  }, [])

  const fetchExcavators = async () => {
    setLoading(true)
    try {
      const data = await getAllExcavators()
      // Sort by price
      setExcavators(data.sort((a, b) => (a.price || 0) - (b.price || 0)))
    } catch (error) {
      console.error('Error fetching excavators:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (excavator: Excavator) => {
    setEditingId(excavator.id)
    setEditPrice(excavator.price || 0)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditPrice(0)
  }

  const savePrice = async (id: string) => {
    try {
      await updateExcavator(id, { price: editPrice })
      await fetchExcavators()
      setEditingId(null)
    } catch (error) {
      console.error('Error updating price:', error)
      alert('Nepodařilo se uložit cenu')
    }
  }

  const handleAddExcavator = async () => {
    if (!newExcavator.type.trim() || !newExcavator.model.trim()) {
      alert('Vyplňte typ a model stroje')
      return
    }
    if (newExcavator.price <= 0) {
      alert('Cena musí být větší než 0')
      return
    }

    try {
      await addExcavator({
        type: newExcavator.type,
        model: newExcavator.model,
        description: { cs: '', en: '', ru: '' },
        price: newExcavator.price,
        specs: {
          weight: newExcavator.weight || '',
          bucketCapacity: '',
          maxReach: ''
        },
        isActive: true
      })
      setShowAddForm(false)
      setNewExcavator({ type: '', model: '', weight: '', price: 0 })
      await fetchExcavators()
      onRefreshList?.()
    } catch (error) {
      console.error('Error adding excavator:', error)
      alert('Nepodařilo se přidat stroj')
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await updateExcavator(id, { isActive: !currentActive })
      await fetchExcavators()
    } catch (error) {
      console.error('Error toggling active:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tento stroj?')) return
    try {
      await deleteExcavator(id)
      await fetchExcavators()
      onRefreshList?.()
    } catch (error) {
      console.error('Error deleting excavator:', error)
      alert('Nepodařilo se smazat stroj')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-dark-textSecondary">Načítání...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Přidat mechanizaci
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gradient-card-dark border-2 border-green-500/30 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3">Nová mechanizace</h4>
          
          {/* Select from existing excavators */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Vybrat z existujících strojů:</label>
            <select
              onChange={(e) => {
                const selected = excavators.find(ex => ex.id === e.target.value)
                if (selected) {
                  setNewExcavator({
                    type: selected.type,
                    model: selected.model,
                    weight: selected.specs?.weight || '',
                    price: selected.price || 0
                  })
                }
              }}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
            >
              <option value="">-- Vyberte stroj nebo zadejte ručně níže --</option>
              {excavators.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.type} - {ex.model} {ex.specs?.weight ? `| ${ex.specs.weight}` : ''} ({ex.price?.toLocaleString('cs-CZ') || 0} Kč/h)
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <label className="block text-sm text-gray-400 mb-3">Nebo zadat ručně:</label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Typ stroje</label>
                <input
                  type="text"
                  value={newExcavator.type}
                  onChange={(e) => setNewExcavator(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="např. Pásové rypadlo"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Model</label>
                <input
                  type="text"
                  value={newExcavator.model}
                  onChange={(e) => setNewExcavator(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="např. TAKEUCHI TB 290"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Váha / Specifikace</label>
                <input
                  type="text"
                  value={newExcavator.weight}
                  onChange={(e) => setNewExcavator(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="např. 9 t"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Cena za hodinu</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={newExcavator.price || ''}
                    onChange={(e) => setNewExcavator(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="1250"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                    min="0"
                  />
                  <span className="text-gray-400 text-sm font-medium">Kč/h</span>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleAddExcavator}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Přidat
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Excavator List */}
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-700/30">
          {excavators.map((excavator) => (
            <div 
              key={excavator.id} 
              className={`flex items-center justify-between px-6 py-4 hover:bg-gray-800/30 transition-colors ${!excavator.isActive ? 'opacity-50' : ''}`}
            >
              {/* Name and specs */}
              <div className="flex-1">
                <span className="text-white font-semibold">{excavator.type}</span>
                <span className="text-gray-300 ml-1">- {excavator.model}</span>
                {excavator.specs?.weight && (
                  <span className="text-gray-400 ml-2">| {excavator.specs.weight}</span>
                )}
                {!excavator.isActive && (
                  <span className="ml-2 text-xs text-yellow-500">(skryto)</span>
                )}
              </div>

              {/* Price and Actions */}
              <div className="flex items-center gap-3">
                {editingId === excavator.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white text-right focus:outline-none focus:border-red-500"
                      min="0"
                    />
                    <span className="text-gray-400 text-sm">Kč/hod</span>
                    <button
                      onClick={() => savePrice(excavator.id)}
                      className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-right">
                      <span className="text-green-400 font-bold text-lg">
                        {(excavator.price || 0).toLocaleString('cs-CZ')} Kč
                      </span>
                      <span className="text-gray-400 text-sm ml-1">/ hod.</span>
                      <p className="text-gray-500 text-xs">Bez DPH</p>
                    </div>
                    <button
                      onClick={() => startEdit(excavator)}
                      className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors"
                      title="Upravit cenu"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(excavator.id, excavator.isActive)}
                      className={`p-1.5 rounded transition-colors ${
                        excavator.isActive 
                          ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                          : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                      }`}
                      title={excavator.isActive ? 'Skrýt' : 'Zobrazit'}
                    >
                      {excavator.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(excavator.id)}
                      className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                      title="Smazat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {excavators.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Žádné stroje. Klikněte na "Přidat mechanizaci" pro přidání nového stroje.
          </div>
        )}
      </div>
    </div>
  )
}
