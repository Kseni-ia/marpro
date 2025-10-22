'use client'

import React, { useState, useEffect, useRef } from 'react'

interface TimeReelPickerProps {
  label: string
  date: Date
  value: string
  onChange: (time: string) => void
  onEndTimeChange?: (time: string) => void
  minTime?: string
  maxTime?: string
  disabled?: boolean
  error?: boolean
  isEndTime?: boolean
  startTime?: string
  serviceType?: 'containers' | 'excavators' | 'constructions'
}

interface TimeSlot {
  time: string
  displayTime: string
  available: boolean
  isPast?: boolean
}

export default function TimeReelPicker({ 
  label, 
  date,
  value, 
  onChange,
  onEndTimeChange,
  minTime = '06:00',
  maxTime = '20:00',
  disabled = false,
  error = false,
  isEndTime = false,
  startTime,
  serviceType = 'containers'
}: TimeReelPickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [availableSlots, setAvailableSlots] = useState<Array<{start: string, end: string, displayTime: string}>>([])

  // Generate time slots
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = []
    const [minHours, minMinutes] = minTime.split(':').map(Number)
    const [maxHours, maxMinutes] = maxTime.split(':').map(Number)
    
    const startMinutes = minHours * 60 + minMinutes
    const endMinutes = maxHours * 60 + maxMinutes
    
    // Generate 30-minute intervals
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
      
      slots.push({
        time: timeString,
        displayTime: timeString,
        available: true,
        isPast: false
      })
    }
    
    return slots
  }

  // Check calendar connection status
  const checkCalendarStatus = async () => {
    try {
      const response = await fetch('/api/calendar-status')
      const data = await response.json()
      setCalendarConnected(data.connected)
    } catch (error) {
      console.error('Failed to check calendar status:', error)
      setCalendarConnected(false)
    }
  }

  // Fetch available slots from Google Calendar
  const fetchAvailableSlots = async () => {
    if (!date) return
    
    setLoading(true)
    try {
      const dateStr = formatDateForAPI(date)
      
      // Determine the correct API endpoint based on service type
      const getAvailableSlotsEndpoint = (serviceType: string) => {
        switch (serviceType) {
          case 'containers':
            return `/api/available-slots-containers?date=${dateStr}`
          case 'excavators':
            return `/api/available-slots-excavators?date=${dateStr}`
          case 'constructions':
            return `/api/available-slots-constructions?date=${dateStr}`
          default:
            return `/api/available-slots?date=${dateStr}&startHour=6&endHour=20&slotDuration=0.5&serviceType=${serviceType}`
        }
      }

      const apiEndpoint = getAvailableSlotsEndpoint(serviceType)
      const response = await fetch(apiEndpoint)
      const data = await response.json()
      
      if (data.success) {
        // Use availableSlots from the API response
        const slotsData = data.availableSlots
        console.log(`TimeReelPicker: Received ${slotsData?.length} slots for ${serviceType}:`, slotsData?.slice(0, 5))
        setAvailableSlots(data.availableSlots)
        
        // Update time slots with availability
        const slots = generateTimeSlots()
        const updatedSlots = slots.map(slot => {
          // Find the matching slot from API response
          const apiSlot = slotsData.find((s: any) => s.displayTime === slot.time)
          
          // If API provides availability status, use it
          let isAvailable = apiSlot ? apiSlot.available : true
          
          // For end time picker, also check if time is before start time
          if (isEndTime && startTime) {
            isAvailable = isAvailable && slot.time > startTime
          }
          
          // Check if time is in the past (already handled by API for today)
          const now = new Date()
          const isToday = date.toDateString() === now.toDateString()
          let isPast = false
          
          if (isToday && isAvailable) {
            const [hours, minutes] = slot.time.split(':').map(Number)
            const slotDate = new Date(date)
            slotDate.setHours(hours, minutes, 0, 0)
            isPast = slotDate <= now
            if (isPast) isAvailable = false
          }
          
          return {
            ...slot,
            available: isAvailable,
            isPast
          }
        })
        
        setTimeSlots(updatedSlots)
      } else {
        // If calendar fetch fails, show all slots as available
        const slots = generateTimeSlots()
        setTimeSlots(slots)
      }
    } catch (error) {
      console.error('Error fetching available slots:', error)
      // Fallback to all slots available
      const slots = generateTimeSlots()
      setTimeSlots(slots)
    } finally {
      setLoading(false)
    }
  }

  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Initialize on mount and when dependencies change
  useEffect(() => {
    checkCalendarStatus()
  }, [])

  useEffect(() => {
    fetchAvailableSlots()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, startTime])

  useEffect(() => {
    if (value) {
      setSelectedTime(value)
      // Scroll to selected time after a short delay
      setTimeout(() => scrollToTime(value), 100)
    }
  }, [value])

  const scrollToTime = (time: string) => {
    if (!scrollRef.current) return
    
    const container = scrollRef.current
    const buttons = container.querySelectorAll('button')
    
    buttons.forEach((button) => {
      if (button.getAttribute('data-time') === time) {
        const containerRect = container.getBoundingClientRect()
        const buttonRect = button.getBoundingClientRect()
        const scrollLeft = button.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2)
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        })
      }
    })
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onChange(time)
    
    // Auto-select end time 1 hour later if possible for start time
    if (!isEndTime && onEndTimeChange) {
      const [hours, minutes] = time.split(':').map(Number)
      const endHours = hours + 1
      if (endHours <= 20) {
        const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        onEndTimeChange(endTime)
      }
    }
  }

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-dark-textSecondary uppercase tracking-wider mb-2">
        {label} {calendarConnected && (
          <span className="text-green-500 text-[10px] normal-case ml-1 opacity-80">
            ● Connected
          </span>
        )}
      </label>
      
      {loading ? (
        <div className="w-full px-3 py-4 rounded-lg bg-gradient-card-dark border border-gray-dark-border text-gray-dark-textSecondary text-center text-sm">
          Loading times...
        </div>
      ) : (
        <div className={`
          p-3 rounded-lg bg-gradient-card-dark/80 backdrop-blur-sm 
          border ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gray-dark-border'}
          shadow-[0_2px_8px_rgba(0,0,0,0.2)]
        `}>
          {/* Scrollable reel container */}
          <div className="relative">
            {/* Gradient overlays for scroll indication */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-dark-bg to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-dark-bg to-transparent z-10 pointer-events-none" />
            
            {/* Center indicator */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-red-500/30 transform -translate-x-1/2 z-20 pointer-events-none" />
            
            {/* Scrollable time reel */}
            <div 
              ref={scrollRef}
              className="overflow-x-auto overflow-y-hidden flex items-center gap-2 py-3 px-12 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              } as React.CSSProperties}
            >
              {timeSlots.map((slot) => {
                const isSelected = slot.time === selectedTime
                const isDisabled = !slot.available || disabled
                
                return (
                  <button
                    key={slot.time}
                    data-time={slot.time}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && handleTimeSelect(slot.time)}
                    className={`
                      flex-shrink-0 px-4 py-3 rounded-lg font-mono text-sm transition-all duration-200
                      ${isDisabled 
                        ? 'bg-gray-900/60 text-gray-600/40 cursor-not-allowed' 
                        : isSelected
                        ? 'bg-gradient-to-r from-red-600 to-red-500 text-white font-bold shadow-[0_4px_12px_rgba(239,68,68,0.5)] scale-110 ring-2 ring-red-400/50'
                        : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/80 hover:text-gray-300 hover:scale-105'
                      }
                      min-w-[80px]
                    `}
                    title={isDisabled ? (slot.isPast ? 'Past time' : 'Not available') : slot.displayTime}
                  >
                    <span className="block">{slot.displayTime}</span>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Selected time display */}
          {value && (
            <div className="mt-3 pt-3 border-t border-gray-dark-border/30 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-dark-textSecondary">
                  {isEndTime ? 'End:' : 'Start:'}
                </span>
                <span className="font-mono font-bold text-lg text-red-500">
                  {value}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Hide scrollbar CSS
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

// Add styles to document if not already present
if (typeof document !== 'undefined' && !document.getElementById('scrollbar-hide-styles')) {
  const style = document.createElement('style')
  style.id = 'scrollbar-hide-styles'
  style.innerHTML = scrollbarHideStyles
  document.head.appendChild(style)
}
