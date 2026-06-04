import { useState, useEffect } from 'react'
import PackForm from './components/PackForm'
import PackList from './components/PackList'
import './App.css'

const DEFAULT_PACKS = [
  { id: 1,  name: '$1.49',  price: 1.49,  gems: 500,   giftCount: 0, giftGems: 0, type: 'newbie' },
  { id: 2,  name: '$199.9', price: 199.9, gems: 55000, giftCount: 0, giftGems: 0, type: 'first' },
  { id: 3,  name: '$199.9', price: 199.9, gems: 50000, giftCount: 0, giftGems: 0, type: 'normal' },
  { id: 4,  name: '$69.9',  price: 69.9,  gems: 16500, giftCount: 0, giftGems: 0, type: 'first' },
  { id: 5,  name: '$38.9',  price: 38.9,  gems: 8800,  giftCount: 0, giftGems: 0, type: 'first' },
  { id: 6,  name: '$19.9',  price: 19.9,  gems: 4400,  giftCount: 0, giftGems: 0, type: 'first' },
  { id: 7,  name: '$69.9',  price: 69.9,  gems: 15000, giftCount: 0, giftGems: 0, type: 'normal' },
  { id: 8,  name: '$38.9',  price: 38.9,  gems: 8000,  giftCount: 0, giftGems: 0, type: 'normal' },
  { id: 9,  name: '$19.9',  price: 19.9,  gems: 4000,  giftCount: 0, giftGems: 0, type: 'normal' },
  { id: 10, name: '$5.9',   price: 5.9,   gems: 1100,  giftCount: 0, giftGems: 0, type: 'first' },
  { id: 11, name: '$5.9',   price: 5.9,   gems: 1000,  giftCount: 0, giftGems: 0, type: 'normal' },
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
  const [previewPack, setPreviewPack] = useState(null)

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
          onPreviewChange={setPreviewPack}
        />
        <PackList
          packs={packs}
          previewPack={previewPack}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}

export default App
