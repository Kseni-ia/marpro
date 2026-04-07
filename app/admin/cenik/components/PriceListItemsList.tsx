'use client'

import React, { useEffect, useState } from 'react'
import { DollarSign, Edit2, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import {
  deletePriceListItem,
  formatPriceListPrice,
  getAllPriceListItems,
  PriceListItem,
  togglePriceListItemStatus,
} from '@/lib/priceList'
import PriceListItemModal from './PriceListItemModal'

export default function PriceListItemsList() {
  const [items, setItems] = useState<PriceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PriceListItem | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    const data = await getAllPriceListItems()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleDelete = async (itemId: string, name: string) => {
    if (!confirm(`Opravdu chcete smazat položku "${name}"?`)) {
      return
    }

    try {
      await deletePriceListItem(itemId)
      await fetchItems()
    } catch (error) {
      console.error('Error deleting price list item:', error)
      alert('Nepodařilo se smazat položku ceníku služeb.')
    }
  }

  const handleToggleStatus = async (itemId: string, currentStatus: boolean) => {
    try {
      await togglePriceListItemStatus(itemId, !currentStatus)
      await fetchItems()
    } catch (error) {
      console.error('Error toggling price list item:', error)
      alert('Nepodařilo se změnit viditelnost položky.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-dark-textSecondary">Načítání položek ceníku služeb...</div>
      </div>
    )
  }

  return (
    <>
      {showAddModal && (
        <PriceListItemModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchItems()
          }}
        />
      )}

      {selectedItem && (
        <PriceListItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSuccess={() => {
            setSelectedItem(null)
            fetchItems()
          }}
        />
      )}

      <div className="mb-5 flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-white shadow-lg transition-all hover:from-red-700 hover:to-red-800"
        >
          <Plus className="h-4 w-4" />
          Přidat položku
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-white/12 bg-white/[0.025] px-5 py-10 text-center">
          <h3 className="text-lg font-semibold text-white">Zatím není vytvořená žádná položka ceníku služeb</h3>
          <p className="mt-2 text-sm text-gray-400">Vytvořte první službu a její cenu pomocí tlačítka výše.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`cursor-pointer rounded-[24px] border p-5 transition-all duration-300 hover:-translate-y-1 ${
                item.isActive
                  ? 'border-red-900/35 bg-gradient-to-br from-gray-900/70 to-slate-950/70'
                  : 'border-white/10 bg-white/[0.03] opacity-75'
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    item.isActive
                      ? 'bg-emerald-500/12 text-emerald-300 ring-1 ring-inset ring-emerald-500/25'
                      : 'bg-red-500/12 text-red-300 ring-1 ring-inset ring-red-500/25'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${item.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  {item.isActive ? 'Viditelné' : 'Skryté'}
                </span>
              </div>

              <div className="mb-4 inline-flex rounded-full border border-red-500/20 bg-red-500/12 px-4 py-2 text-base font-semibold text-red-100">
                {formatPriceListPrice(item)}
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-white/8 pt-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleToggleStatus(item.id, item.isActive)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-[11px] font-medium transition-all duration-300 ${
                    item.isActive
                      ? 'border border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/[0.07]'
                      : 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15'
                  }`}
                >
                  {item.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{item.isActive ? 'Skrýt' : 'Zobrazit'}</span>
                </button>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/20 bg-sky-500/10 px-2.5 py-2.5 text-[11px] font-medium text-sky-200 transition-all duration-300 hover:bg-sky-500/15"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Upravit</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-2.5 py-2.5 text-[11px] font-medium text-red-200 transition-all duration-300 hover:bg-red-500/15"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Smazat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowAddModal(true)}
        className="group mt-5 flex w-full items-center justify-between gap-3 rounded-[24px] border border-dashed border-white/12 bg-white/[0.03] px-5 py-4 text-left text-gray-300 transition-all duration-300 hover:border-red-500/35 hover:bg-white/[0.05]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/12 text-red-300 ring-1 ring-inset ring-red-500/20 transition-all duration-300 group-hover:bg-red-500/16">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-sm font-semibold text-white">Přidat položku ceníku služeb</span>
            <span className="mt-1 block text-xs text-gray-400">Nová instalační služba s cenou a měnou</span>
          </div>
        </div>
        <span className="hidden text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-300 sm:inline">
          Nová karta
        </span>
      </button>
    </>
  )
}
