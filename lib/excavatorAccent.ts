export type ExcavatorAccent = {
  primary: string
  text: string
  tint: string
  tintStrong: string
  border: string
  borderStrong: string
}

const MINI: ExcavatorAccent = {
  primary: '#60a5fa',
  text: '#dbeafe',
  tint: 'rgba(96, 165, 250, 0.12)',
  tintStrong: 'rgba(96, 165, 250, 0.2)',
  border: 'rgba(96, 165, 250, 0.22)',
  borderStrong: 'rgba(96, 165, 250, 0.38)',
}

const STANDARD: ExcavatorAccent = {
  primary: '#34d399',
  text: '#d1fae5',
  tint: 'rgba(52, 211, 153, 0.12)',
  tintStrong: 'rgba(52, 211, 153, 0.2)',
  border: 'rgba(52, 211, 153, 0.22)',
  borderStrong: 'rgba(52, 211, 153, 0.38)',
}

const LARGE: ExcavatorAccent = {
  primary: '#f59e0b',
  text: '#fef3c7',
  tint: 'rgba(245, 158, 11, 0.12)',
  tintStrong: 'rgba(245, 158, 11, 0.2)',
  border: 'rgba(245, 158, 11, 0.22)',
  borderStrong: 'rgba(245, 158, 11, 0.38)',
}

const FALLBACK: ExcavatorAccent = {
  primary: '#a78bfa',
  text: '#ede9fe',
  tint: 'rgba(167, 139, 250, 0.12)',
  tintStrong: 'rgba(167, 139, 250, 0.2)',
  border: 'rgba(167, 139, 250, 0.22)',
  borderStrong: 'rgba(167, 139, 250, 0.38)',
}

export const getExcavatorAccent = (type: string): ExcavatorAccent => {
  if (type === 'mini') return MINI
  if (type === 'standard') return STANDARD
  if (type === 'large') return LARGE
  return FALLBACK
}
