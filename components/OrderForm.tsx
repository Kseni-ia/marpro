'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createOrder } from '@/lib/orders'
import { OrderFormData } from '@/types/order'
import { useModal } from '@/contexts/ModalContext'
import { useLanguage } from '@/contexts/LanguageContext'
import TimeReelPicker from './TimeReelPicker'

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
  const { t } = useLanguage()

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
          <p className="text-gray-dark-textSecondary">We'll contact you soon to discuss your requirements.</p>
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
              placeholder="Enter your full address"
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
            <div>
              <label htmlFor="containerType" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                {t('order.containerType')} *
              </label>
              <select
                id="containerType"
                name="containerType"
                value={formData.containerType}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 ${formData.containerType ? 'bg-gray-100' : 'bg-white'}`}
                required
              >
                <option value="3m³">{t('order.container.3m3')}</option>
                <option value="5m³">{t('order.container.5m3')}</option>
              </select>
            </div>
          )}

          {serviceType === 'excavators' && (
            <div>
              <label htmlFor="excavatorType" className="block text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] mb-1">
                {t('order.excavatorType')} *
              </label>
              <select
                id="excavatorType"
                name="excavatorType"
                value={formData.excavatorType}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-800 ${formData.excavatorType ? 'bg-gray-100' : 'bg-white'}`}
                required
              >
                <option value="TB145">{t('order.excavator.tb145')}</option>
                <option value="TB290-1">{t('order.excavator.tb290-1')}</option>
                <option value="TB290-2">{t('order.excavator.tb290-2')}</option>
              </select>
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
