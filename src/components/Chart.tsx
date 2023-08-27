import React from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

interface ChartProps {
  data: ChartData
  options: ChartOptions
}

export default function Chart({ data, options }: ChartProps) {
  return <Line data={data} options={options} />
}
