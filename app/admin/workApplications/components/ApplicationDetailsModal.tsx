'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { WorkApplication, updateApplicationStatus, updateApplicationNotes } from '@/lib/workApplications'

interface ApplicationDetailsModalProps {
  application: WorkApplication
  onClose: () => void
  onUpdate: () => void
}

export default function ApplicationDetailsModal({ application, onClose, onUpdate }: ApplicationDetailsModalProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<WorkApplication['status']>(application.status)
  const [notes, setNotes] = useState(application.notes || '')

  const handleStatusChange = async (newStatus: WorkApplication['status']) => {
    setLoading(true)
    try {
      await updateApplicationStatus(application.id, newStatus)
      setStatus(newStatus)
      onUpdate()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    setLoading(true)
    try {
      await updateApplicationNotes(application.id, notes)
      onUpdate()
      alert('Notes saved successfully')
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Failed to save notes')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (s: WorkApplication['status']) => {
    switch (s) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'reviewed':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'contacted':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-card-dark border-b border-gray-dark-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-dark-text">
            {application.firstName} {application.lastName}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-red-950/40 text-white hover:bg-red-900/60 flex items-center justify-center transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-dark-bg/50 p-3 rounded-lg">
              <label className="text-xs font-semibold text-gray-dark-textSecondary uppercase">Email</label>
              <p className="text-sm text-gray-dark-text mt-1">{application.email}</p>
            </div>
            <div className="bg-gray-dark-bg/50 p-3 rounded-lg">
              <label className="text-xs font-semibold text-gray-dark-textSecondary uppercase">Phone</label>
              <p className="text-sm text-gray-dark-text mt-1">{application.phone}</p>
            </div>
            <div className="bg-gray-dark-bg/50 p-3 rounded-lg">
              <label className="text-xs font-semibold text-gray-dark-textSecondary uppercase">Service Type</label>
              <p className="text-sm text-gray-dark-text mt-1 capitalize">{application.serviceType}</p>
            </div>
            <div className="bg-gray-dark-bg/50 p-3 rounded-lg">
              <label className="text-xs font-semibold text-gray-dark-textSecondary uppercase">Submitted</label>
              <p className="text-sm text-gray-dark-text mt-1">{application.createdAt.toLocaleDateString('cs-CZ')}</p>
            </div>
          </div>

          {/* Message */}
          {application.message && (
            <div className="bg-gray-dark-bg/50 p-3 rounded-lg">
              <label className="text-xs font-semibold text-gray-dark-textSecondary uppercase">Message</label>
              <p className="text-sm text-gray-dark-text mt-2">{application.message}</p>
            </div>
          )}

          {/* Status */}
          <div className="bg-gray-dark-bg/50 p-3 rounded-lg">
            <label className="text-xs font-semibold text-gray-dark-textSecondary uppercase mb-2 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {(['new', 'reviewed', 'contacted', 'archived'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    status === s
                      ? getStatusColor(s) + ' border'
                      : 'bg-gray-dark-bg border border-gray-dark-border text-gray-dark-textSecondary hover:border-gray-dark-border'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gray-dark-bg/50 p-3 rounded-lg">
            <label className="text-xs font-semibold text-gray-dark-textSecondary uppercase mb-2 block">Admin Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes about this application..."
              className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleSaveNotes}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-900/50 hover:border-red-600 rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Notes'}
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-800/40 text-gray-400 hover:bg-gray-700/60 border border-gray-700/50 hover:border-gray-600 rounded-lg transition-all duration-300 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
