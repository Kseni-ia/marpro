'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { 
  Surcharge, 
  ServiceType,
  getSurchargesByServiceType, 
  addSurcharge, 
  updateSurcharge, 
  deleteSurcharge,
  DEFAULT_CONTAINER_SURCHARGES,
  DEFAULT_EXCAVATOR_SURCHARGES
} from '@/lib/wasteTypes'

interface SurchargesListProps {
  serviceType: ServiceType
}

export default function SurchargesList({ serviceType }: SurchargesListProps) {
  const [surcharges, setSurcharges] = useState<Surcharge[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [seedingDefaults, setSeedingDefaults] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    note: '',
    price: 0,
    isIndividual: false
  })

  useEffect(() => {
    fetchSurcharges()
  }, [serviceType])

  const fetchSurcharges = async () => {
    setLoading(true)
    try {
      const data = await getSurchargesByServiceType(serviceType)
      setSurcharges(data)
    } catch (error) {
      console.error('Error fetching surcharges:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDefaultSurcharges = () => {
    return serviceType === 'excavators' ? DEFAULT_EXCAVATOR_SURCHARGES : DEFAULT_CONTAINER_SURCHARGES
  }

  const handleSeedDefaults = async () => {
    if (!confirm('Toto přidá výchozí příplatky do databáze. Pokračovat?')) return
    
    setSeedingDefaults(true)
    try {
      for (const surcharge of getDefaultSurcharges()) {
        await addSurcharge(surcharge)
      }
      await fetchSurcharges()
      alert('Výchozí příplatky byly úspěšně přidány!')
    } catch (error) {
      console.error('Error seeding defaults:', error)
      alert('Nepodařilo se přidat výchozí příplatky')
    } finally {
      setSeedingDefaults(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      alert('Vyplňte název příplatku')
      return
    }

    try {
      await addSurcharge({
        name: { cs: formData.name, en: formData.name, ru: formData.name },
        note: formData.note && formData.note.trim() ? { cs: formData.note, en: formData.note, ru: formData.note } : null,
        price: formData.isIndividual ? 0 : formData.price,
        isPercentage: false,
        isActive: true,
        order: Date.now(),
        serviceType: serviceType
      })
      setShowAddForm(false)
      setFormData({ name: '', note: '', price: 0, isIndividual: false })
      await fetchSurcharges()
    } catch (error) {
      console.error('Error adding surcharge:', error)
      alert('Nepodařilo se přidat příplatek')
    }
  }

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) {
      alert('Vyplňte název příplatku')
      return
    }

    try {
      const updateData: any = {
        name: { cs: formData.name, en: formData.name, ru: formData.name },
        price: formData.isIndividual ? 0 : formData.price
      }
      // Only include note if it has a value, use null to clear it
      if (formData.note && formData.note.trim()) {
        updateData.note = { cs: formData.note, en: formData.note, ru: formData.note }
      } else {
        updateData.note = null
      }
      await updateSurcharge(id, updateData)
      setEditingId(null)
      setFormData({ name: '', note: '', price: 0, isIndividual: false })
      await fetchSurcharges()
    } catch (error) {
      console.error('Error updating surcharge:', error)
      alert('Nepodařilo se aktualizovat příplatek')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tento příplatek?')) return
    
    try {
      await deleteSurcharge(id)
      await fetchSurcharges()
    } catch (error) {
      console.error('Error deleting surcharge:', error)
      alert('Nepodařilo se smazat příplatek')
    }
  }

  const startEdit = (surcharge: Surcharge) => {
    setEditingId(surcharge.id)
    setFormData({
      name: surcharge.name.cs || '',
      note: surcharge.note?.cs || '',
      price: surcharge.price,
      isIndividual: surcharge.price === 0
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', note: '', price: 0, isIndividual: false })
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
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
        {surcharges.length === 0 && (
          <button
            onClick={handleSeedDefaults}
            disabled={seedingDefaults}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {seedingDefaults ? 'Přidávám...' : 'Přidat výchozí příplatky'}
          </button>
        )}
        <button
          onClick={() => {
            setShowAddForm(true)
            setFormData({ name: '', note: '', price: 0, isIndividual: false })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Přidat příplatek
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gradient-card-dark border-2 border-green-500/30 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3">Nový příplatek</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Název příplatku"
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Poznámka (volitelné)"
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              value={formData.isIndividual ? '-' : (formData.price || '')}
              onChange={(e) => {
                const val = e.target.value
                if (val === '-' || val === '') {
                  setFormData(prev => ({ ...prev, price: 0, isIndividual: true }))
                } else {
                  setFormData(prev => ({ ...prev, price: Number(val) || 0, isIndividual: false }))
                }
              }}
              placeholder="Cena nebo - pro individuální"
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500 text-center"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
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
      )}

      {/* Surcharges List */}
      {surcharges.length === 0 && !showAddForm ? (
        <div className="text-center py-8 bg-gradient-card-dark border-2 border-gray-dark-border rounded-2xl">
          <p className="text-gray-dark-textSecondary mb-2">Zatím nejsou definovány žádné příplatky</p>
          <p className="text-gray-dark-textMuted text-sm">Klikněte na "Přidat výchozí příplatky"</p>
        </div>
      ) : (
        <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
            <div className="col-span-4 text-xs font-bold text-gray-400 uppercase">Název</div>
            <div className="col-span-3 text-xs font-bold text-gray-400 uppercase">Poznámka</div>
            <div className="col-span-2 text-xs font-bold text-gray-400 uppercase text-right">Cena</div>
            <div className="col-span-3 text-xs font-bold text-gray-400 uppercase text-right">Akce</div>
          </div>
          
          {/* Rows */}
          {surcharges.map((surcharge) => (
            <div key={surcharge.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors items-center">
              {editingId === surcharge.id ? (
                <>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={formData.note}
                      onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <input
                      type="text"
                      value={formData.isIndividual ? '-' : (formData.price || '')}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === '-' || val === '') {
                          setFormData(prev => ({ ...prev, price: 0, isIndividual: true }))
                        } else {
                          setFormData(prev => ({ ...prev, price: Number(val) || 0, isIndividual: false }))
                        }
                      }}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-red-500 text-center"
                      placeholder="- nebo cena"
                    />
                  </div>
                  <div className="col-span-3 flex justify-end gap-1">
                    <button
                      onClick={() => handleUpdate(surcharge.id)}
                      className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-4">
                    <span className="text-white font-medium">{surcharge.name.cs}</span>
                  </div>
                  <div className="col-span-3">
                    <span className="text-gray-400 text-sm">{surcharge.note?.cs || '-'}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-green-400 font-bold">
                      {surcharge.price > 0 ? `${surcharge.price.toLocaleString('cs-CZ')} Kč` : 'Individuálně'}
                    </span>
                  </div>
                  <div className="col-span-3 flex justify-end gap-1">
                    <button
                      onClick={() => startEdit(surcharge)}
                      className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(surcharge.id)}
                      className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
