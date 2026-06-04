import { useState } from 'react'
import PackCard from './PackCard'

const TYPE_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'normal', label: '常规' },
  { value: 'first', label: '首冲' },
  { value: 'event', label: '活动' },
  { value: 'newbie', label: '新手' },
]

export default function PackList({ packs, onEdit, onDelete }) {
  const [typeFilter, setTypeFilter] = useState('all')
  const [ascending, setAscending] = useState(true)

  const filtered = packs.filter(p => typeFilter === 'all' || p.type === typeFilter)

  const sorted = [...filtered]
    .map(pack => {
      const totalGems = pack.gems + pack.giftCount * pack.giftGems
      const unitPrice = totalGems > 0 ? pack.price / totalGems : Infinity
      return { ...pack, totalGems, unitPrice }
    })
    .sort((a, b) => ascending ? a.unitPrice - b.unitPrice : b.unitPrice - a.unitPrice)

  if (packs.length === 0) {
    return (
      <div className="pack-list-empty">
        <p>暂无宝石包，请点击上方添加</p>
      </div>
    )
  }

  return (
    <div className="pack-list">
      <h2>性价比排序</h2>
      <div className="list-toolbar">
        <div className="filter-group">
          {TYPE_FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-btn ${typeFilter === f.value ? 'filter-btn-active' : ''}`}
              onClick={() => setTypeFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          className="sort-btn"
          onClick={() => setAscending(prev => !prev)}
          title={ascending ? '当前：单价从低到高' : '当前：单价从高到低'}
        >
          {ascending ? '↑ 单价低→高' : '↓ 单价高→低'}
        </button>
      </div>
      {sorted.length === 0 ? (
        <div className="pack-list-empty">
          <p>该类型下暂无宝石包</p>
        </div>
      ) : (
        <div className="pack-cards">
          {sorted.map((pack, index) => (
            <PackCard
              key={pack.id}
              pack={pack}
              rank={index + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
