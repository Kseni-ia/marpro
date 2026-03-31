'use client'

import { X } from 'lucide-react'

interface ImagePreviewLightboxProps {
  previewUrl: string
  onClose: () => void
}

export default function ImagePreviewLightbox({
  previewUrl,
  onClose,
}: ImagePreviewLightboxProps) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/92 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        title="Zavřít náhled"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={previewUrl}
        alt="Zvětšený náhled fotografie"
        className="max-h-[92vh] max-w-[92vw] rounded-2xl object-contain shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  )
}
