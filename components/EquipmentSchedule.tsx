'use client'

import React, { useState, useEffect } from 'react'
import { getEquipmentBookings, updateEquipmentBookingStatus } from '@/lib/equipment'
import { EquipmentBooking } from '@/types/order'

interface EquipmentScheduleProps {
  onClose: () => void
}

export default function EquipmentSchedule({ onClose }: EquipmentScheduleProps) {
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
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'completed': return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Equipment Schedule Management</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Type
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Equipment</option>
                  <option value="containers">Containers</option>
                  <option value="excavators">Excavators</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading bookings...</div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No bookings found for the selected filters.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-gradient-card border-2 border-gray-200 rounded-[15px] p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                    {/* Equipment Info */}
                    <div>
                      <div className="font-semibold text-gray-800 capitalize">
                        {booking.equipmentType}: {booking.equipmentId}
                      </div>
                      <div className="text-sm text-gray-600">
                        Order ID: {booking.orderId.slice(-8)}
                      </div>
                    </div>

                    {/* Time Info */}
                    <div>
                      <div className="font-medium text-gray-700">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {booking.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status !== 'active' && (
                        <span className="text-sm text-gray-500">
                          {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                      )}
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <strong>Notes:</strong> {booking.notes}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Equipment Schedule Management</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Equipment is booked with specific start and end times</li>
              <li>• Completed or cancelled bookings free up the time slot for new orders</li>
              <li>• Changes take effect immediately and update customer availability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
