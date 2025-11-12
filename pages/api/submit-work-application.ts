import { NextApiRequest, NextApiResponse } from 'next'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface WorkApplicationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  expertise: string
  experience: string
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { firstName, lastName, email, phone, expertise, experience, message }: WorkApplicationData = req.body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !expertise || !experience || !message) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Save to Firestore
    const workApplicationsRef = collection(db, 'workApplications')
    await addDoc(workApplicationsRef, {
      firstName,
      lastName,
      email,
      phone,
      expertise,
      experience,
      message,
      status: 'new',
      createdAt: serverTimestamp(),
      type: 'workApplication'
    })

    res.status(200).json({ message: 'Application submitted successfully' })
  } catch (error) {
    console.error('Error submitting work application:', error)
    res.status(500).json({ message: 'Failed to submit application' })
  }
}
