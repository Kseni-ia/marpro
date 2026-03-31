import { ReferenceCategory } from '@/lib/constructions'

export type ReferenceDraft = {
  title: string
  description: string
  category: ReferenceCategory
  isActive: boolean
}

const STORAGE_KEY = 'admin:new-reference-draft'

export function loadReferenceDraft(): ReferenceDraft | null {
  if (typeof window === 'undefined') return null

  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Failed to load reference draft:', error)
    return null
  }
}

export function saveReferenceDraft(draft: ReferenceDraft) {
  if (typeof window === 'undefined') return

  const isEmpty =
    draft.title.trim() === '' &&
    draft.description.trim() === '' &&
    draft.category === 'demolice' &&
    draft.isActive

  try {
    if (isEmpty) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch (error) {
    console.error('Failed to save reference draft:', error)
  }
}

export function clearReferenceDraft() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
