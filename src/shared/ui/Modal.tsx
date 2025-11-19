import React, { useEffect } from 'react'

interface ModalProps {
  title?: string
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ title, open, onClose, children }) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose() }}
        className="absolute inset-0 bg-black/60"
      />
      <div className="relative bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-6 max-w-lg w-full z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="px-3 py-1 rounded bg-white/10">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal
