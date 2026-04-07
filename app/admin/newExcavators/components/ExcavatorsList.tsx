'use client'

import React, { useState, useEffect } from 'react'
import { getAllExcavators, toggleExcavatorStatus, deleteExcavator, Excavator } from '@/lib/excavators'
import { Edit, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import AddExcavatorModal from './AddExcavatorModal'
import ExcavatorDetailsModal from './ExcavatorDetailsModal'
import Image from 'next/image'
import { getExcavatorAccent } from '@/lib/excavatorAccent'

export default function ExcavatorsList() {
  const { t } = useLanguage()
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
      alert(t('admin.failedUpdateStatus'))
    }
  }

  const handleDelete = async (excavatorId: string, model: string) => {
    if (confirm(t('admin.confirmDeleteExcavator').replace('{model}', model))) {
      try {
        await deleteExcavator(excavatorId)
        await fetchExcavators()
      } catch (error) {
        console.error('Error deleting excavator:', error)
        alert(t('admin.failedDelete'))
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-dark-textSecondary">{t('admin.loadingExcavators')}</div>
      </div>
    )
  }

  const formatPrice = (price: number) => `${price.toLocaleString('cs-CZ')} CZK/h`
  const getTypeLabel = (type: string) => {
    if (type === 'mini') return t('admin.mini')
    if (type === 'standard') return t('admin.standard')
    if (type === 'large') return t('admin.large')
    return type
  }

  return (
    <>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 mb-5">
        {excavators.map((excavator) => {
          const accent = getExcavatorAccent(excavator.type)

          return (
            <div
              key={excavator.id}
              onClick={() => setSelectedExcavator(excavator)}
              className="group cursor-pointer rounded-[24px] border p-4 shadow-[0_18px_36px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: accent.border,
                background: `linear-gradient(145deg, ${accent.tint} 0%, rgba(255,255,255,0.035) 22%, rgba(255,255,255,0.025) 100%)`,
              }}
            >
              <div
                className="mb-4 h-px w-full"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${accent.borderStrong} 28%, transparent 100%)`,
                }}
              />

              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tight" style={{ color: accent.text }}>
                      {excavator.model}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{getTypeLabel(excavator.type)}</p>
                </div>

                <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  excavator.isActive
                    ? 'bg-emerald-500/12 text-emerald-300 ring-1 ring-inset ring-emerald-500/25'
                    : 'bg-red-500/12 text-red-300 ring-1 ring-inset ring-red-500/25'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${excavator.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  {excavator.isActive ? t('admin.visible') : t('admin.hidden')}
                </span>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <span
                  className="rounded-full px-3 py-1 text-sm text-gray-100"
                  style={{ backgroundColor: accent.tint, border: `1px solid ${accent.border}` }}
                >
                  {excavator.specs.weight}
                </span>
                <span
                  className="rounded-full px-3 py-1 text-sm text-gray-100"
                  style={{ backgroundColor: accent.tint, border: `1px solid ${accent.border}` }}
                >
                  {excavator.specs.bucketCapacity}
                </span>
                <span
                  className="rounded-full px-3 py-1 text-sm text-gray-100"
                  style={{ backgroundColor: accent.tint, border: `1px solid ${accent.border}` }}
                >
                  {excavator.specs.maxReach}
                </span>
                <span
                  className="rounded-full px-3 py-1 text-sm font-medium"
                  style={{
                    backgroundColor: accent.tintStrong,
                    border: `1px solid ${accent.borderStrong}`,
                    color: accent.text,
                  }}
                >
                  {formatPrice(excavator.price)}
                </span>
              </div>

              <div
                className="mb-3 flex min-h-[128px] items-center justify-center rounded-[20px] border px-3 py-4"
                style={{
                  borderColor: accent.border,
                  background: `linear-gradient(145deg, rgba(255,255,255,0.04) 0%, ${accent.tint} 100%)`,
                }}
              >
                <Image
                  src={excavator.svgPath || '/TB145.svg'}
                  alt={`${excavator.model} excavator`}
                  width={200}
                  height={96}
                  className="h-full max-h-[96px] w-full object-contain"
                />
              </div>

              <div className="mb-4 min-h-[44px]">
                {excavator.description.en ? (
                  <p className="text-xs leading-5 text-gray-300/90 line-clamp-2">
                    {excavator.description.en}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">Popis není vyplněný.</p>
                )}
              </div>

              <div
                className="grid grid-cols-3 gap-2 border-t border-white/8 pt-4"
                onClick={(e) => e.stopPropagation()}
                style={{ borderColor: accent.border }}
              >
                <button
                  onClick={() => handleToggleStatus(excavator.id, excavator.isActive)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-[11px] font-medium transition-all duration-300 ${
                    excavator.isActive
                      ? 'border border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/[0.07]'
                      : 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15'
                  }`}
                  title={excavator.isActive ? t('admin.hide') : t('admin.show')}
                >
                  {excavator.isActive ? (
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
                  onClick={() => setSelectedExcavator(excavator)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/20 bg-sky-500/10 px-2.5 py-2.5 text-[11px] font-medium text-sky-200 transition-all duration-300 hover:bg-sky-500/15"
                  title={t('admin.edit')}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('admin.edit')}</span>
                </button>

                <button
                  onClick={() => handleDelete(excavator.id, excavator.model)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-2.5 py-2.5 text-[11px] font-medium text-red-200 transition-all duration-300 hover:bg-red-500/15"
                  title={t('admin.delete')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('admin.delete')}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {excavators.length === 0 && (
        <div className="mb-5 rounded-[24px] border border-dashed border-white/12 bg-white/[0.025] px-5 py-10 text-center">
          <h3 className="text-lg font-semibold text-white">{t('admin.addNewExcavator')}</h3>
          <p className="mt-2 text-sm text-gray-400">{t('admin.addNewExcavatorDesc')}</p>
        </div>
      )}

      <button
        onClick={() => setShowAddModal(true)}
        className="group flex w-full items-center justify-between gap-3 rounded-[24px] border border-dashed border-white/12 bg-white/[0.03] px-5 py-4 text-left text-gray-300 transition-all duration-300 hover:border-red-500/35 hover:bg-white/[0.05]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/12 text-red-300 ring-1 ring-inset ring-red-500/20 transition-all duration-300 group-hover:bg-red-500/16">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-sm font-semibold text-white">{t('admin.addNewExcavator')}</span>
            <span className="mt-1 block text-xs text-gray-400">{t('admin.addNewExcavatorDesc')}</span>
          </div>
        </div>
        <span className="hidden text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-300 sm:inline">
          Nová karta
        </span>
      </button>
    </>
  )
}
