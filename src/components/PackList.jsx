import { useState } from 'react'
import PackCard from './PackCard'

const TYPE_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'normal', label: '常规' },
  { value: 'first', label: '首冲' },
  { value: 'event', label: '活动' },
  { value: 'newbie', label: '新手' },
]

function calcUnitPrice(pack) {
  const totalGems = pack.gems + pack.giftCount * pack.giftGems
  const unitPrice = totalGems > 0 ? pack.price / totalGems : Infinity
  return { ...pack, totalGems, unitPrice }
}

export default function PackList({ packs, previewPack, onEdit, onDelete }) {
  const [typeFilter, setTypeFilter] = useState('all')
  const [ascending, setAscending] = useState(true)
  const [basePrice, setBasePrice] = useState('')

  const filtered = packs.filter(p => typeFilter === 'all' || p.type === typeFilter)

  // Preview pack always participates regardless of filter
  const allItems = previewPack ? [...filtered, previewPack] : filtered

  const sorted = allItems
    .map(calcUnitPrice)
    .sort((a, b) => ascending ? a.unitPrice - b.unitPrice : b.unitPrice - a.unitPrice)

  const isEmpty = packs.length === 0 && !previewPack

  if (isEmpty) {
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
      <div className="base-price-bar">
        <label>基准单价（$/宝石）</label>
        <input
          type="number"
          step="0.0001"
          min="0"
          placeholder="输入基准值后显示Value"
          value={basePrice}
          onChange={e => setBasePrice(e.target.value)}
        />
        {basePrice && (
          <button className="btn-clear" onClick={() => setBasePrice('')}>清除</button>
        )}
      </div>
      {previewPack && sorted.length > 0 && (() => {
        const previewRank = sorted.findIndex(p => p.id === '__preview__') + 1
        return previewRank > 0 ? (
          <div className="preview-hint">
            比价中的商品当前排在第 <strong>{previewRank}</strong> 位（共 {sorted.length} 个）
          </div>
        ) : null
      })()}
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
              isPreview={pack.id === '__preview__'}
              basePrice={basePrice ? parseFloat(basePrice) : null}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
