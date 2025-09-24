'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getAllOrders, updateOrderStatus } from '@/lib/orders'
import { Order } from '@/types/order'
import Image from 'next/image'
import EquipmentSchedule from '@/components/EquipmentSchedule'

export default function AdminDashboard() {
  const { isAuthenticated, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | Order['status']>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showEquipmentSchedule, setShowEquipmentSchedule] = useState(false)
  const [processingOrder, setProcessingOrder] = useState<Order | null>(null)
  const [endTime, setEndTime] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [reservationType, setReservationType] = useState<'time' | 'days' | 'weeks' | 'months'>('time')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getAllOrders()
      setOrders(fetchedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      ))
      setSelectedOrder(null)
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleProcessOrder = async () => {
    if (!processingOrder) return

    try {
      // Calculate end time/date based on reservation type
      let finalEndTime: string | undefined
      let finalEndDate: Date | undefined

      if (reservationType === 'time') {
        finalEndTime = endTime
      } else {
        finalEndDate = new Date(endDate)
      }

      // Update order with processing details
      await updateOrderStatus(
        processingOrder.id, 
        'in_progress',
        finalEndTime,
        finalEndDate,
        reservationType
      )

      // Update local state
      setOrders(orders.map(order => 
        order.id === processingOrder.id 
          ? { 
              ...order, 
              status: 'in_progress' as const,
              endTime: finalEndTime,
              endDate: finalEndDate,
              reservationType,
              updatedAt: new Date() 
            }
          : order
      ))

      // Reset modal state
      setProcessingOrder(null)
      setEndTime('')
      setEndDate('')
      setReservationType('time')
    } catch (error) {
      console.error('Error processing order:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/admin')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'completed': return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusBgColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 border-yellow-200'
      case 'in_progress': return 'bg-blue-50 border-blue-200'
      case 'completed': return 'bg-green-50 border-green-200'
      case 'cancelled': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const formatDateTime = (date: Date, time: string) => {
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
    return `${dateStr} at ${time}`
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Header */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 sm:py-4">
            {/* Logo and Actions on same line */}
            <div className="flex justify-between items-center mb-2">
              <Image 
                src="/logo.svg" 
                alt="MARPRO" 
                width={60}
                height={60}
                className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] lg:w-[100px] lg:h-[100px]"
              />
              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:inline text-sm lg:text-base text-gray-600">Welcome, Admin</span>
                <button
                  onClick={() => setShowEquipmentSchedule(true)}
                  className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                >
                  Schedule
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
            {/* Title below logo */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-2">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/95 backdrop-blur-[10px] rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-[10px] rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-[10px] rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">In Progress</h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-[10px] rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-[10px] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'in_progress'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors col-span-2 sm:col-auto ${
                filter === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className={`bg-gradient-card border-2 border-gray-e0e rounded-[15px] cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:bg-gradient-card-hover hover:border-gray-ccc ${getStatusBgColor(order.status)}`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="p-3 sm:p-4">
                {/* Header with Status Badge */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-gray-333 uppercase tracking-[0.3px] sm:tracking-[0.5px] truncate">
                      {order.firstName} {order.lastName}
                    </h3>
                  </div>
                  <span className={`inline-flex px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full border ${getStatusColor(order.status)} ml-2 flex-shrink-0`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Contact Info - More Compact on Mobile */}
                <div className="mb-2 text-[11px] sm:text-xs text-gray-666">
                  <p className="truncate">{order.phone}</p>
                  <p className="truncate">{order.email}</p>
                  {order.address && (
                    <p className="truncate font-medium text-gray-555">
                      📍 {order.address}{order.city ? `, ${order.city}` : ''}
                    </p>
                  )}
                </div>

                {/* Order Type - Compact Version */}
                <div className="bg-white/60 rounded-[8px] p-2 sm:p-3 mb-2 sm:mb-3">
                  <div className="text-[11px] sm:text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-555">Service:</span>
                      <span className="font-medium text-gray-333 capitalize">{order.serviceType}</span>
                    </div>
                    
                    {order.containerType && (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="font-semibold text-gray-555">Type:</span>
                        <span className="font-medium text-gray-333">{order.containerType}</span>
                      </div>
                    )}
                    
                    {order.excavatorType && (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="font-semibold text-gray-555">Type:</span>
                        <span className="font-medium text-gray-333">{order.excavatorType}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-1 mt-1 border-t border-gray-e0e">
                      <span className="font-semibold text-gray-555">Time:</span>
                      <span className="font-medium text-gray-333">{order.time}</span>
                    </div>
                    
                    {order.endTime && order.status === 'in_progress' && (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="font-semibold text-gray-555">End:</span>
                        <span className="font-medium text-blue-600">
                          {order.reservationType === 'time' ? order.endTime : 
                           order.endDate ? order.endDate.toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Compact for Mobile */}
                <div className="flex gap-1">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setProcessingOrder(order)
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 py-1 sm:py-1.5 rounded-[6px] sm:rounded-[8px] text-[10px] sm:text-xs font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                      >
                        Process
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusUpdate(order.id, 'cancelled')
                        }}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-2 py-1 sm:py-1.5 rounded-[6px] sm:rounded-[8px] text-[10px] sm:text-xs font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'in_progress' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusUpdate(order.id, 'completed')
                        }}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-2 py-1 sm:py-1.5 rounded-[6px] sm:rounded-[8px] text-[10px] sm:text-xs font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300"
                      >
                        Complete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusUpdate(order.id, 'cancelled')
                        }}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-2 py-1 sm:py-1.5 rounded-[6px] sm:rounded-[8px] text-[10px] sm:text-xs font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {(order.status === 'completed' || order.status === 'cancelled') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedOrder(order)
                      }}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-2 py-1 sm:py-1.5 rounded-[6px] sm:rounded-[8px] text-[10px] sm:text-xs font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                    >
                      View Details
                    </button>
                  )}
                </div>

                {/* Order Date - Compact */}
                <div className="text-[10px] sm:text-xs text-gray-555 text-center mt-1.5 sm:mt-2 font-medium">
                  {order.orderDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="bg-white/95 backdrop-blur-[10px] rounded-lg p-12 text-center">
            <p className="text-gray-500">No orders found with the selected filter.</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-gradient-card border-2 border-gray-e0e rounded-[15px] sm:rounded-[20px] max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-[0_25px_50px_rgba(0,0,0,0.15)]">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-333 uppercase tracking-[0.5px] sm:tracking-[1px]">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-555 hover:text-gray-333 text-lg sm:text-xl font-bold transition-colors duration-300 hover:scale-110 transform"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Customer & Order Information Combined */}
                <div className="bg-white/70 rounded-[12px] sm:rounded-[15px] p-3 sm:p-4 border border-gray-e0e">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-333 mb-2 sm:mb-3 uppercase tracking-[0.3px] sm:tracking-[0.5px] border-b border-gray-e0e pb-1">Customer</h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase">Name:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-333">{selectedOrder.firstName} {selectedOrder.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase">Phone:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-333">{selectedOrder.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase">Email:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-333 truncate ml-2">{selectedOrder.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase">Address:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-333 truncate ml-2">
                            {selectedOrder.address}{selectedOrder.city ? `, ${selectedOrder.city}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Info */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-333 mb-2 sm:mb-3 uppercase tracking-[0.3px] sm:tracking-[0.5px] border-b border-gray-e0e pb-1">Service</h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase">Type:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-333 capitalize">{selectedOrder.serviceType}</span>
                        </div>
                        {selectedOrder.containerType && (
                          <div className="flex justify-between">
                            <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase">Container:</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-333">{selectedOrder.containerType}</span>
                          </div>
                        )}
                        {selectedOrder.excavatorType && (
                          <div className="flex justify-between">
                            <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase">Excavator:</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-333">{selectedOrder.excavatorType}</span>
                          </div>
                        )}
                        {selectedOrder.constructionType && (
                          <div className="flex justify-between">
                            <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase">Construction:</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-333">{selectedOrder.constructionType}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase">Scheduled:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-333">{formatDateTime(selectedOrder.orderDate, selectedOrder.time)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Message & Status Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {selectedOrder.message && (
                    <div className="bg-white/60 rounded-[10px] sm:rounded-[12px] p-3 sm:p-4 border border-gray-e0e">
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase tracking-[0.3px] sm:tracking-[0.5px] block mb-1.5 sm:mb-2">Message:</span>
                      <p className="text-xs sm:text-sm text-gray-666 italic">{selectedOrder.message}</p>
                    </div>
                  )}
                  
                  <div className="bg-white/60 rounded-[10px] sm:rounded-[12px] p-3 sm:p-4 border border-gray-e0e">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-555 uppercase">Status:</span>
                      <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-1 text-[10px] sm:text-xs text-gray-555">
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{selectedOrder.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Updated:</span>
                        <span>{selectedOrder.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status Update Actions */}
                <div className="bg-white/70 rounded-[12px] sm:rounded-[15px] p-3 sm:p-4 border border-gray-e0e">
                  <h3 className="text-sm sm:text-base font-bold text-gray-333 mb-2 sm:mb-3 uppercase tracking-[0.3px] sm:tracking-[0.5px] border-b border-gray-e0e pb-1">Update Status</h3>
                  <div className="grid grid-cols-2 sm:flex gap-2 sm:flex-wrap">
                    {['pending', 'in_progress', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status as Order['status'])}
                        className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-[8px] sm:rounded-[10px] text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                          selectedOrder.status === status
                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]'
                            : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5'
                        }`}
                      >
                        {status.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Order Modal */}
      {processingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-gradient-card border-2 border-gray-e0e rounded-[15px] sm:rounded-[20px] max-w-md w-full shadow-[0_25px_50px_rgba(0,0,0,0.15)]">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-333 uppercase tracking-[0.5px] sm:tracking-[1px]">Process Order</h2>
                <button
                  onClick={() => setProcessingOrder(null)}
                  className="text-gray-555 hover:text-gray-333 text-lg sm:text-xl font-bold transition-colors duration-300 hover:scale-110 transform"
                >
                  ✕
                </button>
              </div>
              
              {/* Order Info */}
              <div className="bg-white/70 rounded-[12px] sm:rounded-[15px] p-3 sm:p-4 border border-gray-e0e mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-bold text-gray-333 mb-1.5 sm:mb-2 uppercase tracking-[0.3px] sm:tracking-[0.5px]">
                  {processingOrder.firstName} {processingOrder.lastName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-666">
                  Service: {processingOrder.serviceType}
                  {processingOrder.containerType && ` - ${processingOrder.containerType}`}
                  {processingOrder.excavatorType && ` - ${processingOrder.excavatorType}`}
                  {processingOrder.constructionType && ` - ${processingOrder.constructionType}`}
                </p>
              </div>
              
              <div className="bg-white/70 rounded-[15px] p-4 border border-gray-e0e">
                <label className="block text-sm font-semibold text-gray-555 uppercase mb-2">
                  Reservation Type
                </label>
                <select
                  value={reservationType}
                  onChange={(e) => setReservationType(e.target.value as 'time' | 'days' | 'weeks' | 'months')}
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2.5 sm:mb-3"
                >
                  <option value="time">Specific Time</option>
                  <option value="days">Full Day(s)</option>
                  <option value="weeks">Full Week(s)</option>
                  <option value="months">Full Month(s)</option>
                </select>
                
                {reservationType === 'time' && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-555 uppercase mb-1.5 sm:mb-2">
                      End Time (starts at {processingOrder?.time})
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      min={processingOrder?.time}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}
                
                {reservationType !== 'time' && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-555 uppercase mb-1.5 sm:mb-2">
                      End Date (reserved until 11:59 PM)
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      min={processingOrder?.orderDate.toISOString().split('T')[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}
                
                <p className="text-[10px] sm:text-xs text-gray-555 mt-1.5 sm:mt-2">
                  {reservationType === 'time' 
                    ? `Equipment reserved from ${processingOrder?.time} to ${endTime}`
                    : `Equipment reserved until ${endDate ? new Date(endDate).toLocaleDateString() : 'selected date'} at 11:59 PM`
                  }
                </p>
              </div>
              
              <div className="flex gap-2 mt-3 sm:mt-4">
                <button
                  onClick={() => setProcessingOrder(null)}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-[8px] sm:rounded-[10px] text-xs sm:text-sm font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessOrder}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-[8px] sm:rounded-[10px] text-xs sm:text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                >
                  Process Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Schedule Modal */}
      {showEquipmentSchedule && (
        <EquipmentSchedule onClose={() => setShowEquipmentSchedule(false)} />
      )}
    </div>
  )
}
