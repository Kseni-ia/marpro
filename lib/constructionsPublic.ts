import 'server-only'

import { Reference, REFERENCE_CATEGORIES, type ReferenceCategory } from './constructions'

type FirestoreDocumentListResponse = {
  documents?: FirestoreDocument[]
}

type FirestoreDocument = {
  name: string
  fields?: Record<string, FirestoreValue>
}

type FirestoreValue = {
  arrayValue?: {
    values?: FirestoreValue[]
  }
  booleanValue?: boolean
  stringValue?: string
  timestampValue?: string
}

const FIRESTORE_REFERENCES_ENDPOINT =
  'https://firestore.googleapis.com/v1/projects/marpro-f492a/databases/(default)/documents/constructionsReferences'

const VALID_CATEGORIES = new Set<ReferenceCategory>(
  REFERENCE_CATEGORIES.map((category) => category.value)
)

const getDocumentId = (documentName: string) => documentName.split('/').pop() ?? documentName

const getStringValue = (value?: FirestoreValue) => value?.stringValue ?? ''

const getBooleanValue = (value?: FirestoreValue) => value?.booleanValue === true

const getTimestampValue = (value?: FirestoreValue) => value?.timestampValue ?? null

const getArrayStringValues = (value?: FirestoreValue) =>
  value?.arrayValue?.values
    ?.map((item) => item.stringValue)
    .filter((item): item is string => typeof item === 'string') ?? []

const getCategoryValue = (value?: FirestoreValue): ReferenceCategory => {
  const category = value?.stringValue
  return category && VALID_CATEGORIES.has(category as ReferenceCategory)
    ? (category as ReferenceCategory)
    : 'stavebni_prace'
}

const mapFirestoreDocumentToReference = (document: FirestoreDocument): Reference => {
  const fields = document.fields ?? {}

  return {
    id: getDocumentId(document.name),
    title: getStringValue(fields.title),
    description: getStringValue(fields.description),
    imageUrls: getArrayStringValues(fields.imageUrls),
    category: getCategoryValue(fields.category),
    isActive: getBooleanValue(fields.isActive),
    createdAt: getTimestampValue(fields.createdAt),
    updatedAt: getTimestampValue(fields.updatedAt),
  }
}

export async function getPublicActiveReferences(): Promise<Reference[]> {
  const response = await fetch(FIRESTORE_REFERENCES_ENDPOINT, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    console.error('Failed to fetch public references:', response.status, response.statusText)
    return []
  }

  const data = (await response.json()) as FirestoreDocumentListResponse

  return (data.documents ?? [])
    .map(mapFirestoreDocumentToReference)
    .filter((reference) => reference.isActive)
}
