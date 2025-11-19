import React, { useState } from 'react'
import MockLayout from './MockLayout'
import Modal from '../../shared/ui/Modal'
import Toast from '../../shared/ui/Toast'

const ModalsDemo: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto glass-panel p-6">
          <h2 className="text-2xl font-bold mb-4">Modals & Toasts</h2>
          <div className="flex gap-3">
            <button onClick={() => setOpen(true)} className="px-4 py-2 rounded bg-accent/10">Open Modal</button>
            <button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 2000) }} className="px-4 py-2 rounded bg-white/10">Show Toast</button>
          </div>
        </div>
        <Modal open={open} onClose={() => setOpen(false)} title="Confirm">
          <p>Are you sure you want to proceed?</p>
          <div className="mt-4 flex gap-2"><button onClick={() => setOpen(false)} className="px-3 py-1 rounded bg-accent/10">Yes</button><button onClick={() => setOpen(false)} className="px-3 py-1 rounded bg-white/10">Cancel</button></div>
        </Modal>
        {showToast && <Toast message="Saved" type="success" />}
      </main>
    </MockLayout>
  )
}

export default ModalsDemo

