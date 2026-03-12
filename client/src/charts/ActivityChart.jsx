import { useEffect, useRef } from 'react'
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip } from 'chart.js'
Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip)

export default function ActivityChart({ activity }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const data = activity || [12, 19, 8, 25, 34, 28, 42, 38, 31, 45, 29, 52]

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()
    const ctx = canvasRef.current.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, 0, 200)
    grad.addColorStop(0, 'rgba(6,182,212,0.3)')
    grad.addColorStop(1, 'rgba(6,182,212,0)')

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Contributions',
          data,
          borderColor: '#06b6d4',
          borderWidth: 2,
          fill: true,
          backgroundColor: grad,
          tension: 0.4,
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,15,30,0.95)',
            borderColor: 'rgba(6,182,212,0.3)',
            borderWidth: 1,
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 } } }
        }
      }
    })
    return () => chartRef.current?.destroy()
  }, [JSON.stringify(data)])

  return <canvas ref={canvasRef} />
}
