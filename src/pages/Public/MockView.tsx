import React from 'react'
import { useSearchParams } from 'react-router-dom'

const MockView: React.FC = () => {
  const [search] = useSearchParams()
  const file = search.get('file') ?? 'Dashboard.html'
  const src = `/${file}`
  return <iframe title={`mock-${file}`} src={src} style={{ width: '100%', height: '100vh', border: 0 }} />
}

export default MockView
