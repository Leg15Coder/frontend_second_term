import React from 'react'

interface Props {
  children: React.ReactNode
}

const MockLayout: React.FC<Props> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: -10 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-12%', width: 520, height: 520, background: 'var(--primary)', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.12, animation: 'pulse 7s infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-12%', width: 620, height: 620, background: 'var(--accent)', borderRadius: '50%', filter: 'blur(180px)', opacity: 0.06, animation: 'pulse 9s infinite' }} />
        <div style={{ position: 'absolute', top: '30%', right: '6%', width: 420, height: 420, background: 'rgba(10,15,43,0.6)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.6 }} />
      </div>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  )
}

export default MockLayout
