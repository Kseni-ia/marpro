'use client'

import React, { useState, useEffect } from 'react'
import { getAllWorkApplications, deleteWorkApplication, WorkApplication } from '@/lib/workApplications'
import { Trash2, Eye } from 'lucide-react'
import ApplicationDetailsModal from './ApplicationDetailsModal'

export default function ApplicationsList() {
  const [applications, setApplications] = useState<WorkApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<WorkApplication | null>(null)
  const [filter, setFilter] = useState<'all' | WorkApplication['status']>('all')

  const fetchApplications = async () => {
    setLoading(true)
    try {
      console.log('Fetching work applications...')
      const data = await getAllWorkApplications()
      console.log('Received data:', data)
      setApplications(data)
    } catch (error) {
      console.error('Error in fetchApplications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleDelete = async (applicationId: string, name: string) => {
    if (confirm(`Are you sure you want to delete the application from ${name}?`)) {
      try {
        await deleteWorkApplication(applicationId)
        await fetchApplications()
      } catch (error) {
        console.error('Error deleting application:', error)
        alert('Failed to delete application')
      }
    }
  }

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  const getStatusColor = (status: WorkApplication['status']) => {
    switch (status) {
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

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'containers':
        return 'bg-red-950/40 text-red-400 border-red-900/50'
      case 'excavators':
        return 'bg-yellow-950/40 text-yellow-400 border-yellow-900/50'
      case 'constructions':
        return 'bg-blue-950/40 text-blue-400 border-blue-900/50'
      default:
        return 'bg-gray-950/40 text-gray-400 border-gray-900/50'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-dark-textSecondary">Loading applications...</div>
      </div>
    )
  }

  return (
    <>
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdate={fetchApplications}
        />
      )}

      {/* Filters */}
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                : 'bg-gray-dark-bg text-gray-dark-textSecondary hover:bg-gray-dark-accent border border-gray-dark-border'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              filter === 'new'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-dark-bg text-gray-dark-textSecondary hover:bg-gray-dark-accent border border-gray-dark-border'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              filter === 'reviewed'
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'bg-gray-dark-bg text-gray-dark-textSecondary hover:bg-gray-dark-accent border border-gray-dark-border'
            }`}
          >
            Reviewed
          </button>
          <button
            onClick={() => setFilter('contacted')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              filter === 'contacted'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-dark-bg text-gray-dark-textSecondary hover:bg-gray-dark-accent border border-gray-dark-border'
            }`}
          >
            Contacted
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              filter === 'archived'
                ? 'bg-gray-600 text-white shadow-lg'
                : 'bg-gray-dark-bg text-gray-dark-textSecondary hover:bg-gray-dark-accent border border-gray-dark-border'
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-lg overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center text-gray-dark-textSecondary">
            No applications found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-dark-border bg-gray-dark-bg/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-dark-text uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-dark-text uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-dark-text uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-dark-text uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-dark-text uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-dark-text uppercase">Date</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-dark-text uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-dark-border hover:bg-gray-dark-bg/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-dark-text font-medium">
                      {app.firstName} {app.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-dark-textSecondary">
                      {app.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-dark-textSecondary">
                      {app.phone}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getServiceTypeColor(app.serviceType)}`}>
                        {app.serviceType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-dark-textSecondary">
                      {app.createdAt.toLocaleDateString('cs-CZ')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="p-2 bg-blue-950/40 text-blue-400 hover:bg-blue-900/60 border border-blue-900/50 hover:border-blue-600 rounded-lg transition-all duration-300 flex items-center justify-center"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id, `${app.firstName} ${app.lastName}`)}
                          className="p-2 bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-900/50 hover:border-red-600 rounded-lg transition-all duration-300 flex items-center justify-center"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
