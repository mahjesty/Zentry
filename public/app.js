import { Chart } from "@/components/ui/chart"
// No import needed as Chart.js is loaded via script tag in HTML
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu functionality
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
  const closeSidebar = document.getElementById("close-sidebar")
  const sidebar = document.getElementById("sidebar")

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      sidebar.classList.add("active")
    })
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", () => {
      sidebar.classList.remove("active")
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

  // Navigation functionality
  const navLinks = document.querySelectorAll(".nav-link")
  const contentSections = document.querySelectorAll(".content-section")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Update active nav link
      navLinks.forEach((link) => link.classList.remove("active"))
      this.classList.add("active")

      // Update active content section
      const targetSection = this.getAttribute("data-section")
      contentSections.forEach((section) => section.classList.remove("active"))
      document.getElementById(`${targetSection}-section`).classList.add("active")
    })
  })

  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")

  if (themeToggle) {
    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.remove("light-theme")
        document.body.classList.add("dark-theme")
        localStorage.setItem("theme", "dark")
      } else {
        document.body.classList.remove("dark-theme")
        document.body.classList.add("light-theme")
        localStorage.setItem("theme", "light")
      }

      // Update all charts with new theme colors
      updateAllCharts()
    })

    // Set initial theme based on localStorage or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark"
    if (savedTheme === "light") {
      themeToggle.checked = false
      document.body.classList.add("light-theme")
    } else {
      themeToggle.checked = true
      document.body.classList.add("dark-theme")
    }
  }

  // Admin notice banner functionality
  const adminNoticeBanner = document.querySelector(".admin-notice-banner")
  const adminNoticeMore = document.querySelector(".admin-notice-more")

  if (adminNoticeMore && adminNoticeBanner) {
    adminNoticeMore.addEventListener("click", () => {
      adminNoticeBanner.style.display = "none"
    })
  }

  // Initialize charts
  initializeCharts()

  // Simulate real-time balance updates
  setInterval(updateBalanceValue, 3000)
})

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
    balanceChange.textContent = `${newChangePercent >= 0 ? "+" : ""}${newChangePercent.toFixed(1)}% ($${Math.abs(newChangeAmount)}) `

    // Add back the LIVE indicator
    const liveIndicator = document.createElement("span")
    liveIndicator.className = "live-indicator"
    liveIndicator.textContent = "LIVE"
    balanceChange.appendChild(liveIndicator)

    // Update class based on positive/negative
    if (newChangePercent >= 0) {
      balanceChange.classList.remove("negative")
      balanceChange.classList.add("positive")
    } else {
      balanceChange.classList.remove("positive")
      balanceChange.classList.add("negative")
    }

    // Add highlight effect
    balanceValue.classList.add("highlight")
    setTimeout(() => {
      balanceValue.classList.remove("highlight")
    }, 1000)
  }
}

