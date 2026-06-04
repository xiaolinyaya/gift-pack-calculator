import { useState, useEffect } from 'react'
import PackForm from './components/PackForm'
import PackList from './components/PackList'
import './App.css'

const DEFAULT_PACKS = [
  { id: 1, name: '6元宝石包', price: 6, gems: 60, giftCount: 0, giftGems: 0, type: 'normal' },
  { id: 2, name: '30元宝石包', price: 30, gems: 360, giftCount: 0, giftGems: 0, type: 'normal' },
  { id: 3, name: '68元宝石包', price: 68, gems: 880, giftCount: 0, giftGems: 0, type: 'normal' },
  { id: 4, name: '128元宝石包', price: 128, gems: 1680, giftCount: 0, giftGems: 0, type: 'normal' },
  { id: 5, name: '328元宝石包', price: 328, gems: 4480, giftCount: 0, giftGems: 0, type: 'normal' },
  { id: 6, name: '648元宝石包', price: 648, gems: 8888, giftCount: 0, giftGems: 0, type: 'normal' },
]

const STORAGE_KEY = 'gem-pack-data'

function loadPacks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return DEFAULT_PACKS
}

function App() {
  const [packs, setPacks] = useState(loadPacks)
  const [editingPack, setEditingPack] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packs))
  }, [packs])

  const handleAdd = (pack) => {
    setPacks(prev => [...prev, pack])
  }

  const handleUpdate = (updated) => {
    setPacks(prev => prev.map(p => p.id === updated.id ? updated : p))
    setEditingPack(null)
  }

  const handleDelete = (id) => {
    setPacks(prev => prev.filter(p => p.id !== id))
    if (editingPack?.id === id) setEditingPack(null)
  }

  const handleEdit = (pack) => {
    setEditingPack(pack)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingPack(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💎 宝石包计算器</h1>
        <p>快速对比各档位宝石包性价比</p>
      </header>
      <main className="app-main">
        <PackForm
          onAdd={handleAdd}
          editingPack={editingPack}
          onUpdate={handleUpdate}
          onCancelEdit={handleCancelEdit}
        />
        <PackList
          packs={packs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}

export default App
