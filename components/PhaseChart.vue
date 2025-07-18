<template>
  <div class="glass-effect rounded-2xl p-8 shadow-xl">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Phase Distribution</h2>
      <div class="p-3 rounded-full bg-gradient-to-br from-green-100 to-green-200">
        <i class="fas fa-chart-pie text-green-600"></i>
      </div>
    </div>
    <div class="relative h-80">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, type ChartConfiguration } from 'chart.js/auto'

const propertiesStore = usePropertiesStore()
const chartCanvas = ref<HTMLCanvasElement>()
let chart: Chart | null = null

const phaseColors = {
  'Sheetrock': '#8B5CF6',
  'Flatwork': '#374151', 
  'Roof': '#0F766E',
  'Final': '#059669',
  'Design': '#2563EB',
  'Sold': '#16A34A',
  'Listed': '#059669',
  'Pending': '#0891B2',
  'Delete': '#DC2626',
  'Unknown': '#9CA3AF'
}

const initializeChart = () => {
  if (!chartCanvas.value) return

  const phaseCounts = propertiesStore.phaseDistribution
  const labels = Object.keys(phaseCounts)
  const data = Object.values(phaseCounts)
  const colors = labels.map(label => phaseColors[label as keyof typeof phaseColors] || '#9CA3AF')

  const config: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 25,
            usePointStyle: true,
            font: {
              size: 13,
              weight: '500'
            },
            generateLabels: function(chart) {
              const data = chart.data
              if (data.labels && data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i] as number
                  const total = (data.datasets[0].data as number[]).reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor![i] as string,
                    hidden: false,
                    index: i
                  }
                })
              }
              return []
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1e4d4b',
          bodyColor: '#374151',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed
              const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: ${value} properties (${percentage}%)`
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        duration: 1500,
        easing: 'easeOutQuart'
      }
    }
  }

  chart = new Chart(chartCanvas.value, config)
}

const updateChart = () => {
  if (!chart) return

  const phaseCounts = propertiesStore.phaseDistribution
  const labels = Object.keys(phaseCounts)
  const data = Object.values(phaseCounts)
  const colors = labels.map(label => phaseColors[label as keyof typeof phaseColors] || '#9CA3AF')

  chart.data.labels = labels
  chart.data.datasets[0].data = data
  chart.data.datasets[0].backgroundColor = colors
  chart.update()
}

onMounted(() => {
  nextTick(() => {
    initializeChart()
  })
})

watch(() => propertiesStore.phaseDistribution, () => {
  updateChart()
}, { deep: true })

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>