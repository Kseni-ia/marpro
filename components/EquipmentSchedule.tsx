'use client'

import React, { useState, useEffect } from 'react'
import { getEquipmentBookings, updateEquipmentBookingStatus } from '@/lib/equipment'
import { EquipmentBooking } from '@/types/order'
import { useLanguage } from '@/contexts/LanguageContext'

interface EquipmentScheduleProps {
  onClose: () => void
}

export default function EquipmentSchedule({ onClose }: EquipmentScheduleProps) {
  const { t } = useLanguage()
  const [bookings, setBookings] = useState<EquipmentBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'containers' | 'excavators'>('all')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchBookings()
  }, [filter, selectedDate])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const date = new Date(selectedDate)
      const equipmentType = filter === 'all' ? undefined : filter as 'containers' | 'excavators'
      const fetchedBookings = await getEquipmentBookings(equipmentType, undefined, date)
      setBookings(fetchedBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, status: EquipmentBooking['status']) => {
    try {
      await updateEquipmentBookingStatus(bookingId, status)
      fetchBookings()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour24 = parseInt(hours)
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
    const ampm = hour24 >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${ampm}`
  }

  const getStatusColor = (status: EquipmentBooking['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-900/20 text-blue-400 border-blue-400/30'
      case 'completed': return 'bg-green-900/20 text-green-400 border-green-400/30'
      case 'cancelled': return 'bg-red-900/20 text-red-400 border-red-400/30'
      default: return 'bg-gray-800/20 text-gray-400 border-gray-400/30'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-[0_25px_50px_rgba(0,0,0,0.4)]">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-dark-text uppercase tracking-wider">{t('admin.equipmentSchedule')}</h2>
            <button
              onClick={onClose}
              className="text-gray-dark-textSecondary hover:text-gray-dark-text text-2xl font-bold transition-colors duration-300 hover:scale-110 transform"
            >
              ×
            </button>
          </div>

          {/* Filters */}
          <div className="bg-gray-dark-bg/70 rounded-lg p-4 mb-6 border border-gray-dark-border backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-dark-textSecondary mb-2 uppercase tracking-wider">
                  {t('admin.equipmentType')}
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-dark-bg border border-gray-dark-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-dark-text"
                >
                  <option value="all">{t('admin.allEquipment')}</option>
                  <option value="containers">Containers</option>
                  <option value="excavators">Excavators</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-dark-textSecondary mb-2 uppercase tracking-wider">
                  {t('admin.date')}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-dark-bg border border-gray-dark-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-dark-text"
                />
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-dark-textSecondary">{t('admin.loadingBookings')}</div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-dark-textSecondary">{t('admin.noBookingsFound')}</div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] p-4 relative overflow-hidden group hover:bg-gradient-card-hover-dark transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  <div className="absolute top-0 -left-full w-full h-full transition-all duration-500 pointer-events-none group-hover:left-full bg-gradient-shine-dark"></div>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center relative z-10">
                    {/* Equipment Info */}
                    <div>
                      <div className="font-semibold text-gray-dark-text uppercase tracking-wider">
                        {booking.equipmentType}: {booking.equipmentId}
                      </div>
                      <div className="text-sm text-gray-dark-textSecondary">
                        {t('admin.orderId')}: {booking.orderId.slice(-8)}
                      </div>
                    </div>

                    {/* Time Info */}
                    <div>
                      <div className="font-medium text-gray-dark-text">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(booking.status)} backdrop-blur-sm`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {booking.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded text-xs hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all"
                          >
                            {t('admin.complete')}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded text-xs hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all"
                          >
                            {t('admin.cancelBooking')}
                          </button>
                        </>
                      )}
                      {booking.status !== 'active' && (
                        <span className="text-sm text-gray-dark-textSecondary">
                          {booking.status === 'completed' ? t('admin.completedStatus') : t('admin.cancelledStatus')}
                        </span>
                      )}
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-dark-border/50 relative z-10">
                      <div className="text-sm text-gray-dark-textSecondary">
                        <strong>{t('admin.notes')}:</strong> {booking.notes}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="font-semibold text-blue-400 mb-2 uppercase tracking-wider">{t('admin.equipmentScheduleInfo')}</h3>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>{t('admin.equipmentInfo1')}</li>
              <li>{t('admin.equipmentInfo2')}</li>
              <li>{t('admin.equipmentInfo3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
