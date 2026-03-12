import { useEffect, useRef } from 'react'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function StarsChart({ repos }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const data = repos?.slice(0, 8) || [
    { name: 'project-a', stars: 45 }, { name: 'api-server', stars: 32 },
    { name: 'ui-kit', stars: 28 }, { name: 'ml-model', stars: 21 },
    { name: 'portfolio', stars: 18 }, { name: 'cli-tool', stars: 12 },
  ]

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()
    const ctx = canvasRef.current.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, 0, 300)
    grad.addColorStop(0, 'rgba(59,130,246,0.8)')
    grad.addColorStop(1, 'rgba(139,92,246,0.3)')

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(r => r.name),
        datasets: [{
          label: 'Stars',
          data: data.map(r => r.stars || r.stargazers_count || 0),
          backgroundColor: grad,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,15,30,0.95)',
            borderColor: 'rgba(59,130,246,0.3)',
            borderWidth: 1,
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#64748b', font: { size: 11 }, maxRotation: 30 }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#64748b', font: { size: 11 } }
          }
        }
      }
    })
    return () => chartRef.current?.destroy()
  }, [JSON.stringify(data)])

  return <canvas ref={canvasRef} />
}
