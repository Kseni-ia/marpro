'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getAllOrders, updateOrderStatus } from '@/lib/orders'
import { Order } from '@/types/order'
import Image from 'next/image'
import EquipmentSchedule from '@/components/EquipmentSchedule'
import NavigationBar from '@/app/admin/NavigationBar'

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
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

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
      
      // Automatically send completion email when order is marked as completed
      if (newStatus === 'completed') {
        console.log('📧 Order marked as completed, sending completion email...')
        try {
          const response = await fetch('/api/send-completion-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
          })
          
          const data = await response.json()
          
          if (data.success) {
            console.log('✅ Completion email sent successfully to customer!')
            alert('✅ Order completed and customer notified via email!')
          } else {
            console.error('❌ Failed to send completion email:', data.error)
            alert('⚠️ Order completed but email failed to send: ' + data.error)
          }
        } catch (emailError) {
          console.error('❌ Error sending completion email:', emailError)
          alert('⚠️ Order completed but email system encountered an error.')
        }
      }
      
      setSelectedOrder(null)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('❌ Failed to update order status')
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
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }


  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/30'
      case 'in_progress': return 'bg-blue-900/20 text-blue-400 border-blue-400/30'
      case 'completed': return 'bg-green-900/20 text-green-400 border-green-400/30'
      case 'cancelled': return 'bg-red-900/20 text-red-400 border-red-400/30'
      default: return 'bg-gray-800/20 text-gray-400 border-gray-400/30'
    }
  }

  const getStatusBgColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return ''
      case 'in_progress': return ''
      case 'completed': return ''
      case 'cancelled': return ''
      default: return ''
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
      <div className="min-h-screen bg-gradient-main-dark flex items-center justify-center">
        <div className="text-gray-dark-text text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-main-dark relative">
      {/* Logo Container - Same as main page */}
      <div className="absolute top-0 left-0 sm:-top-8 sm:-left-5 z-10 pointer-events-none">
        <Image 
          src="/logo.svg" 
          alt="MARPRO" 
          width={250}
          height={200}
          className="h-[100px] sm:h-[120px] md:h-[150px] lg:h-[170px] w-auto transition-all duration-300 object-contain"
          style={{ objectPosition: 'left top' }}
        />
      </div>
      
      {/* Left Navigation Bar */}
      <NavigationBar 
        onScheduleClick={() => setShowEquipmentSchedule(true)}
        onLogout={handleLogout}
      />
      
      {/* Header */}
      <div className="relative md:ml-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 sm:py-4 pt-24 sm:pt-20 md:pt-28">
            {/* Title centered */}
            <div className="flex justify-center items-center">
              <h1 
                className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-dark-text uppercase tracking-wider border-2 border-red-500 rounded-2xl p-2 relative overflow-hidden transition-all duration-300"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100
                  setMousePosition({ x, y })
                }}
                onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
                style={{
                  boxShadow: `${mousePosition.x - 50}px ${mousePosition.y - 50}px 60px rgba(220, 38, 38, 0.6), 
                              ${(mousePosition.x - 50) * 0.5}px ${(mousePosition.y - 50) * 0.5}px 40px rgba(220, 38, 38, 0.4),
                              0 0 20px rgba(220, 38, 38, 0.3)`
                }}
              >
                Admin Dashboard
                {/* Animated gradient overlay that follows mouse */}
                <div 
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(220, 38, 38, 0.3) 0%, transparent 60%)`
                  }}
                />
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 md:ml-16">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-lg p-3 sm:p-4 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <h3 className="text-xs sm:text-sm font-medium text-gray-dark-textSecondary uppercase tracking-wider">Total Orders</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-dark-text">{orders.length}</p>
          </div>
          <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-lg p-3 sm:p-4 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <h3 className="text-xs sm:text-sm font-medium text-gray-dark-textSecondary uppercase tracking-wider">Pending</h3>
            <p className="text-xl sm:text-2xl font-bold text-yellow-400">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-lg p-3 sm:p-4 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <h3 className="text-xs sm:text-sm font-medium text-gray-dark-textSecondary uppercase tracking-wider">In Progress</h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-400">
              {orders.filter(o => o.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-lg p-3 sm:p-4 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <h3 className="text-xs sm:text-sm font-medium text-gray-dark-textSecondary uppercase tracking-wider">Completed</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-400">
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
        </div>


        {/* Filters */}
        <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  : 'bg-gray-dark-bg text-gray-dark-textSecondary hover:bg-gray-dark-accent border border-gray-dark-border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === 'pending'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  : 'bg-gray-dark-bg text-gray-dark-textSecondary hover:bg-gray-dark-accent border border-gray-dark-border'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === 'in_progress'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  : 'bg-gray-dark-bg text-gray-dark-textSecondary hover:bg-gray-dark-accent border border-gray-dark-border'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  : 'bg-gray-dark-bg text-gray-dark-textSecondary hover:bg-gray-dark-accent border border-gray-dark-border'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all col-span-2 sm:col-auto ${
                filter === 'cancelled'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  : 'bg-gray-dark-bg text-gray-dark-textSecondary hover:bg-gray-dark-accent border border-gray-dark-border'
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
              className={`bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark ${getStatusBgColor(order.status)}`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="p-3 sm:p-4">
                {/* Shine effect */}
                <div className="absolute top-0 -left-full w-full h-full transition-all duration-500 pointer-events-none group-hover:left-full bg-gradient-shine-dark"></div>
                {/* Header with Status Badge */}
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-gray-dark-text uppercase tracking-[0.3px] sm:tracking-[0.5px] truncate">
                      {order.firstName} {order.lastName}
                    </h3>
                  </div>
                  <span className={`inline-flex px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full border ${getStatusColor(order.status)} ml-2 flex-shrink-0 backdrop-blur-sm`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Contact Info - More Compact on Mobile */}
                <div className="mb-2 text-[11px] sm:text-xs text-gray-dark-textSecondary relative z-10">
                  <p className="truncate">{order.phone}</p>
                  <p className="truncate">{order.email}</p>
                  {order.address && (
                    <p className="truncate font-medium text-gray-dark-textMuted">
                      📍 {order.address}{order.city ? `, ${order.city}` : ''}
                    </p>
                  )}
                </div>

                {/* Order Type - Compact Version */}
                <div className="bg-gray-dark-bg/60 rounded-[8px] p-2 sm:p-3 mb-2 sm:mb-3 border border-gray-dark-border/50 relative z-10 backdrop-blur-sm">
                  <div className="text-[11px] sm:text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-dark-textSecondary">Service:</span>
                      <span className="font-medium text-gray-dark-text capitalize">{order.serviceType}</span>
                    </div>
                    
                    {order.containerType && (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="font-semibold text-gray-dark-textSecondary">Type:</span>
                        <span className="font-medium text-gray-dark-text">{order.containerType}</span>
                      </div>
                    )}
                    
                    {order.excavatorType && (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="font-semibold text-gray-dark-textSecondary">Type:</span>
                        <span className="font-medium text-gray-dark-text">{order.excavatorType}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-1 mt-1 border-t border-gray-dark-border/50">
                      <span className="font-semibold text-gray-dark-textSecondary">Time:</span>
                      <span className="font-medium text-gray-dark-text">{order.time}</span>
                    </div>
                    
                    {order.endTime && order.status === 'in_progress' && (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="font-semibold text-gray-dark-textSecondary">End:</span>
                        <span className="font-medium text-blue-400">
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
                <div className="text-[10px] sm:text-xs text-gray-dark-textSecondary text-center mt-1.5 sm:mt-2 font-medium relative z-10">
                  {order.orderDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-lg p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <p className="text-gray-dark-textSecondary">No orders found with the selected filter.</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-[0_25px_50px_rgba(0,0,0,0.4)]">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-dark-text uppercase tracking-[0.5px] sm:tracking-[1px]">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-dark-textSecondary hover:text-gray-dark-text text-lg sm:text-xl font-bold transition-colors duration-300 hover:scale-110 transform"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Customer & Order Information Combined */}
                <div className="bg-gray-dark-bg/70 rounded-[12px] sm:rounded-[15px] p-3 sm:p-4 border border-gray-dark-border backdrop-blur-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-dark-text mb-2 sm:mb-3 uppercase tracking-[0.3px] sm:tracking-[0.5px] border-b border-gray-dark-border pb-1">Customer</h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase">Name:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-dark-text">{selectedOrder.firstName} {selectedOrder.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase">Phone:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-dark-text">{selectedOrder.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase">Email:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-dark-text truncate ml-2">{selectedOrder.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase">Address:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-dark-text truncate ml-2">
                            {selectedOrder.address}{selectedOrder.city ? `, ${selectedOrder.city}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Info */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-dark-text mb-2 sm:mb-3 uppercase tracking-[0.3px] sm:tracking-[0.5px] border-b border-gray-dark-border pb-1">Service</h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase">Type:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-dark-text capitalize">{selectedOrder.serviceType}</span>
                        </div>
                        {selectedOrder.containerType && (
                          <div className="flex justify-between">
                            <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase">Container:</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-dark-text">{selectedOrder.containerType}</span>
                          </div>
                        )}
                        {selectedOrder.excavatorType && (
                          <div className="flex justify-between">
                            <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase">Excavator:</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-dark-text">{selectedOrder.excavatorType}</span>
                          </div>
                        )}
                        {selectedOrder.constructionType && (
                          <div className="flex justify-between">
                            <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase">Construction:</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-dark-text">{selectedOrder.constructionType}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase">Scheduled:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-dark-text">{formatDateTime(selectedOrder.orderDate, selectedOrder.time)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Message & Status Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {selectedOrder.message && (
                    <div className="bg-gray-dark-bg/60 rounded-[10px] sm:rounded-[12px] p-3 sm:p-4 border border-gray-dark-border backdrop-blur-sm">
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase tracking-[0.3px] sm:tracking-[0.5px] block mb-1.5 sm:mb-2">Message:</span>
                      <p className="text-xs sm:text-sm text-gray-dark-textMuted italic">{selectedOrder.message}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-dark-bg/60 rounded-[10px] sm:rounded-[12px] p-3 sm:p-4 border border-gray-dark-border backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-dark-textSecondary uppercase">Status:</span>
                      <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-1 text-[10px] sm:text-xs text-gray-dark-textSecondary">
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
                <div className="bg-gray-dark-bg/70 rounded-[12px] sm:rounded-[15px] p-3 sm:p-4 border border-gray-dark-border backdrop-blur-sm">
                  <h3 className="text-sm sm:text-base font-bold text-gray-dark-text mb-2 sm:mb-3 uppercase tracking-[0.3px] sm:tracking-[0.5px] border-b border-gray-dark-border pb-1">Update Status</h3>
                  <div className="grid grid-cols-2 sm:flex gap-2 sm:flex-wrap">
                    {['pending', 'in_progress', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status as Order['status'])}
                        className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-[8px] sm:rounded-[10px] text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                          selectedOrder.status === status
                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]'
                            : 'bg-gray-dark-bg text-gray-dark-textSecondary border border-gray-dark-border hover:bg-gray-dark-accent hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5'
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] max-w-md w-full shadow-[0_25px_50px_rgba(0,0,0,0.4)]">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-dark-text uppercase tracking-[0.5px] sm:tracking-[1px]">Process Order</h2>
                <button
                  onClick={() => setProcessingOrder(null)}
                  className="text-gray-dark-textSecondary hover:text-gray-dark-text text-lg sm:text-xl font-bold transition-colors duration-300 hover:scale-110 transform"
                >
                  ✕
                </button>
              </div>
              
              {/* Order Info */}
              <div className="bg-gray-dark-bg/70 rounded-[12px] sm:rounded-[15px] p-3 sm:p-4 border border-gray-dark-border mb-3 sm:mb-4 backdrop-blur-sm">
                <h3 className="text-xs sm:text-sm font-bold text-gray-dark-text mb-1.5 sm:mb-2 uppercase tracking-[0.3px] sm:tracking-[0.5px]">
                  {processingOrder.firstName} {processingOrder.lastName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-dark-textSecondary">
                  Service: {processingOrder.serviceType}
                  {processingOrder.containerType && ` - ${processingOrder.containerType}`}
                  {processingOrder.excavatorType && ` - ${processingOrder.excavatorType}`}
                  {processingOrder.constructionType && ` - ${processingOrder.constructionType}`}
                </p>
              </div>
              
              <div className="bg-gray-dark-bg/70 rounded-[15px] p-4 border border-gray-dark-border backdrop-blur-sm">
                <label className="block text-sm font-semibold text-gray-dark-textSecondary uppercase mb-2">
                  Reservation Type
                </label>
                <select
                  value={reservationType}
                  onChange={(e) => setReservationType(e.target.value as 'time' | 'days' | 'weeks' | 'months')}
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-dark-bg border border-gray-dark-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-2.5 sm:mb-3 text-gray-dark-text"
                >
                  <option value="time">Specific Time</option>
                  <option value="days">Full Day(s)</option>
                  <option value="weeks">Full Week(s)</option>
                  <option value="months">Full Month(s)</option>
                </select>
                
                {reservationType === 'time' && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-dark-textSecondary uppercase mb-1.5 sm:mb-2">
                      End Time (starts at {processingOrder?.time})
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      min={processingOrder?.time}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-dark-bg border border-gray-dark-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-dark-text"
                    />
                  </div>
                )}
                
                {reservationType !== 'time' && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-dark-textSecondary uppercase mb-1.5 sm:mb-2">
                      End Date (reserved until 11:59 PM)
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      min={processingOrder?.orderDate.toISOString().split('T')[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-dark-bg border border-gray-dark-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-dark-text"
                    />
                  </div>
                )}
                
                <p className="text-[10px] sm:text-xs text-gray-dark-textSecondary mt-1.5 sm:mt-2">
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