function initializeCharts() {
  // Define chart colors based on theme
  const isDarkTheme = document.body.classList.contains("dark-theme") || !document.body.classList.contains("light-theme")

  const chartColors = {
    primary: isDarkTheme ? "#4318FF" : "#4318FF",
    secondary: isDarkTheme ? "#A3AED0" : "#707EAE",
    grid: isDarkTheme ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    text: isDarkTheme ? "#A3AED0" : "#707EAE",
    bitcoin: "#F7931A",
    ethereum: "#627EEA",
    solana: "#14F195",
    cardano: "#0033AD",
    polkadot: "#E6007A",
  }

  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: isDarkTheme ? "#1C2237" : "#FFFFFF",
        titleColor: isDarkTheme ? "#FFFFFF" : "#2B3674",
        bodyColor: isDarkTheme ? "#A3AED0" : "#707EAE",
        borderColor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        bodyFont: {
          size: 12,
        },
        titleFont: {
          size: 14,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: chartColors.text,
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: chartColors.grid,
          borderDash: [5, 5],
        },
        ticks: {
          color: chartColors.text,
          font: {
            size: 10,
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 3,
      },
      line: {
        tension: 0.2,
      },
    },
  }

  // Generate random data for charts
  function generateData(count, min, max, trend = "up") {
    const data = []
    let value = Math.floor(Math.random() * (max - min) + min)

    for (let i = 0; i < count; i++) {
      if (trend === "up") {
        value += Math.floor(Math.random() * 10) - 3 // Trending up
      } else if (trend === "down") {
        value -= Math.floor(Math.random() * 10) - 3 // Trending down
      } else {
        value += Math.floor(Math.random() * 14) - 7 // Fluctuating
      }

      // Keep within range
      value = Math.max(min, Math.min(max, value))
      data.push(value)
    }

    return data
  }

  // Portfolio Chart
  const portfolioChartEl = document.getElementById("portfolio-chart")
  if (portfolioChartEl) {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const portfolioData = generateData(12, 30000, 45000, "up")

    new Chart(portfolioChartEl, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Portfolio Value",
            data: portfolioData,
            borderColor: chartColors.primary,
            backgroundColor: "rgba(67, 24, 255, 0.1)",
            fill: true,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      },
    })
  }

  // BTC Chart
  const btcChartEl = document.getElementById("btc-chart")
  if (btcChartEl) {
    const labels = ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h"]
    const btcData = generateData(12, 30000, 33000, "up")

    new Chart(btcChartEl, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Bitcoin Price",
            data: btcData,
            borderColor: chartColors.bitcoin,
            backgroundColor: "rgba(247, 147, 26, 0.1)",
            fill: true,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      },
    })
  }

  // ETH Chart
  const ethChartEl = document.getElementById("eth-chart")
  if (ethChartEl) {
    const labels = ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h"]
    const ethData = generateData(12, 1800, 2100, "down")

    new Chart(ethChartEl, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Ethereum Price",
            data: ethData,
            borderColor: chartColors.ethereum,
            backgroundColor: "rgba(98, 126, 234, 0.1)",
            fill: true,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      },
    })
  }

  // SOL Chart
  const solChartEl = document.getElementById("sol-chart")
  if (solChartEl) {
    const labels = ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h"]
    const solData = generateData(12, 75, 90, "up")

    new Chart(solChartEl, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Solana Price",
            data: solData,
            borderColor: chartColors.solana,
            backgroundColor: "rgba(20, 241, 149, 0.1)",
            fill: true,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      },
    })
  }

  // Portfolio Distribution Chart
  const portfolioDistributionChartEl = document.getElementById("portfolio-distribution-chart")
  if (portfolioDistributionChartEl) {
    new Chart(portfolioDistributionChartEl, {
      type: "doughnut",
      data: {
        labels: ["Bitcoin (BTC)", "Ethereum (ETH)", "Solana (SOL)", "Cardano (ADA)", "Others"],
        datasets: [
          {
            data: [45.7, 28.3, 15.2, 6.5, 4.3],
            backgroundColor: [
              chartColors.bitcoin,
              chartColors.ethereum,
              chartColors.solana,
              chartColors.cardano,
              chartColors.secondary,
            ],
            borderWidth: 0,
            hoverOffset: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: isDarkTheme ? "#1C2237" : "#FFFFFF",
            titleColor: isDarkTheme ? "#FFFFFF" : "#2B3674",
            bodyColor: isDarkTheme ? "#A3AED0" : "#707EAE",
            borderColor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}%`,
            },
          },
        },
      },
    })
  }

  // Market Trends Chart
  const marketTrendsChartEl = document.getElementById("market-trends-chart")
  if (marketTrendsChartEl) {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    new Chart(marketTrendsChartEl, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Bitcoin",
            data: generateData(12, 25000, 35000, "up"),
            borderColor: chartColors.bitcoin,
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Ethereum",
            data: generateData(12, 1500, 2500, "fluctuate"),
            borderColor: chartColors.ethereum,
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Solana",
            data: generateData(12, 50, 100, "up"),
            borderColor: chartColors.solana,
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Cardano",
            data: generateData(12, 0.3, 0.7, "fluctuate"),
            borderColor: chartColors.cardano,
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        ...commonOptions,
        plugins: {
          ...commonOptions.plugins,
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: {
              boxWidth: 12,
              color: chartColors.text,
              font: {
                size: 11,
              },
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
        },
      },
    })
  }

  // Mini Charts for Watchlist
  const miniChartEls = document.querySelectorAll(".mini-chart")
  miniChartEls.forEach((chartEl) => {
    const trend = chartEl.id.includes("eth-mini") ? "down" : "up"
    const coinColor = chartEl.id.includes("btc")
      ? chartColors.bitcoin
      : chartEl.id.includes("eth")
        ? chartColors.ethereum
        : chartEl.id.includes("sol")
          ? chartColors.solana
          : chartEl.id.includes("ada")
            ? chartColors.cardano
            : chartEl.id.includes("polkadot")

    const data = generateData(24, 50, 100, trend)

    new Chart(chartEl, {
      type: "line",
      data: {
        labels: Array(24).fill(""),
        datasets: [
          {
            data: data,
            borderColor: coinColor,
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
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
          tooltip: {
            enabled: false,
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

  // Simulate real-time price updates
  setInterval(simulatePriceUpdates, 5000)
}

function updateAllCharts() {
  // Destroy all existing charts
  Chart.helpers.each(Chart.instances, (instance) => {
    instance.destroy()
  })

  // Re-initialize charts with new theme colors
  initializeCharts()
}

function simulatePriceUpdates() {
  const prices = document.querySelectorAll(".watchlist-price .price")
  const changes = document.querySelectorAll(".watchlist-price .change")

  prices.forEach((price, index) => {
    // Get current price
    const currentPrice = Number.parseFloat(price.textContent.replace("$", "").replace(",", ""))

    // Apply small random change
    const change = (Math.random() * 2 - 1) * (currentPrice * 0.005) // ±0.5% change
    const newPrice = currentPrice + change

    // Format the new price
    price.textContent = "$" + newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    // Update the change percentage
    const changePercent = (change / currentPrice) * 100
    const changeElement = changes[index]
    changeElement.textContent = (changePercent >= 0 ? "+" : "") + changePercent.toFixed(1) + "%"

    // Update the class
    if (changePercent >= 0) {
      changeElement.classList.remove("negative")
      changeElement.classList.add("positive")
    } else {
      changeElement.classList.remove("positive")
      changeElement.classList.add("negative")
    }
  })

  // Update portfolio value with small random change
  const portfolioValue = document.querySelector(".portfolio-card .metric-value")
  if (portfolioValue) {
    const currentValue = Number.parseFloat(portfolioValue.textContent.replace("$", "").replace(",", ""))
    const change = (Math.random() * 2 - 1) * (currentValue * 0.002) // ±0.2% change
    const newValue = currentValue + change
    portfolioValue.textContent = "$" + newValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}
