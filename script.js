function checkAuth() {
  const userData = JSON.parse(localStorage.getItem("zentry_user") || "{}")

  // Check if user is logged in
  if (!userData.isLoggedIn) {
    // Redirect to login page if not on login or index page
    const currentPage = window.location.pathname.split("/").pop()
    if (
      currentPage !== "login.html" &&
      currentPage !== "index.html" &&
      currentPage !== "" &&
      currentPage !== "application.html" &&
      currentPage !== "status.html"
    ) {
      window.location.href = "login.html"
      return false
    }
  } else {
    // If user is logged in and trying to access login page, redirect to dashboard
    const currentPage = window.location.pathname.split("/").pop()
    if (currentPage === "login.html") {
      window.location.href = "dashboard.html"
      return false
    }
  }

  return true
}

function showToast(message, type = "info") {
  // Remove existing toast if any
  const existingToast = document.querySelector(".toast")
  if (existingToast) {
    document.body.removeChild(existingToast)
  }

  // Create new toast
  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.innerHTML = message

  // Add to body
  document.body.appendChild(toast)

  // Show toast
  setTimeout(() => {
    toast.classList.add("show")
  }, 10)

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the application
  initApp()

  // Add event listeners
  setupEventListeners()
})

function initApp() {
  // Check authentication
  if (!checkAuth()) return

  // Set current date
  updateCurrentDate()

  // Load user data
  loadUserData()

  // Load account balances
  updateBalances()

  // Load transactions
  loadTransactions()
}

function setupEventListeners() {
  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (event) => {
    if (
      window.innerWidth <= 768 &&
      !event.target.closest(".sidebar") &&
      !event.target.closest("#sidebar-toggle") &&
      sidebar &&
      sidebar.classList.contains("active")
    ) {
      sidebar.classList.remove("active")
    }
  })

  // Add click events for action buttons
  const actionButtons = document.querySelectorAll(".action-button")
  actionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const action = this.querySelector(".action-text").textContent
      showToast(`${action} feature coming soon!`, "info")
    })
  })

  // Add logout event listener
  const logoutBtn = document.querySelector(".logout-icon")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }
}

function updateCurrentDate() {
  const dateElement = document.getElementById("current-date")
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  const currentDate = new Date().toLocaleDateString("en-US", options)

  if (dateElement) {
    dateElement.textContent = currentDate
  }
}

function loadUserData() {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("zentry_user") || "{}")

  if (!userData.isLoggedIn) return

  const userNameElement = document.getElementById("user-name")
  const userAvatarElement = document.querySelector(".avatar")

  if (userNameElement && userData.name) {
    userNameElement.textContent = userData.name.split(" ")[0]
  }

  if (userAvatarElement && userData.name) {
    userAvatarElement.textContent = userData.name.charAt(0).toUpperCase()
  }
}

function updateBalances() {
  // Simulate fetching balance data from an API
  const accounts = {
    main: {
      balance: 12456.78,
      trend: 2.4,
      trendDirection: "up",
    },
    savings: {
      balance: 45678.9,
      trend: 1.2,
      trendDirection: "up",
    },
  }

  // Update main account balance
  const mainBalanceElement = document.getElementById("main-balance")
  if (mainBalanceElement) {
    mainBalanceElement.textContent = formatCurrency(accounts.main.balance)
  }

  // Update savings account balance
  const savingsBalanceElement = document.getElementById("savings-balance")
  if (savingsBalanceElement) {
    savingsBalanceElement.textContent = formatCurrency(accounts.savings.balance)
  }

  // Simulate balance updates every 30 seconds
  setInterval(() => {
    // Show loading state
    if (mainBalanceElement) showLoading(mainBalanceElement)
    if (savingsBalanceElement) showLoading(savingsBalanceElement)

    // Random small fluctuations to simulate real-time updates
    setTimeout(() => {
      accounts.main.balance += (Math.random() - 0.3) * 10
      accounts.savings.balance += (Math.random() - 0.2) * 5

      if (mainBalanceElement) {
        mainBalanceElement.textContent = formatCurrency(accounts.main.balance)
        hideLoading(mainBalanceElement)
      }

      if (savingsBalanceElement) {
        savingsBalanceElement.textContent = formatCurrency(accounts.savings.balance)
        hideLoading(savingsBalanceElement)
      }
    }, 1000)
  }, 30000)
}

function loadTransactions() {
  // Simulate fetching transaction data from an API
  const transactions = [
    {
      description: "Grocery Store",
      date: "2025-05-06",
      category: "Shopping",
      amount: -82.45,
      status: "completed",
    },
    {
      description: "Salary Deposit",
      date: "2025-05-05",
      category: "Income",
      amount: 3500.0,
      status: "completed",
    },
    {
      description: "Electric Bill",
      date: "2025-05-04",
      category: "Utilities",
      amount: -145.3,
      status: "completed",
    },
    {
      description: "Restaurant",
      date: "2025-05-03",
      category: "Food",
      amount: -65.2,
      status: "completed",
    },
    {
      description: "Transfer to Savings",
      date: "2025-05-02",
      category: "Transfer",
      amount: -500.0,
      status: "completed",
    },
    {
      description: "Online Subscription",
      date: "2025-05-01",
      category: "Entertainment",
      amount: -14.99,
      status: "pending",
    },
  ]

  renderTransactions(transactions)
}

function renderTransactions(transactions) {
  const transactionsBody = document.getElementById("transactions-body")

  if (!transactionsBody) return

  // Clear existing transactions
  transactionsBody.innerHTML = ""

  // Add transactions to the table
  transactions.forEach((transaction) => {
    const row = document.createElement("tr")

    // Format the date
    const date = new Date(transaction.date)
    const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    // Determine amount class
    const amountClass = transaction.amount >= 0 ? "amount-positive" : "amount-negative"

    // Determine status class
    let statusClass = ""
    switch (transaction.status) {
      case "completed":
        statusClass = "status-completed"
        break
      case "pending":
        statusClass = "status-pending"
        break
      case "failed":
        statusClass = "status-failed"
        break
    }

    row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${formattedDate}</td>
            <td>${transaction.category}</td>
            <td class="transaction-amount ${amountClass}">${formatCurrency(transaction.amount)}</td>
            <td><span class="transaction-status ${statusClass}">${capitalizeFirstLetter(transaction.status)}</span></td>
        `

    transactionsBody.appendChild(row)
  })
}

// Helper Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Add logout function
function logout() {
  // Clear user data
  localStorage.removeItem("zentry_user")

  // Show success message
  showToast("Logged out successfully", "success")

  // Redirect to login page
  window.location.href = "login.html"
}

// Add loading state functions
function showLoading(element) {
  element.classList.add("loading")
}

function hideLoading(element) {
  element.classList.remove("loading")
}
