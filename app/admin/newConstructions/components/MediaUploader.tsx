'use client'

import React, { useRef, useState } from 'react'
import { Check, Film, ImagePlus, Play, Trash2, UploadCloud } from 'lucide-react'
import { isVideoFile } from '@/lib/imageUpload'
import {
  getReferenceImageUrl,
  getReferenceVideoPosterUrl,
  isVideoUrl,
} from '@/lib/referenceImageUrl'

export type MediaAccent = {
  primary: string
  tint: string
  tintStrong: string
  border: string
  borderStrong: string
  text: string
}

const DEFAULT_ACCENT: MediaAccent = {
  primary: '#f87171',
  tint: 'rgba(248, 113, 113, 0.12)',
  tintStrong: 'rgba(248, 113, 113, 0.18)',
  border: 'rgba(248, 113, 113, 0.22)',
  borderStrong: 'rgba(248, 113, 113, 0.38)',
  text: '#fee2e2',
}

const ACCEPTED_TYPES =
  'image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime'

type MediaUploaderProps = {
  /** Newly selected files, not yet uploaded */
  files: File[]
  /** Object URLs matching `files` by index */
  previews: string[]
  /** Media already stored on Cloudinary (edit mode) */
  existingUrls?: string[]
  maxFiles?: number
  accent?: MediaAccent
  /** Per-file upload progress (0–100) keyed by `files` index; null when idle */
  uploadProgress?: Record<number, number> | null
  onAddFiles: (files: FileList) => void
  onRemoveFile: (index: number) => void
  onRemoveExisting?: (index: number) => void
  /** Open a lightbox for a local image preview */
  onPreviewClick?: (previewUrl: string) => void
}

