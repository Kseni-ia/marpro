'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useModal } from '@/contexts/ModalContext'

interface WorkApplicationFormProps {
  onClose: () => void
}

export default function WorkApplicationForm({ onClose }: WorkApplicationFormProps) {
  const { t } = useLanguage()
  const { openModal, closeModal } = useModal()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    expertise: '',
    experience: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  React.useEffect(() => {
    openModal()
    return () => closeModal()
  }, [openModal, closeModal])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-work-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(t('work.success'))
        onClose()
      } else {
        throw new Error('Failed to submit application')
      }
    } catch (error) {
      alert(t('work.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-dark-textSecondary hover:text-red-500 transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Form Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-dark-text mb-2">
            {t('work.formTitle')}
          </h2>
          <p className="text-gray-dark-textSecondary text-sm">
            {t('work.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-dark-text mb-1">
                {t('work.firstName')} *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-dark-text mb-1">
                {t('work.lastName')} *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-dark-text mb-1">
              {t('work.email')} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-dark-text mb-1">
              {t('work.phone')} *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-dark-text mb-1">
              {t('work.expertise')} *
            </label>
            <select
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 transition-colors duration-300"
            >
              <option value="">{t('work.expertise')}</option>
              <option value="demolition">{t('work.expertise.demolition')}</option>
              <option value="construction">{t('work.expertise.construction')}</option>
              <option value="operator">{t('work.expertise.operator')}</option>
              <option value="safety">{t('work.expertise.safety')}</option>
              <option value="management">{t('work.expertise.management')}</option>
              <option value="other">{t('work.expertise.other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-dark-text mb-1">
              {t('work.experience')} *
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder={t('work.experience')}
              required
              className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-dark-text mb-1">
              {t('work.message')} *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-3 py-2 bg-gray-dark-card border border-gray-dark-border rounded-lg text-gray-dark-text text-sm focus:outline-none focus:border-red-500 transition-colors duration-300 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-dark-card border border-gray-dark-border text-gray-dark-text rounded-lg hover:bg-gray-dark-border transition-all duration-300 text-sm font-medium"
            >
              {t('work.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('work.sending') : t('work.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
