'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createOrder } from '@/lib/orders'
import { OrderFormData } from '@/types/order'
import { useModal } from '@/contexts/ModalContext'
import { useLanguage } from '@/contexts/LanguageContext'
import TimeReelPicker from './TimeReelPicker'
import { WasteType, getActiveWasteTypes, getActiveSurchargesByServiceType, Surcharge, ServiceType } from '@/lib/wasteTypes'
import { Container, getActiveContainers } from '@/lib/containers'
import { Excavator, getActiveExcavators } from '@/lib/excavators'

interface OrderFormProps {
  serviceType: 'containers' | 'excavators' | 'constructions'
  onClose: () => void
}

export default function OrderForm({ serviceType, onClose }: OrderFormProps) {
  // Get tomorrow's date as default
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    street: '',
    city: '',
    zip: '',
    country: '',
    lat: undefined,
    lng: undefined,
    serviceType,
    containerType: serviceType === 'containers' ? '3m³' : undefined,
    containerVolume: serviceType === 'containers' ? 3 : undefined,
    wasteTypeId: undefined,
    wasteTypeName: undefined,
    calculatedPrice: undefined,
    excavatorType: serviceType === 'excavators' ? 'TB145' : undefined,
    constructionType: serviceType === 'constructions' ? 'General' : undefined,
    orderDate: tomorrow,
    time: '09:00',
    endTime: '10:00',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { openModal, closeModal } = useModal()
  const { t, language } = useLanguage()
  
  // Dynamic pricing state
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([])
  const [containers, setContainers] = useState<Container[]>([])
  const [excavators, setExcavators] = useState<Excavator[]>([])
  const [surcharges, setSurcharges] = useState<Surcharge[]>([])
  const [loadingPricing, setLoadingPricing] = useState(false)
  const [selectedExcavator, setSelectedExcavator] = useState<Excavator | null>(null)

  // Handle modal state and body scroll prevention
  useEffect(() => {
    // Open modal when component mounts
    openModal()
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden'

    // Cleanup function to close modal and restore scroll when component unmounts
    return () => {
      closeModal()
      document.body.style.overflow = 'unset'
    }
  }, [openModal, closeModal])

  // Fetch pricing data for containers
  useEffect(() => {
    const fetchSurchargesData = async () => {
      try {
        const surchargesData = await getActiveSurchargesByServiceType(serviceType as ServiceType)
        setSurcharges(surchargesData)
      } catch (error) {
        console.error('Error fetching surcharges:', error)
      }
    }
    fetchSurchargesData()

    if (serviceType === 'containers') {
      const fetchPricingData = async () => {
        setLoadingPricing(true)
        try {
          const [wasteTypesData, containersData] = await Promise.all([
            getActiveWasteTypes(),
            getActiveContainers()
          ])
          setWasteTypes(wasteTypesData)
          setContainers(containersData)
          
          // Set first waste type as default if available
          if (wasteTypesData.length > 0) {
            const firstWasteType = wasteTypesData[0]
            setFormData(prev => ({
              ...prev,
              wasteTypeId: firstWasteType.id,
              wasteTypeName: firstWasteType.name[language] || firstWasteType.name.cs
            }))
          }
        } catch (error) {
          console.error('Error fetching pricing data:', error)
        } finally {
          setLoadingPricing(false)
        }
      }
      fetchPricingData()
    }

    if (serviceType === 'excavators') {
      const fetchExcavatorsData = async () => {
        setLoadingPricing(true)
        try {
          const excavatorsData = await getActiveExcavators()
          setExcavators(excavatorsData)
          
          // Set first excavator as default if available
          if (excavatorsData.length > 0) {
            const firstExcavator = excavatorsData[0]
            setSelectedExcavator(firstExcavator)
            setFormData(prev => ({
              ...prev,
              excavatorType: `${firstExcavator.type} - ${firstExcavator.model}`,
              calculatedPrice: firstExcavator.price
            }))
          }
        } catch (error) {
          console.error('Error fetching excavators:', error)
        } finally {
          setLoadingPricing(false)
        }
      }
      fetchExcavatorsData()
    }
  }, [serviceType, language])

  // Calculate price when waste type or container volume changes
  useEffect(() => {
    if (serviceType === 'containers' && formData.wasteTypeId && formData.containerVolume) {
      const selectedWasteType = wasteTypes.find(wt => wt.id === formData.wasteTypeId)
      if (selectedWasteType) {
        const pricing = selectedWasteType.pricing.find(p => p.volume === formData.containerVolume)
        if (pricing) {
          setFormData(prev => ({
            ...prev,
            calculatedPrice: pricing.price
          }))
        }
      }
    }
  }, [formData.wasteTypeId, formData.containerVolume, wasteTypes, serviceType])

  // Helper to get localized waste type name
  const getWasteTypeName = (wasteType: WasteType) => {
    return wasteType.name[language] || wasteType.name.cs || wasteType.name.en
  }

  // Get available volumes from containers
  const availableVolumes = containers.map(c => c.volume).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Combine date and time for calendar booking
      const dateTime = new Date(formData.orderDate)
      const [hours, minutes] = formData.time.split(':')
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      // Calculate duration based on start and end time
      let durationHours = 1 // Default
      if (formData.endTime) {
        const [startHours, startMinutes] = formData.time.split(':')
        const [endHours, endMinutes] = formData.endTime.split(':')
        const startTotalMinutes = parseInt(startHours) * 60 + parseInt(startMinutes)
        const endTotalMinutes = parseInt(endHours) * 60 + parseInt(endMinutes)
        durationHours = Math.max(1, (endTotalMinutes - startTotalMinutes) / 60)
      }

      // Prepare customer data for booking
      const bookingData = {
        customerData: formData,
        dateTime: dateTime.toISOString(),
        durationHours
      }
      
      console.log('Sending booking data:', bookingData)
      console.log('Duration calculated:', durationHours, 'hours')

      // Determine the correct API endpoint based on service type
      const getApiEndpoint = (serviceType: string) => {
        switch (serviceType) {
          case 'containers':
            return '/api/book-container'
          case 'excavators':
            return '/api/book-excavator'
          case 'constructions':
            return '/api/book-construction'
          default:
            return '/api/book-with-calendar' // fallback
        }
      }

      const apiEndpoint = getApiEndpoint(formData.serviceType)
      console.log('Using API endpoint:', apiEndpoint, 'for service:', formData.serviceType)

      // Try to create booking with calendar integration
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking')
      }

      // Show warning if calendar sync failed
      if (result.calendarWarning) {
        console.warn('Calendar sync warning:', result.calendarWarning)
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error('Order submission error:', error)
      setError(error.message || 'Failed to submit order. Please try again.')
    } finally {
      setLoading(false)
    }
  }




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'date') {
      setFormData(prev => ({ ...prev, [name]: new Date(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
        <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] p-8 max-w-md w-full text-center shadow-[0_25px_50px_rgba(0,0,0,0.4)]">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-dark-text mb-2">{t('order.success')}</h2>
          <p className="text-gray-dark-textSecondary">{t('order.successMessage')}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] p-4 max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-[0_25px_50px_RGBA(0,0,0,0.4)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-dark-text mb-4">
            {t('order.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-dark-textSecondary hover:text-gray-dark-text text-2xl font-bold transition-colors duration-300 hover:scale-110 transform"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                {t('order.firstName')} *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 placeholder-gray-500 ${formData.firstName ? 'bg-gray-100' : 'bg-white'}`}
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                {t('order.lastName')} *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 placeholder-gray-500 ${formData.lastName ? 'bg-gray-100' : 'bg-white'}`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                {t('order.email')} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 placeholder-gray-500 ${formData.email ? 'bg-gray-100' : 'bg-white'}`}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                {t('order.phone')} *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 placeholder-gray-500 ${formData.phone ? 'bg-gray-100' : 'bg-white'}`}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
              {t('order.address')} *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 placeholder-gray-500 ${formData.address ? 'bg-gray-100' : 'bg-white'}`}
              placeholder={t('order.addressPlaceholder')}
              required
            />
          </div>

          {/* Address Details Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                {t('order.city')} *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 placeholder-gray-500 ${formData.city ? 'bg-gray-100' : 'bg-white'}`}
                placeholder="Enter city"
                required
              />
            </div>
            
            <div>
              <label htmlFor="zip" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                {t('order.zip')} *
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 placeholder-gray-500 ${formData.zip ? 'bg-gray-100' : 'bg-white'}`}
                placeholder="Enter ZIP code"
                required
              />
            </div>
            
            <div>
              <label htmlFor="country" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                {t('order.country')} *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 ${formData.country ? 'bg-gray-100' : 'bg-white'}`}
                required
              >
                <option value="">{t('order.selectCountry')}</option>
                <option value="Czech Republic">{t('order.country.czechRepublic')}</option>
                <option value="Slovakia">{t('order.country.slovakia')}</option>
                <option value="Germany">{t('order.country.germany')}</option>
                <option value="Poland">{t('order.country.poland')}</option>
                <option value="Austria">{t('order.country.austria')}</option>
              </select>
            </div>
          </div>

          {serviceType === 'containers' && (
            <div className="space-y-3">
              {/* Container Volume and Waste Type Selection */}
              <div className="grid grid-cols-2 gap-3">
                {/* Container Volume */}
                <div>
                  <label htmlFor="containerVolume" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                    {t('order.containerVolume') || 'Objem kontejneru'} *
                  </label>
                  <select
                    id="containerVolume"
                    name="containerVolume"
                    value={formData.containerVolume || 3}
                    onChange={(e) => {
                      const volume = Number(e.target.value)
                      setFormData(prev => ({
                        ...prev,
                        containerVolume: volume,
                        containerType: `${volume}m³`
                      }))
                    }}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 ${formData.containerVolume ? 'bg-gray-100' : 'bg-white'}`}
                    required
                    disabled={loadingPricing}
                  >
                    {loadingPricing ? (
                      <option>Načítání...</option>
                    ) : availableVolumes.length > 0 ? (
                      availableVolumes.map(volume => (
                        <option key={volume} value={volume}>{volume} m³</option>
                      ))
                    ) : (
                      <>
                        <option value={3}>3 m³</option>
                        <option value={5}>5 m³</option>
                        <option value={10}>10 m³</option>
                        <option value={15}>15 m³</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Waste Type */}
                <div>
                  <label htmlFor="wasteType" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                    {t('order.wasteType') || 'Typ odpadu'} *
                  </label>
                  <select
                    id="wasteType"
                    name="wasteTypeId"
                    value={formData.wasteTypeId || ''}
                    onChange={(e) => {
                      const wasteType = wasteTypes.find(wt => wt.id === e.target.value)
                      setFormData(prev => ({
                        ...prev,
                        wasteTypeId: e.target.value,
                        wasteTypeName: wasteType ? getWasteTypeName(wasteType) : ''
                      }))
                    }}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 ${formData.wasteTypeId ? 'bg-gray-100' : 'bg-white'}`}
                    required
                    disabled={loadingPricing}
                  >
                    {loadingPricing ? (
                      <option>Načítání...</option>
                    ) : wasteTypes.length > 0 ? (
                      wasteTypes.map(wasteType => (
                        <option key={wasteType.id} value={wasteType.id}>
                          {getWasteTypeName(wasteType)}
                        </option>
                      ))
                    ) : (
                      <option value="">{t('order.selectWasteType') || 'Vyberte typ odpadu'}</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Dynamic Price Display */}
              {formData.calculatedPrice && formData.calculatedPrice > 0 && (
                <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-300 uppercase tracking-wide font-semibold">
                        {t('order.estimatedPrice') || 'Orientační cena'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formData.containerVolume}m³ • {formData.wasteTypeName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">
                        {formData.calculatedPrice.toLocaleString('cs-CZ')} Kč
                      </p>
                      <p className="text-[10px] text-gray-500">{t('surcharges.vatNote') || 'bez DPH'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {serviceType === 'excavators' && (
            <div className="space-y-3">
              {/* Excavator Selection */}
              <div>
                <label htmlFor="excavatorType" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                  Typ mechanizace *
                </label>
                {loadingPricing ? (
                  <div className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg text-gray-500">
                    Načítání...
                  </div>
                ) : (
                  <select
                    id="excavatorType"
                    name="excavatorType"
                    value={selectedExcavator?.id || ''}
                    onChange={(e) => {
                      const selected = excavators.find(ex => ex.id === e.target.value)
                      if (selected) {
                        setSelectedExcavator(selected)
                        setFormData(prev => ({
                          ...prev,
                          excavatorType: `${selected.type} - ${selected.model}`,
                          calculatedPrice: selected.price
                        }))
                      }
                    }}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 ${selectedExcavator ? 'bg-gray-100' : 'bg-white'}`}
                    required
                  >
                    <option value="">-- Vyberte stroj --</option>
                    {excavators.map(ex => (
                      <option key={ex.id} value={ex.id}>
                        {ex.type} - {ex.model} {ex.specs?.weight ? `| ${ex.specs.weight}` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Dynamic Price Display for Excavators */}
              {selectedExcavator && selectedExcavator.price > 0 && (
                <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-300 uppercase tracking-wide font-semibold">
                        Orientační cena
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {selectedExcavator.type} - {selectedExcavator.model}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">
                        {selectedExcavator.price.toLocaleString('cs-CZ')} Kč
                      </p>
                      <p className="text-[10px] text-gray-500">/ hod. bez DPH</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {serviceType === 'constructions' && (
            <div>
              <label htmlFor="constructionType" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                {t('order.constructionType')} *
              </label>
              <select
                id="constructionType"
                name="constructionType"
                value={formData.constructionType}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 ${formData.constructionType ? 'bg-gray-100' : 'bg-white'}`}
                required
              >
                <option value="General">{t('order.construction.general')}</option>
                <option value="Earthworks">{t('order.construction.earthworks')}</option>
                <option value="Foundation">{t('order.construction.foundation')}</option>
                <option value="Demolition">{t('order.construction.demolition')}</option>
              </select>
            </div>
          )}

          <div>
            <label htmlFor="date" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
              {t('order.dateNeeded')} *
            </label>
            <input
              type="date"
              id="orderDate"
              name="orderDate"
              value={formatDateForInput(formData.orderDate)}
              onChange={handleChange}
              min={formatDateForInput(new Date())}
              className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800"
              required
            />
          </div>

          <div className="space-y-3">
            <TimeReelPicker
              label={`${t('order.startTime')} *`}
              date={formData.orderDate}
              value={formData.time}
              onChange={(time) => {
                setFormData(prev => ({ ...prev, time }))
              }}
              onEndTimeChange={(endTime) => {
                setFormData(prev => ({ ...prev, endTime }))
              }}
              minTime="06:00"
              maxTime="20:00"
              serviceType={serviceType}
            />
            
            <TimeReelPicker
              label={`${t('order.endTime')} *`}
              date={formData.orderDate}
              value={formData.endTime || ''}
              onChange={(time) => {
                setFormData(prev => ({ ...prev, endTime: time }))
              }}
              startTime={formData.time}
              isEndTime={true}
              minTime="06:00"
              maxTime="20:00"
              serviceType={serviceType}
              error={!!(formData.time && formData.endTime && formData.endTime <= formData.time)}
            />

            {formData.time && formData.endTime && formData.endTime <= formData.time && (
              <div className="bg-red-900/20 border border-red-400/30 text-red-400 px-3 py-2 rounded-md text-xs">
                {t('order.endTimeError')}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
              {t('order.additionalInfo')}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={2}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none text-gray-800 placeholder-gray-500 ${formData.message ? 'bg-gray-100' : 'bg-white'}`}
              placeholder={t('order.additionalInfoPlaceholder')}
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-400/30 text-red-400 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Surcharges Section - For Containers and Excavators - Dynamic from Firebase */}
          {(serviceType === 'containers' || serviceType === 'excavators') && surcharges.length > 0 && (
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 mb-2">
                {t('surcharges.title')}
              </h3>
              <div className="space-y-2 text-xs">
                {surcharges.map((surcharge, index) => (
                  <div 
                    key={surcharge.id} 
                    className={`flex items-center justify-between py-1 ${index < surcharges.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {surcharge.name.cs.includes('Víkend') ? '🗓' : 
                         surcharge.name.cs.includes('čekání') ? '⏱' : 
                         surcharge.name.cs.includes('den') ? '📅' : 
                         surcharge.name.cs.includes('břeh') || surcharge.name.cs.includes('Doprava') ? '🚚' : 
                         surcharge.name.cs.includes('čas') ? '⏱' : '📍'}
                      </span>
                      <div>
                        <span className="text-gray-800 font-medium">{surcharge.name.cs}</span>
                        {surcharge.note?.cs && (
                          <p className="text-gray-500 text-[10px]">{surcharge.note.cs}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800">
                        {surcharge.price > 0 ? `${surcharge.price.toLocaleString('cs-CZ')} Kč` : 'Individuálně'}
                      </span>
                      {surcharge.price > 0 && (
                        <p className="text-gray-500 text-[10px]">{t('surcharges.vatNote')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-dark-bg text-gray-dark-textSecondary py-2 px-3 text-sm rounded-lg font-semibold border border-gray-dark-border hover:bg-gray-dark-accent hover:text-gray-dark-text transition-all duration-300 hover:shadow-lg"
            >
              {t('order.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-3 text-sm rounded-lg font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {loading ? t('order.submitting') : t('order.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
