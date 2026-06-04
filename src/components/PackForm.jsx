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

export default function PackForm({ onAdd, editingPack, onUpdate, onCancelEdit }) {
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

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.gems) return

    const pack = {
      name: form.name,
      price: parseFloat(form.price),
      gems: parseInt(form.gems),
      giftCount: form.giftCount ? parseInt(form.giftCount) : 0,
      giftGems: form.giftGems ? parseInt(form.giftGems) : 0,
      type: form.type,
    }

    if (editingPack) {
      onUpdate({ ...pack, id: editingPack.id })
    } else {
      onAdd({ ...pack, id: Date.now() })
    }

    setForm(emptyForm)
  }

  const handleCancel = () => {
    setForm(emptyForm)
    onCancelEdit()
  }

  const showGiftFields = form.type === 'event'

  return (
    <form className="pack-form" onSubmit={handleSubmit}>
      <h2>{editingPack ? '编辑宝石包' : '添加宝石包'}</h2>
      <div className="form-grid">
        <div className="form-field">
          <label>名称</label>
          <input
            type="text"
            placeholder="如：6元宝石包"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            required
          />
        </div>
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
        {showGiftFields && (
          <>
            <div className="form-field">
              <label>礼品数量</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.giftCount}
                onChange={e => handleChange('giftCount', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>单个礼品折算宝石数</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.giftGems}
                onChange={e => handleChange('giftGems', e.target.value)}
              />
            </div>
          </>
        )}
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
