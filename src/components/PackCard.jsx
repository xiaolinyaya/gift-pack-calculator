const TYPE_CONFIG = {
  normal: { label: '常规', className: 'tag-normal' },
  first: { label: '首冲', className: 'tag-first' },
  event: { label: '活动', className: 'tag-event' },
  newbie: { label: '新手', className: 'tag-newbie' },
}

export default function PackCard({ pack, rank, isPreview, basePrice, onEdit, onDelete }) {
  const totalGems = pack.gems + pack.giftCount * pack.giftGems
  const unitPrice = totalGems > 0 ? pack.price / totalGems : 0
  const typeConfig = TYPE_CONFIG[pack.type] || TYPE_CONFIG.normal

  const savePercent = basePrice && basePrice > 0 && unitPrice > 0
    ? ((basePrice - unitPrice) / basePrice) * 100
    : null

  const cardClass = [
    'pack-card',
    isPreview ? 'pack-card-preview' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>
      <div className="pack-rank">
        {isPreview ? '⚡' : `#${rank}`}
      </div>
      <div className="pack-info">
        <div className="pack-header">
          <span className="pack-name">{pack.name}</span>
          <span className={`pack-tag ${typeConfig.className}`}>{typeConfig.label}</span>
          {isPreview && <span className="pack-tag tag-preview">比价中</span>}
        </div>
        <div className="pack-unit-price">
          <span className="unit-price-value">{unitPrice.toFixed(4)}</span>
          <span className="unit-price-label">$/宝石</span>
          {savePercent !== null && (
            <span className={`save-badge ${savePercent >= 0 ? 'save-positive' : 'save-negative'}`}>
              {savePercent >= 0 ? `Save ${savePercent.toFixed(1)}%` : `贵 ${Math.abs(savePercent).toFixed(1)}%`}
            </span>
          )}
        </div>
        <div className="pack-details">
          <span>售价：${pack.price}</span>
          <span>宝石：{pack.gems}</span>
          {pack.giftCount > 0 && (
            <span>礼品：{pack.giftCount}个 × {pack.giftGems}宝石</span>
          )}
          {totalGems !== pack.gems && (
            <span className="total-gems">折算总宝石：{totalGems}</span>
          )}
        </div>
      </div>
      {!isPreview && (
        <div className="pack-actions">
          <button className="btn-icon" onClick={() => onEdit(pack)} title="编辑">✏️</button>
          <button className="btn-icon" onClick={() => onDelete(pack.id)} title="删除">🗑️</button>
        </div>
      )}
    </div>
  )
}
