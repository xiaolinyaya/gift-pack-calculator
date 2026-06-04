import { useState, useEffect } from 'react'

const PACK_TYPES = [
  { value: 'normal', label: '常规' },
  { value: 'first', label: '首冲' },
  { value: 'event', label: '活动' },
  { value: 'newbie', label: '新手' },
]

const emptyForm = {
  name: '',
  price: '',
  gems: '',
  giftCount: '',
  giftGems: '',
  type: 'normal',
}

function buildPack(form) {
  const price = parseFloat(form.price)
  const gems = parseInt(form.gems)
  if (!form.price || !form.gems || isNaN(price) || isNaN(gems) || price <= 0 || gems <= 0) {
    return null
  }
  return {
    name: form.name || '新宝石包',
    price,
    gems,
    giftCount: form.giftCount ? parseInt(form.giftCount) : 0,
    giftGems: form.giftGems ? parseInt(form.giftGems) : 0,
    type: form.type,
  }
}

export default function PackForm({ onAdd, editingPack, onUpdate, onCancelEdit, onPreviewChange }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (editingPack) {
      setForm({
        name: editingPack.name,
        price: String(editingPack.price),
        gems: String(editingPack.gems),
        giftCount: editingPack.giftCount ? String(editingPack.giftCount) : '',
        giftGems: editingPack.giftGems ? String(editingPack.giftGems) : '',
        type: editingPack.type,
      })
    }
  }, [editingPack])

  useEffect(() => {
    if (editingPack) {
      onPreviewChange(null)
      return
    }
    const pack = buildPack(form)
    onPreviewChange(pack ? { ...pack, id: '__preview__' } : null)
  }, [form, editingPack])

  const handleChange = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      // Auto-fill name as "$" + price
      if (field === 'price') {
        next.name = value ? `$${value}` : ''
      }
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.price || !form.gems) return

    const pack = buildPack(form)
    if (!pack) return

    if (editingPack) {
      onUpdate({ ...pack, id: editingPack.id })
    } else {
      onAdd({ ...pack, id: Date.now() })
      onPreviewChange(null)
    }

    setForm(emptyForm)
  }

  const handleCancel = () => {
    setForm(emptyForm)
    onPreviewChange(null)
    onCancelEdit()
  }

  const isEvent = form.type === 'event'
  const isPreviewing = !editingPack && buildPack(form) !== null

  return (
    <form className={`pack-form ${isPreviewing ? 'pack-form-previewing' : ''}`} onSubmit={handleSubmit}>
      <div className="form-title-row">
        <h2>{editingPack ? '编辑宝石包' : '添加宝石包'}</h2>
        {isPreviewing && <span className="form-preview-badge">比价中 — 查看下方列表</span>}
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label>类型</label>
          <select
            value={form.type}
            onChange={e => handleChange('type', e.target.value)}
          >
            {PACK_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>售价（美元）</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.price}
            onChange={e => handleChange('price', e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>宝石数量</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={form.gems}
            onChange={e => handleChange('gems', e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>礼品数量</label>
          <input
            type="number"
            min="0"
            placeholder={isEvent ? '0' : '-'}
            value={isEvent ? form.giftCount : ''}
            onChange={e => handleChange('giftCount', e.target.value)}
            disabled={!isEvent}
          />
        </div>
        <div className="form-field">
          <label>礼品折算宝石数</label>
          <input
            type="number"
            min="0"
            placeholder={isEvent ? '0' : '-'}
            value={isEvent ? form.giftGems : ''}
            onChange={e => handleChange('giftGems', e.target.value)}
            disabled={!isEvent}
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingPack ? '保存修改' : '添加'}
        </button>
        {editingPack && (
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            取消
          </button>
        )}
      </div>
    </form>
  )
}
