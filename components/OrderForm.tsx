'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createOrder } from '@/lib/orders'
import { getAvailableTimeSlots } from '@/lib/equipment'
import { OrderFormData } from '@/types/order'

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
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [citySuggestions, setCitySuggestions] = useState<any[]>([])
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [selectedCityIndex, setSelectedCityIndex] = useState(-1)
  const [zipSuggestions, setZipSuggestions] = useState<any[]>([])
  const [showZipSuggestions, setShowZipSuggestions] = useState(false)
  const [selectedZipIndex, setSelectedZipIndex] = useState(-1)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const addressInputRef = useRef<HTMLInputElement>(null)
  const cityInputRef = useRef<HTMLInputElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const cityTimeoutRef = useRef<NodeJS.Timeout>()
  const zipTimeoutRef = useRef<NodeJS.Timeout>()
  const cacheRef = useRef<Map<string, any[]>>(new Map())

  // Check equipment availability when date, equipment type, or service type changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (serviceType === 'constructions') {
        // Constructions don't need equipment booking
        setAvailableTimeSlots([
          '06:00', '06:15', '06:30', '06:45',
          '07:00', '07:15', '07:30', '07:45',
          '08:00', '08:15', '08:30', '08:45',
          '09:00', '09:15', '09:30', '09:45',
          '10:00', '10:15', '10:30', '10:45',
          '11:00', '11:15', '11:30', '11:45',
          '12:00', '12:15', '12:30', '12:45',
          '13:00', '13:15', '13:30', '13:45',
          '14:00', '14:15', '14:30', '14:45',
          '15:00', '15:15', '15:30', '15:45',
          '16:00', '16:15', '16:30', '16:45',
          '17:00', '17:15', '17:30', '17:45',
          '18:00'
        ])
        return
      }

      const equipmentType = serviceType === 'containers' ? 'containers' : 'excavators'
      const equipmentId = serviceType === 'containers' ? formData.containerType : formData.excavatorType

      if (!equipmentId) return

      setLoadingAvailability(true)
      try {
        const slots = await getAvailableTimeSlots(equipmentType, equipmentId, formData.orderDate)
        setAvailableTimeSlots(slots)
        
        // If current selected time is not available, reset it
        if (!slots.includes(formData.time)) {
          setFormData(prev => ({ ...prev, time: slots[0] || '09:00' }))
        }
      } catch (error) {
        console.error('Error checking availability:', error)
        setAvailableTimeSlots([])
      } finally {
        setLoadingAvailability(false)
      }
    }

    checkAvailability()
  }, [formData.orderDate, formData.containerType, formData.excavatorType, serviceType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await createOrder(formData)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error: any) {
      setError('Failed to submit order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Enhanced Mapy.cz suggestions with caching - generic function
  const fetchMapySuggestions = async (query: string, type: 'address' | 'municipality' | 'zip', setSuggestionsFn: Function, setShowFn: Function) => {
    const MIN_CHARS = type === 'zip' ? 2 : 3
    const trimmedQuery = query.trim()
    
    console.log(`[${type}] Fetching suggestions for:`, trimmedQuery)
    
    if (trimmedQuery.length < MIN_CHARS) {
      console.log(`[${type}] Query too short (${trimmedQuery.length} < ${MIN_CHARS})`)
      setSuggestionsFn([])
      setShowFn(false)
      return
    }

    const cacheKey = `${type}-${trimmedQuery.toLowerCase()}`
    
    // Check cache first
    if (cacheRef.current.has(cacheKey)) {
      const cachedSuggestions = cacheRef.current.get(cacheKey)!
      console.log(`[${type}] Using cached results:`, cachedSuggestions.length, 'items')
      setSuggestionsFn(cachedSuggestions)
      setShowFn(cachedSuggestions.length > 0)
      return
    }

    try {
      let apiUrl = ''
      // Using the correct Seznam.cz Suggest API endpoint
      if (type === 'address') {
        apiUrl = `https://suggest.seznam.cz/suggest?query=${encodeURIComponent(trimmedQuery)}&count=8&type=address&apikey=RSJkw9_b9rwaalY_vfyWFqeMTRTfY0zitXA1n3VesHE`
      } else if (type === 'municipality') {
        apiUrl = `https://suggest.seznam.cz/suggest?query=${encodeURIComponent(trimmedQuery)}&count=8&type=municipality&apikey=RSJkw9_b9rwaalY_vfyWFqeMTRTfY0zitXA1n3VesHE`
      } else if (type === 'zip') {
        apiUrl = `https://suggest.seznam.cz/suggest?query=${encodeURIComponent(trimmedQuery)}&count=8&type=address&apikey=RSJkw9_b9rwaalY_vfyWFqeMTRTfY0zitXA1n3VesHE`
      }
      
      console.log(`[${type}] API URL:`, apiUrl)
      const response = await fetch(apiUrl)
      console.log(`[${type}] Response status:`, response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log(`[${type}] API Response:`, data)
        // Seznam.cz API returns results in 'result' array, not 'items'
        const items = data.result || data.items || []
        console.log(`[${type}] Found ${items.length} suggestions`)
        
        // Cache the results
        cacheRef.current.set(cacheKey, items)
        
        // Limit cache size to prevent memory issues
        if (cacheRef.current.size > 100) {
          const firstKey = cacheRef.current.keys().next().value
          cacheRef.current.delete(firstKey)
        }
        
        setSuggestionsFn(items)
        setShowFn(items.length > 0)
      } else {
        console.error(`[${type}] API Error:`, response.status, response.statusText)
        const errorText = await response.text()
        console.error(`[${type}] Error details:`, errorText)
      }
    } catch (error) {
      console.error(`Error fetching ${type} suggestions:`, error)
      setSuggestionsFn([])
      setShowFn(false)
    }
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, address: value }))
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Enhanced debouncing with longer delay for better performance
    timeoutRef.current = setTimeout(() => {
      fetchMapySuggestions(value, 'address', setSuggestions, setShowSuggestions)
    }, 350)
  }

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, city: value }))
    
    // Clear previous timeout
    if (cityTimeoutRef.current) {
      clearTimeout(cityTimeoutRef.current)
    }
    
    cityTimeoutRef.current = setTimeout(() => {
      fetchMapySuggestions(value, 'municipality', setCitySuggestions, setShowCitySuggestions)
    }, 350)
  }

  const handleZipInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, zip: value }))
    
    // Clear previous timeout
    if (zipTimeoutRef.current) {
      clearTimeout(zipTimeoutRef.current)
    }
    
    zipTimeoutRef.current = setTimeout(() => {
      fetchMapySuggestions(value, 'zip', setZipSuggestions, setShowZipSuggestions)
    }, 350)
  }

  const selectSuggestion = (suggestion: any) => {
    // Seznam.cz API format parsing
    const addressText = suggestion.text || suggestion.userData?.suggestFirstRow || suggestion.name || ''
    
    // Enhanced address parsing for Seznam.cz format
    const street = suggestion.street || suggestion.userData?.street || ''
    const streetNumber = suggestion.streetNumber || suggestion.userData?.streetNumber || ''
    const fullStreet = [street, streetNumber].filter(Boolean).join(' ')
    
    const city = suggestion.municipality || 
                 suggestion.city || 
                 suggestion.userData?.municipality || 
                 suggestion.userData?.city || ''
    
    const zip = suggestion.zip || 
                suggestion.postal_code ||
                suggestion.userData?.zip || ''
    
    const country = suggestion.country || suggestion.userData?.country || 'Czech Republic'
    
    setFormData(prev => ({
      ...prev,
      address: addressText,
      street: fullStreet,
      city: city,
      zip: zip,
      country: country,
      lat: suggestion.lat || suggestion.location?.lat,
      lng: suggestion.lng || suggestion.location?.lng
    }))
    
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
  }

  const selectCitySuggestion = (suggestion: any) => {
    // Seznam.cz API format for city suggestions
    const cityName = suggestion.text || suggestion.municipality || suggestion.name || ''
    const zip = suggestion.zip || suggestion.postal_code || ''
    const country = suggestion.country || 'Czech Republic'
    
    setFormData(prev => ({
      ...prev,
      city: cityName,
      zip: zip || prev.zip,
      country: country,
      lat: suggestion.lat || suggestion.location?.lat || prev.lat,
      lng: suggestion.lng || suggestion.location?.lng || prev.lng
    }))
    
    setCitySuggestions([])
    setShowCitySuggestions(false)
    setSelectedCityIndex(-1)
  }

  const selectZipSuggestion = (suggestion: any) => {
    // Seznam.cz API format for ZIP suggestions
    const zip = suggestion.zip || suggestion.postal_code || suggestion.text || ''
    const city = suggestion.municipality || suggestion.city || ''
    const country = suggestion.country || 'Czech Republic'
    
    setFormData(prev => ({
      ...prev,
      zip: zip,
      city: city || prev.city,
      country: country,
      lat: suggestion.lat || suggestion.location?.lat || prev.lat,
      lng: suggestion.lng || suggestion.location?.lng || prev.lng
    }))
    
    setZipSuggestions([])
    setShowZipSuggestions(false)
    setSelectedZipIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(suggestions[selectedSuggestionIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
    }
  }

  const handleCityKeyDown = (e: React.KeyboardEvent) => {
    if (!showCitySuggestions || citySuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedCityIndex(prev => 
          prev < citySuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedCityIndex(prev => 
          prev > 0 ? prev - 1 : citySuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedCityIndex >= 0) {
          selectCitySuggestion(citySuggestions[selectedCityIndex])
        }
        break
      case 'Escape':
        setShowCitySuggestions(false)
        setSelectedCityIndex(-1)
        break
    }
  }

  const handleZipKeyDown = (e: React.KeyboardEvent) => {
    if (!showZipSuggestions || zipSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedZipIndex(prev => 
          prev < zipSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedZipIndex(prev => 
          prev > 0 ? prev - 1 : zipSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedZipIndex >= 0) {
          selectZipSuggestion(zipSuggestions[selectedZipIndex])
        }
        break
      case 'Escape':
        setShowZipSuggestions(false)
        setSelectedZipIndex(-1)
        break
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-[20px] p-8 max-w-md w-full text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Submitted!</h2>
          <p className="text-gray-600">We'll contact you soon to discuss your requirements.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Request {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Service Address *
            </label>
            <div className="relative">
              <input
                ref={addressInputRef}
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleAddressInputChange}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="Start typing your address..."
                autoComplete="off"
                required
              />
                            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => {
                    // Extract address components for Seznam.cz API format
                    const mainAddress = suggestion.text || suggestion.name || ''
                    const city = suggestion.municipality || suggestion.city || ''
                    const zip = suggestion.zip || suggestion.postal_code || ''
                    const country = suggestion.country || ''
                    
                    // Create formatted address details
                    const addressDetails = [city, zip, country].filter(Boolean).join(', ')
                    
                    return (
                      <div
                        key={index}
                        className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                          index === selectedSuggestionIndex ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        <div className="font-medium text-gray-900 leading-tight">
                          {mainAddress}
                        </div>
                        {addressDetails && (
                          <div className="text-sm text-gray-600 mt-1">
                            {addressDetails}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Address Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <div className="relative">
                <input
                  ref={cityInputRef}
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleCityInputChange}
                  onKeyDown={handleCityKeyDown}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  placeholder="Start typing city..."
                  autoComplete="off"
                  required
                />
                
                {showCitySuggestions && citySuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {citySuggestions.map((suggestion, index) => {
                      const cityName = suggestion.text || suggestion.municipality || suggestion.name || ''
                      const zip = suggestion.zip || suggestion.postal_code || ''
                      const country = suggestion.country || ''
                      
                      return (
                        <div
                          key={index}
                          className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                            index === selectedCityIndex ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => selectCitySuggestion(suggestion)}
                        >
                          <div className="font-medium text-gray-900 leading-tight">
                            {cityName}
                          </div>
                          {(zip || country) && (
                            <div className="text-sm text-gray-600 mt-1">
                              {[zip, country].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <div className="relative">
                <input
                  ref={zipInputRef}
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleZipInputChange}
                  onKeyDown={handleZipKeyDown}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  placeholder="Start typing ZIP..."
                  autoComplete="off"
                  required
                />
                
                {showZipSuggestions && zipSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {zipSuggestions.map((suggestion, index) => {
                      const zip = suggestion.zip || suggestion.postal_code || suggestion.text || ''
                      const city = suggestion.municipality || suggestion.city || ''
                      const country = suggestion.country || ''
                      
                      return (
                        <div
                          key={index}
                          className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                            index === selectedZipIndex ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => selectZipSuggestion(suggestion)}
                        >
                          <div className="font-medium text-gray-900 leading-tight">
                            {zip}
                          </div>
                          {(city || country) && (
                            <div className="text-sm text-gray-600 mt-1">
                              {[city, country].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select Country</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Germany">Germany</option>
                <option value="Poland">Poland</option>
                <option value="Austria">Austria</option>
              </select>
            </div>
          </div>

          {serviceType === 'containers' && (
            <div>
              <label htmlFor="containerType" className="block text-sm font-medium text-gray-700 mb-2">
                Container Type *
              </label>
              <select
                id="containerType"
                name="containerType"
                value={formData.containerType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="3m³">3m³ Container (2 x 0.5 x 3.8 m)</option>
                <option value="5m³">5m³ Container (2 x 0.7 x 3.8 m)</option>
              </select>
            </div>
          )}

          {serviceType === 'excavators' && (
            <div>
              <label htmlFor="excavatorType" className="block text-sm font-medium text-gray-700 mb-2">
                Excavator Type *
              </label>
              <select
                id="excavatorType"
                name="excavatorType"
                value={formData.excavatorType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="TB145">TB145 - Compact Excavator</option>
                <option value="TB290">TB290 - Large Excavator</option>
              </select>
            </div>
          )}

          {serviceType === 'constructions' && (
            <div>
              <label htmlFor="constructionType" className="block text-sm font-medium text-gray-700 mb-2">
                Construction Type *
              </label>
              <select
                id="constructionType"
                name="constructionType"
                value={formData.constructionType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="General">General Construction</option>
                <option value="Earthworks">Earthworks</option>
                <option value="Foundation">Foundation Work</option>
                <option value="Demolition">Demolition</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date Needed *
              </label>
              <input
                type="date"
                id="orderDate"
                name="orderDate"
                value={formatDateForInput(formData.orderDate)}
                onChange={handleChange}
                min={formatDateForInput(new Date())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Approximate Time * {loadingAvailability && <span className="text-sm text-gray-500">(Checking availability...)</span>}
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
                disabled={loadingAvailability}
              >
                {availableTimeSlots.length === 0 && !loadingAvailability ? (
                  <option value="">No available time slots</option>
                ) : (
                  availableTimeSlots.map((timeSlot) => {
                    const [hours, minutes] = timeSlot.split(':')
                    const hour24 = parseInt(hours)
                    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
                    const ampm = hour24 >= 12 ? 'PM' : 'AM'
                    const displayTime = `${hour12}:${minutes} ${ampm}`
                    
                    return (
                      <option key={timeSlot} value={timeSlot}>
                        {displayTime}
                      </option>
                    )
                  })
                )}
              </select>
              {availableTimeSlots.length === 0 && !loadingAvailability && (serviceType === 'containers' || serviceType === 'excavators') && (
                <p className="text-sm text-red-600 mt-1">
                  No available time slots for this equipment on the selected date. Please choose a different date.
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Please provide any additional details about your order, special requirements, or delivery instructions..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