const formatBytes = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${Math.max(1, Math.round(bytes / 1024))} kB`
}

const RING_RADIUS = 17
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const CornerTick = ({
  position,
  color,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br'
  color: string
}) => {
  const positionClass = {
    tl: 'left-3 top-3 rounded-tl-md border-l-2 border-t-2',
    tr: 'right-3 top-3 rounded-tr-md border-r-2 border-t-2',
    bl: 'bottom-3 left-3 rounded-bl-md border-b-2 border-l-2',
    br: 'bottom-3 right-3 rounded-br-md border-b-2 border-r-2',
  }[position]

  return (
    <span
      className={`pointer-events-none absolute h-4 w-4 transition-all duration-300 ${positionClass}`}
      style={{ borderColor: color }}
    />
  )
}

export default function MediaUploader({
  files,
  previews,
  existingUrls = [],
  maxFiles = 10,
  accent = DEFAULT_ACCENT,
  uploadProgress = null,
  onAddFiles,
  onRemoveFile,
  onRemoveExisting,
  onPreviewClick,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const totalCount = existingUrls.length + files.length
  const atCapacity = totalCount >= maxFiles
  const isUploading = uploadProgress !== null

  const progressValues = isUploading
    ? files.map((_, index) => uploadProgress?.[index] ?? 0)
    : []
  const doneCount = progressValues.filter((value) => value >= 100).length
  const totalPercent = progressValues.length
    ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
    : 0

  const openPicker = () => {
    if (!atCapacity && !isUploading) {
      inputRef.current?.click()
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    dragDepth.current = 0
    setIsDragging(false)

    if (atCapacity || isUploading) return
    if (event.dataTransfer.files?.length) {
      onAddFiles(event.dataTransfer.files)
    }
  }

  const tickColor = isDragging ? accent.primary : 'rgba(255, 255, 255, 0.18)'

  return (
    <div className="space-y-3">
      <style>{`
        @keyframes mu-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes mu-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Fotografie a videa
        </span>
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums"
          style={{
            backgroundColor: accent.tintStrong,
            border: `1px solid ${accent.borderStrong}`,
            color: accent.text,
          }}
        >
          {totalCount}/{maxFiles}
        </span>
      </div>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openPicker()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          dragDepth.current += 1
          setIsDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault()
          dragDepth.current = Math.max(0, dragDepth.current - 1)
          if (dragDepth.current === 0) {
            setIsDragging(false)
          }
        }}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed px-4 py-7 text-center outline-none transition-all duration-300 focus-visible:ring-2 ${
          atCapacity || isUploading
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:bg-white/[0.03]'
        } ${isDragging ? 'scale-[1.01]' : ''}`}
        style={{
          borderColor: isDragging ? accent.borderStrong : 'rgba(255, 255, 255, 0.12)',
          background: isDragging
            ? `repeating-linear-gradient(45deg, ${accent.tint} 0 10px, transparent 10px 20px)`
            : undefined,
          boxShadow: isDragging ? `0 0 32px ${accent.tint}` : undefined,
        }}
      >
        <CornerTick position="tl" color={tickColor} />
        <CornerTick position="tr" color={tickColor} />
        <CornerTick position="bl" color={tickColor} />
        <CornerTick position="br" color={tickColor} />

        <div
          className="mx-auto mb-3 flex w-fit items-center gap-2"
          style={isDragging ? { animation: 'mu-float 1.2s ease-in-out infinite' } : undefined}
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: accent.tintStrong, color: accent.text }}
          >
            <ImagePlus className="h-4.5 w-4.5" />
          </span>
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{
              backgroundColor: accent.tintStrong,
              color: accent.primary,
              boxShadow: `0 0 0 1px ${accent.borderStrong}`,
            }}
          >
            <UploadCloud className="h-5 w-5" />
          </span>
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: accent.tintStrong, color: accent.text }}
          >
            <Film className="h-4.5 w-4.5" />
          </span>
        </div>

        <p className="text-sm font-medium text-white">
          {atCapacity
            ? 'Dosažen maximální počet souborů'
            : isDragging
              ? 'Pusťte soubory zde'
              : 'Přetáhněte fotografie nebo videa'}
        </p>
        {!atCapacity && (
          <p className="mt-1 text-xs text-gray-500">
            nebo klikněte pro výběr · foto do 10 MB · video do 100 MB
          </p>
        )}
        <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-gray-600">
          JPEG · PNG · GIF · WebP · MP4 · WebM · MOV
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) {
              onAddFiles(event.target.files)
            }
            event.target.value = ''
          }}
        />
      </div>

      {/* Media grid */}
      {(existingUrls.length > 0 || files.length > 0) && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {existingUrls.map((url, index) => {
            const isVideo = isVideoUrl(url)
            return (
              <div
                key={`existing-${index}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <img
                  src={
                    isVideo
                      ? getReferenceVideoPosterUrl(url, 'admin')
                      : getReferenceImageUrl(url, 'admin')
                  }
                  alt={`Soubor ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = '/placeholder-image.svg'
                  }}
                />
                <span
                  className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.62)' }}
                >
                  {isVideo ? <Play className="h-2.5 w-2.5 fill-white" /> : null}
                  {isVideo ? 'Video' : 'Foto'}
                </span>
                {onRemoveExisting && !isUploading && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(index)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    title="Odstranit soubor"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )
          })}

          {files.map((file, index) => {
            const preview = previews[index]
            const isVideo = isVideoFile(file)
            const percent = isUploading ? (uploadProgress?.[index] ?? 0) : 0
            const isDone = isUploading && percent >= 100

            return (
              <div
                key={`new-${index}`}
                className={`group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] ${
                  !isVideo && onPreviewClick && !isUploading ? 'cursor-zoom-in' : ''
                }`}
                onClick={() => {
                  if (!isVideo && onPreviewClick && !isUploading && preview) {
                    onPreviewClick(preview)
                  }
                }}
              >
                {isVideo ? (
                  <video
                    src={preview}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={preview}
                    alt={`Náhled ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                )}

                {isVideo && !isUploading && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/30">
                      <Play className="h-4 w-4 translate-x-[1px] fill-white" />
                    </span>
                  </div>
                )}

                {/* Name + size footer */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-5">
                  <p className="truncate text-[10px] font-medium text-white">{file.name}</p>
                  <p className="text-[9px] text-gray-400">{formatBytes(file.size)}</p>
                </div>

                <span
                  className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.62)' }}
                >
                  {isVideo ? <Play className="h-2.5 w-2.5 fill-white" /> : null}
                  {isVideo ? 'Video' : 'Foto'}
                </span>

                {!isUploading && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onRemoveFile(index)
                    }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    title="Odstranit soubor"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}

                {/* Upload progress overlay */}
                {isUploading && !isDone && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                    <div className="relative flex h-12 w-12 items-center justify-center">
                      <svg viewBox="0 0 40 40" className="h-12 w-12 -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r={RING_RADIUS}
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.16)"
                          strokeWidth="3"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r={RING_RADIUS}
                          fill="none"
                          stroke={accent.primary}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={RING_CIRCUMFERENCE}
                          strokeDashoffset={(1 - percent / 100) * RING_CIRCUMFERENCE}
                          className="transition-[stroke-dashoffset] duration-200 ease-out"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-semibold tabular-nums text-white">
                        {percent}
                      </span>
                    </div>
                  </div>
                )}

                {isDone && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: '#10b981' }}
                    >
                      <Check className="h-4.5 w-4.5" strokeWidth={3} />
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Overall upload summary */}
      {isUploading && (
        <div
          className="rounded-xl border px-3.5 py-2.5"
          style={{ borderColor: accent.border, background: accent.tint }}
        >
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-white">Nahrávání na Cloudinary…</span>
            <span className="tabular-nums text-gray-300">
              {doneCount}/{files.length} · {totalPercent}%
            </span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${totalPercent}%`, backgroundColor: accent.primary }}
            />
            <div
              className="absolute inset-y-0 w-1/3 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)',
                animation: 'mu-shimmer 1.4s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      )}

      <p className="text-xs leading-5 text-gray-500">
        Fotografie Cloudinary po nahrání automaticky vylepší a přidá logo watermark. Videa se
        nahrávají v původní podobě.
      </p>
    </div>
  )
}
