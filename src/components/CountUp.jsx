import React, { useEffect, useState } from 'react'

export default function CountUp({ end, prefix = "", suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // easeOutQuart easing
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(end * eased)
      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }
    window.requestAnimationFrame(step)
  }, [end, duration])

  const isDecimal = end % 1 !== 0
  const formatted = isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()
  return <>{prefix}{formatted}{suffix}</>
}
