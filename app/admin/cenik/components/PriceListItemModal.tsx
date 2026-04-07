'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import {
  createPriceListItem,
  formatPriceListAmount,
  normalizePriceListCurrency,
  PRICE_LIST_CURRENCIES,
  PriceListItem,
  updatePriceListItem,
} from '@/lib/priceList'

interface PriceListItemModalProps {
  item?: PriceListItem | null
  onClose: () => void
  onSuccess: () => void
}

export default function PriceListItemModal({
  item,
  onClose,
  onSuccess,
}: PriceListItemModalProps) {
  const isEditing = Boolean(item)
  const [formData, setFormData] = useState({
    name: item?.name || '',
    price: formatPriceListAmount(item?.price || ''),
    priceCurrency: normalizePriceListCurrency(item?.price || '', item?.priceCurrency),
    isActive: item?.isActive ?? true,
    presetKey: item?.presetKey || null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#0b1220]/80 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-red-500/40 focus:bg-[#0b1220]'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isEditing && item) {
        await updatePriceListItem(item.id, formData)
      } else {
        await createPriceListItem(formData)
      }

      onSuccess()
      onClose()
    } catch (submitError) {
      console.error('Failed to save price list item:', submitError)
      setError('Nepodařilo se uložit položku ceníku služeb.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-[26px] border border-white/10 bg-[#111827]/95 shadow-[0_26px_60px_rgba(0,0,0,0.42)]">
        <div className="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300/80">
              Ceník služeb
            </p>
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              {isEditing ? 'Upravit položku ceníku služeb' : 'Přidat položku ceníku služeb'}
            </h3>
            <p className="mt-1.5 text-sm text-gray-400">
              Tento ceník služeb je určený pro instalační služby.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 transition-all duration-300 hover:bg-red-500/12 hover:text-white"
            title="Zavřít"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-[18px] border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Název služby
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              className={inputClass}
              placeholder="Např. Instalatérské služby"
              required
            />
          </div>

          <div className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Cena
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  price: formatPriceListAmount(event.target.value),
                }))
              }
              className={inputClass}
              placeholder="Např. od 1 500"
              required
            />
          </div>

          <div className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Měna
            </label>
            <select
              value={formData.priceCurrency}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  priceCurrency: event.target.value as (typeof PRICE_LIST_CURRENCIES)[number],
                }))
              }
              className={inputClass}
            >
              {PRICE_LIST_CURRENCIES.map((currency) => (
                <option key={currency} value={currency} className="bg-gray-900">
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, isActive: event.target.checked }))
                }
                className="h-4 w-4 rounded border-white/20 bg-[#0b1220] text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-200">Viditelné na veřejném ceníku</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/8 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-gray-200 transition-all duration-300 hover:bg-white/[0.08]"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-[#0b1220] transition-all duration-300 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Ukládá se...' : isEditing ? 'Uložit změny' : 'Vytvořit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
