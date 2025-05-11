import { Chart } from "@/components/ui/chart"
// Initialize charts when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if Chart.js is loaded
  if (typeof Chart === "undefined") {
    console.error("Chart.js is not loaded. Please check your script tags.")
    return
  }

  // Create simple placeholder charts
  const chartElements = document.querySelectorAll(".chart-placeholder")
  chartElements.forEach((element) => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 200
    element.innerHTML = ""
    element.appendChild(canvas)

    // Create a simple chart
    new Chart(canvas, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: element.textContent.trim(),
            data: [12, 19, 3, 5, 2, 3],
            borderColor: "#4318ff",
            backgroundColor: "rgba(67, 24, 255, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      },
    })
  })

  // Mobile menu functionality
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
  const sidebar = document.getElementById("sidebar")

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      sidebar.classList.add("active")
    })
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (event) => {
    if (
      window.innerWidth < 992 &&
      sidebar &&
      !sidebar.contains(event.target) &&
      mobileMenuToggle &&
      !mobileMenuToggle.contains(event.target) &&
      sidebar.classList.contains("active")
    ) {
      sidebar.classList.remove("active")
    }
  })

  // Simulate real-time balance updates
  function updateBalanceValue() {
    const balanceValue = document.querySelector(".balance-value")
    const balanceChange = document.querySelector(".balance-change")

    if (balanceValue && balanceChange) {
      // Get current value
      const currentValue = Number.parseFloat(balanceValue.textContent.replace("$", "").replace(",", ""))

      // Generate small random change (-0.2% to +0.2%)
      const changePercent = (Math.random() * 0.4 - 0.2) / 100
      const changeAmount = currentValue * changePercent
      const newValue = currentValue + changeAmount

      // Update display
      balanceValue.textContent = "$" + newValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")

      // Update change text
      const currentChangeText = balanceChange.textContent
      const currentChangePercent = Number.parseFloat(currentChangeText.match(/\+?-?\d+\.\d+/)[0])
      const newChangePercent = currentChangePercent + changePercent * 100

      // Calculate new change amount
      const newChangeAmount = ((currentValue * newChangePercent) / 100).toFixed(2)

      // Update change text
      const changeText = `${newChangePercent >= 0 ? "+" : ""}${newChangePercent.toFixed(1)}% ($${Math.abs(newChangeAmount)})`

      // Keep the LIVE indicator
      balanceChange.innerHTML = changeText + ' <span class="live-indicator">LIVE</span>'

      // Update class based on positive/negative
      if (newChangePercent >= 0) {
        balanceChange.classList.remove("negative")
        balanceChange.classList.add("positive")
      } else {
        balanceChange.classList.remove("positive")
        balanceChange.classList.add("negative")
      }

      // Add highlight effect
      balanceValue.style.transition = "color 0.3s"
      balanceValue.style.color = newChangePercent >= 0 ? "var(--color-positive)" : "var(--color-negative)"

      setTimeout(() => {
        balanceValue.style.color = ""
      }, 500)
    }
  }

  // Update balance every 3 seconds
  setInterval(updateBalanceValue, 3000)
})
