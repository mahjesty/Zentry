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

  // Setup interactive elements
  setupInteractiveElements()

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

// Enhanced Portfolio Distribution Chart
function initializePortfolioDistributionChart() {
  const portfolioDistributionChartEl = document.getElementById("portfolio-distribution-chart")
  if (portfolioDistributionChartEl) {
    const isDarkTheme =
      document.body.classList.contains("dark-theme") || !document.body.classList.contains("light-theme")

    const chartColors = {
      bitcoin: "#F7931A",
      ethereum: "#627EEA",
      solana: "#14F195",
      cardano: "#0033AD",
      others: isDarkTheme ? "#A3AED0" : "#707EAE",
    }

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
              chartColors.others,
            ],
            borderWidth: 0,
            hoverOffset: 10,
            borderRadius: 4,
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
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                const value = context.raw
                const total = context.dataset.data.reduce((acc, data) => acc + data, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                const assetValue = ((45287.65 * value) / 100).toFixed(2)
                return `${context.label}: ${percentage}% ($${assetValue})`
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    })
  }
}

// Enhanced Market Trends Chart
function initializeMarketTrendsChart() {
  const marketTrendsChartEl = document.getElementById("market-trends-chart")
  if (marketTrendsChartEl) {
    const isDarkTheme =
      document.body.classList.contains("dark-theme") || !document.body.classList.contains("light-theme")

    const chartColors = {
      grid: isDarkTheme ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
      text: isDarkTheme ? "#A3AED0" : "#707EAE",
      bitcoin: "#F7931A",
      ethereum: "#627EEA",
      solana: "#14F195",
    }

    // Generate dates for the last 30 days
    const dates = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      dates.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
    }

    // Generate more realistic price data with trends
    const generateTrendData = (startPrice, volatility, trend) => {
      const data = []
      let price = startPrice

      for (let i = 0; i < 30; i++) {
        // Add some randomness but follow the trend
        const change = (Math.random() * 2 - 1) * volatility
        const trendFactor = trend === "up" ? 0.2 : trend === "down" ? -0.2 : 0

        price = price * (1 + (change + trendFactor) / 100)
        data.push(price)
      }

      return data
    }

    const btcData = generateTrendData(30000, 3, "up")
    const ethData = generateTrendData(1900, 4, "down")
    const solData = generateTrendData(80, 6, "up")

    const chart = new Chart(marketTrendsChartEl, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Bitcoin",
            data: btcData,
            borderColor: chartColors.bitcoin,
            backgroundColor: `${chartColors.bitcoin}10`,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: "Ethereum",
            data: ethData,
            borderColor: chartColors.ethereum,
            backgroundColor: `${chartColors.ethereum}10`,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: "Solana",
            data: solData,
            borderColor: chartColors.solana,
            backgroundColor: `${chartColors.solana}10`,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
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
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                const value = context.raw.toFixed(2)
                return `${context.dataset.label}: $${value}`
              },
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
              maxRotation: 0,
              maxTicksLimit: 6,
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
              callback: (value) => `$${value.toLocaleString()}`,
            },
          },
        },
        animations: {
          tension: {
            duration: 1000,
            easing: "easeOutQuart",
            from: 0.4,
            to: 0.4,
          },
        },
      },
    })

    // Add event listeners for the toggle buttons
    const toggleInputs = document.querySelectorAll(".toggle-input")
    toggleInputs.forEach((input, index) => {
      if (index < chart.data.datasets.length) {
        input.addEventListener("change", function () {
          const dataset = chart.data.datasets[index]
          dataset.hidden = !this.checked
          chart.update()
        })
      }
    })

    // Add event listeners for view options
    const viewOptions = document.querySelectorAll(".view-option")
    viewOptions.forEach((option) => {
      option.addEventListener("click", function () {
        viewOptions.forEach((opt) => opt.classList.remove("active"))
        this.classList.add("active")

        const view = this.getAttribute("data-view")

        // Simulate changing the data based on the view
        if (view === "volume") {
          chart.data.datasets.forEach((dataset, index) => {
            // Generate volume data (different pattern than price)
            dataset.data = generateTrendData(index === 0 ? 5000 : index === 1 ? 3000 : 1500, 8, "fluctuate")
          })
          chart.options.scales.y.ticks.callback = (value) => `${value.toLocaleString()} BTC`
        } else if (view === "market-cap") {
          chart.data.datasets.forEach((dataset, index) => {
            // Generate market cap data (larger numbers)
            dataset.data = generateTrendData(index === 0 ? 600000 : index === 1 ? 250000 : 50000, 2, "up")
          })
          chart.options.scales.y.ticks.callback = (value) => `$${(value / 1000).toLocaleString()}K`
        } else {
          // Reset to price data
          chart.data.datasets[0].data = btcData
          chart.data.datasets[1].data = ethData
          chart.data.datasets[2].data = solData
          chart.options.scales.y.ticks.callback = (value) => `$${value.toLocaleString()}`
        }

        chart.update()
      })
    })
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

  // ADA Chart
  const adaChartEl = document.getElementById("ada-chart")
  if (adaChartEl) {
    const labels = ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h"]
    const adaData = generateData(12, 0.45, 0.55, "up")

    new Chart(adaChartEl, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Cardano Price",
            data: adaData,
            borderColor: chartColors.cardano,
            backgroundColor: "rgba(0, 51, 173, 0.1)",
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

  // Initialize our enhanced charts
  initializePortfolioDistributionChart()
  initializeMarketTrendsChart()

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
              ? chartColors.polkadot
              : chartColors.primary

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

// Add this to the setupInteractiveElements function
function setupQuickActionTabs() {
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Show corresponding tab content
      const tabName = this.getAttribute("data-tab")
      tabContents.forEach((content) => {
        if (content.getAttribute("data-tab-content") === tabName) {
          content.style.display = "grid"

          // Add entrance animation
          content.style.opacity = "0"
          content.style.transform = "translateY(10px)"

          setTimeout(() => {
            content.style.opacity = "1"
            content.style.transform = "translateY(0)"
            content.style.transition = "opacity 0.3s ease, transform 0.3s ease"
          }, 50)
        } else {
          content.style.display = "none"
        }
      })
    })
  })

  // Add hover effects for quick actions
  const quickActions = document.querySelectorAll(".quick-action")
  quickActions.forEach((action) => {
    action.addEventListener("mouseenter", function () {
      // Add subtle animation
      this.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"

      // Get the icon element
      const icon = this.querySelector(".quick-action-icon")
      if (icon) {
        icon.style.transform = "scale(1.1)"
      }
    })

    action.addEventListener("mouseleave", function () {
      const icon = this.querySelector(".quick-action-icon")
      if (icon) {
        icon.style.transform = ""
      }
    })

    // Add click effect
    action.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span")
      ripple.classList.add("ripple-effect")

      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  // Customize button functionality
  const customizeButton = document.querySelector(".customize-button")
  if (customizeButton) {
    customizeButton.addEventListener("click", () => {
      // In a real app, this would open a modal for customization
      alert("This would open a customization modal in a real application.")
    })
  }
}

// Add event listeners for interactive elements
function setupInteractiveElements() {
  // Portfolio distribution dropdown
  const dropdownItems = document.querySelectorAll(".dropdown-item")
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      const dropdownButton = this.closest(".dropdown-wrapper").querySelector(".btn-dropdown span")
      dropdownButton.textContent = this.textContent

      dropdownItems.forEach((i) => i.classList.remove("active"))
      this.classList.add("active")

      // Simulate data change
      const portfolioDistributionChart = Chart.getChart("portfolio-distribution-chart")
      if (portfolioDistributionChart) {
        // Slightly modify the data based on the selected timeframe
        const newData = [...portfolioDistributionChart.data.datasets[0].data]
        for (let i = 0; i < newData.length; i++) {
          newData[i] = newData[i] * (0.9 + Math.random() * 0.2)
        }

        portfolioDistributionChart.data.datasets[0].data = newData
        portfolioDistributionChart.update()
      }
    })
  })

  // Market trends time period switches
  const switchItems = document.querySelectorAll(".switch-item")
  switchItems.forEach((item) => {
    item.addEventListener("click", function () {
      switchItems.forEach((i) => i.classList.remove("active"))
      this.classList.add("active")

      // Simulate data change
      const marketTrendsChart = Chart.getChart("market-trends-chart")
      if (marketTrendsChart) {
        // Generate new data with different patterns based on time period
        const timePeriod = this.textContent
        let dataPoints
        let labels

        switch (timePeriod) {
          case "1D":
            dataPoints = 24
            labels = Array.from({ length: dataPoints }, (_, i) => `${i}:00`)
            break
          case "1W":
            dataPoints = 7
            labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            break
          case "1M":
            dataPoints = 30
            labels = Array.from({ length: dataPoints }, (_, i) => `Day ${i + 1}`)
            break
          case "3M":
            dataPoints = 12
            labels = [
              "Week 1",
              "Week 2",
              "Week 3",
              "Week 4",
              "Week 5",
              "Week 6",
              "Week 7",
              "Week 8",
              "Week 9",
              "Week 10",
              "Week 11",
              "Week 12",
            ]
            break
          case "1Y":
            dataPoints = 12
            labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            break
          case "All":
            dataPoints = 5
            labels = ["2019", "2020", "2021", "2022", "2023"]
            break
          default:
            dataPoints = 30
            labels = Array.from({ length: dataPoints }, (_, i) => `Day ${i + 1}`)
        }

        // Update chart data and labels
        marketTrendsChart.data.labels = labels

        marketTrendsChart.data.datasets.forEach((dataset, index) => {
          let startPrice, volatility, trend

          if (index === 0) {
            // BTC
            startPrice = 30000
            volatility = timePeriod === "1D" ? 1 : timePeriod === "1W" ? 3 : 5
            trend = "up"
          } else if (index === 1) {
            // ETH
            startPrice = 1900
            volatility = timePeriod === "1D" ? 1.5 : timePeriod === "1W" ? 4 : 6
            trend = "down"
          } else {
            // SOL
            startPrice = 80
            volatility = timePeriod === "1D" ? 2 : timePeriod === "1W" ? 5 : 8
            trend = "up"
          }

          // Generate trend data
          const data = []
          let price = startPrice

          for (let i = 0; i < dataPoints; i++) {
            const change = (Math.random() * 2 - 1) * volatility
            const trendFactor = trend === "up" ? 0.2 : trend === "down" ? -0.2 : 0

            price = price * (1 + (change + trendFactor) / 100)
            data.push(price)
          }

          dataset.data = data
        })

        marketTrendsChart.update()
      }
    })
  })

  // Distribution action buttons
  const actionButtons = document.querySelectorAll(".action-button")
  actionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Add a subtle animation effect
      this.classList.add("clicked")
      setTimeout(() => {
        this.classList.remove("clicked")
      }, 300)

      // Show a toast or notification (if we had one)
      alert(`Action: ${this.textContent.trim()} - This would open a modal in a real application.`)
    })
  })

  // Setup quick action tabs
  setupQuickActionTabs()
}
