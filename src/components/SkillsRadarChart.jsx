import React from 'react'

// Lightweight dependency-free SVG radar chart. `skills` is
// [{ label, value }] with value in [0, 1]. Needs at least 3 axes to be a
// meaningful shape — callers should fall back to a simple badge list below
// that threshold.
export default function SkillsRadarChart({ skills, size = 280 }) {
  const n = skills.length
  if (n < 3) return null

  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 40
  const rings = [0.25, 0.5, 0.75, 1]

  const pointAt = (i, value) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2
    return {
      x: cx + r * value * Math.cos(angle),
      y: cy + r * value * Math.sin(angle),
    }
  }

  const dataPoints = skills.map((s, i) => pointAt(i, Math.max(s.value, 0.08)))
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
      {/* Grid rings */}
      {rings.map((ring) => {
        const ringPoints = skills.map((_, i) => pointAt(i, ring))
        return (
          <polygon
            key={ring}
            points={ringPoints.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.15}
            className="text-gray-400"
          />
        )
      })}

      {/* Axis lines */}
      {skills.map((_, i) => {
        const p = pointAt(i, 1)
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="currentColor" strokeOpacity={0.15} className="text-gray-400" />
        )
      })}

      {/* Data shape */}
      <polygon points={dataPath} fill="#c84c30" fillOpacity={0.25} stroke="#c84c30" strokeWidth={2} />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#c84c30" />
      ))}

      {/* Labels */}
      {skills.map((s, i) => {
        const p = pointAt(i, 1.22)
        return (
          <text
            key={s.label}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-cozy-dark dark:fill-cozy-light"
            style={{ fontSize: 11, fontWeight: 600 }}
          >
            {s.label}
          </text>
        )
      })}
    </svg>
  )
}
