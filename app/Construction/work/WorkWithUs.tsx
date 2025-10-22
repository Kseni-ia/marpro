'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface WorkApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  expertise: string;
  experience: string;
  message: string;
}

// We'll use the main language system instead of local translations

export default function WorkWithUs() {
  const { t } = useLanguage();
  
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<WorkApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    expertise: '',
    experience: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormStatus({ type: null, message: '' });

    try {
      // Save application to Firestore
      await addDoc(collection(db, 'workApplications'), {
        ...formData,
        submittedAt: serverTimestamp(),
        status: 'pending'
      });

      setFormStatus({ type: 'success', message: t('work.success') });
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          expertise: '',
          experience: '',
          message: ''
        });
        setShowForm(false);
        setFormStatus({ type: null, message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting work application:', error);
      setFormStatus({ type: 'error', message: t('work.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Work with us button - positioned under order button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setShowForm(true)}
          className="rounded-[14px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] hover:from-red-600 hover:to-red-500 hover:text-white transition-all text-base sm:text-lg hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <span className="text-xl">💼</span>
          <span>{t('work.buttonText')}</span>
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          
          {/* Form Container */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4">
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white mb-1">{t('work.formTitle')}</h2>
                <p className="text-gray-400 text-xs">{t('work.subtitle')}</p>
              </div>

              {/* Status Messages */}
              {formStatus.type && (
                <div
                  className={`mb-3 p-2 rounded-lg text-sm ${
                    formStatus.type === 'success'
                      ? 'bg-green-900/50 text-green-300 border border-green-500'
                      : 'bg-red-900/50 text-red-300 border border-red-500'
                  }`}
                >
                  {formStatus.message}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* First Name and Last Name - 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-[0.3px] mb-1">{t('work.firstName')} *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-2 py-1.5 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-[0.3px] mb-1">{t('work.lastName')} *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-2 py-1.5 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Email and Phone - 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-[0.3px] mb-1">{t('work.email')} *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-2 py-1.5 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-[0.3px] mb-1">{t('work.phone')} *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-2 py-1.5 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Expertise and Experience - 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-[0.3px] mb-1">{t('work.expertise')} *</label>
                    <select
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      required
                      className="w-full px-2 py-1.5 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                    >
                      <option value="">Select...</option>
                      <option value="demolition">{t('work.expertise.demolition')}</option>
                      <option value="construction">{t('work.expertise.construction')}</option>
                      <option value="operator">{t('work.expertise.operator')}</option>
                      <option value="safety">{t('work.expertise.safety')}</option>
                      <option value="management">{t('work.expertise.management')}</option>
                      <option value="other">{t('work.expertise.other')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-[0.3px] mb-1">{t('work.experience')} *</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 5"
                      className="w-full px-2 py-1.5 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Message - Full width */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-[0.3px] mb-1">{t('work.message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-1.5 px-3 text-sm rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('work.sending') : t('work.submit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-700 text-white py-1.5 px-3 text-sm rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    {t('work.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
