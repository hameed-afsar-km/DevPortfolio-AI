import { useEffect, useRef } from 'react'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#84cc16', '#f97316', '#6366f1'
]

export default function LanguageChart({ languages }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const defaultLangs = languages || { JavaScript: 40, TypeScript: 25, Python: 15, CSS: 10, HTML: 10 }

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(defaultLangs),
        datasets: [{
          data: Object.values(defaultLangs),
          backgroundColor: COLORS.slice(0, Object.keys(defaultLangs).length),
          borderWidth: 0,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              padding: 16,
              font: { size: 12, family: 'Inter' },
              usePointStyle: true,
              pointStyleWidth: 8,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10,15,30,0.95)',
            borderColor: 'rgba(59,130,246,0.3)',
            borderWidth: 1,
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
            }
          }
        }
      }
    })
    return () => chartRef.current?.destroy()
  }, [JSON.stringify(defaultLangs)])

  return <canvas ref={canvasRef} />
}
