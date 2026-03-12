import { useEffect, useRef } from 'react'
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function SkillRadarChart({ skills }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const defaultSkills = skills || {
    Frontend: 75, Backend: 60, Algorithms: 55, 'AI/ML': 40, DevOps: 45, 'System Design': 50
  }

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(defaultSkills),
        datasets: [{
          label: 'Skill Level',
          data: Object.values(defaultSkills),
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          borderColor: '#8b5cf6',
          borderWidth: 2,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { display: false },
            pointLabels: {
              color: '#94a3b8',
              font: { size: 12, family: 'Inter' }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,15,30,0.95)',
            borderColor: 'rgba(139,92,246,0.3)',
            borderWidth: 1,
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
          }
        }
      }
    })
    return () => chartRef.current?.destroy()
  }, [JSON.stringify(defaultSkills)])

  return <canvas ref={canvasRef} />
}
