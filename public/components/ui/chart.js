"use client"

import React from "react"
import { Chart as ChartJS } from "chart.js/auto" // Import ChartJS

// This file exports the Chart component from chart.js
// It serves as a bridge between the global Chart object and our app.js imports

// Export the Chart class from Chart.js as a named export
export const Chart = typeof Chart !== "undefined" ? Chart || ChartJS : ChartJS

// Fallback if Chart is not available
if (!Chart) {
  console.error("Chart.js is not loaded. Make sure to include the Chart.js script before using this module.")
}

// Also export a React wrapper component for Chart.js if needed
export function ChartComponent({ type, data, options, ...props }) {
  const chartRef = React.useRef(null)
  const chartInstance = React.useRef(null)

  React.useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Create new chart
      const ctx = chartRef.current.getContext("2d")
      chartInstance.current = new Chart(ctx, {
        type,
        data,
        options,
      })
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [type, data, options])

  return <canvas ref={chartRef} {...props} />
}
