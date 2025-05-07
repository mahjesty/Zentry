document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const userData = JSON.parse(localStorage.getItem("zentry_user") || "{}")

  if (!userData.isLoggedIn) {
    // Redirect to login page if not logged in
    window.location.href = "login.html"
    return
  }

  // Set user name and avatar
  const userNameElement = document.getElementById("user-name")
  const userAvatarElement = document.getElementById("user-avatar")

  if (userNameElement && userData.name) {
    userNameElement.textContent = userData.name
  }

  if (userAvatarElement && userData.name) {
    userAvatarElement.textContent = userData.name.charAt(0).toUpperCase()
  }

  // Set current date
  const currentDateElement = document.getElementById("current-date")
  if (currentDateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const currentDate = new Date().toLocaleDateString("en-US", options)
    currentDateElement.textContent = currentDate
  }

  // Mobile sidebar toggle
  const mobileSidebarToggle = document.querySelector(".mobile-sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")

  if (mobileSidebarToggle && sidebar) {
    mobileSidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })

    // Close sidebar when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !sidebar.contains(event.target) &&
        !mobileSidebarToggle.contains(event.target) &&
        sidebar.classList.contains("active")
      ) {
        sidebar.classList.remove("active")
      }
    })
  }

  // Logout functionality
  const logoutLink = document.getElementById("logout-link")
  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault()

      // Clear user data
      localStorage.removeItem("zentry_user")

      // Redirect to login page
      window.location.href = "login.html"
    })
  }

  // Load account balances
  loadAccountBalances()

  // Load transactions
  loadTransactions()

  // Handle transfer form submission
  const transferForm = document.getElementById("transfer-form")
  if (transferForm) {
    transferForm.addEventListener("submit", (event) => {
      event.preventDefault()

      const amount = Number.parseFloat(document.getElementById("transfer-amount").value)
      const recipient = document.getElementById("transfer-recipient").value
      const note = document.getElementById("transfer-note").value

      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.")
        return
      }

      // In a real application, this would be an API call to process the transfer
      // For demo purposes, we'll just simulate a successful transfer

      // Create a new transaction
      const newTransaction = {
        description: `Transfer to ${recipient}`,
        date: new Date().toISOString().split("T")[0],
        category: "Transfer",
        amount: -amount,
        status: "completed",
        note: note,
      }

      // Add to transactions
      const transactions = JSON.parse(localStorage.getItem("zentry_transactions") || "[]")
      transactions.unshift(newTransaction)
      localStorage.setItem("zentry_transactions", JSON.stringify(transactions))

      // Update account balance
      const mainBalance = Number.parseFloat(localStorage.getItem("zentry_main_balance") || "12456.78")
      localStorage.setItem("zentry_main_balance", (mainBalance - amount).toFixed(2))

      // Reload data
      loadAccountBalances()
      loadTransactions()

      // Reset form
      transferForm.reset()

      // Show success message
      alert(`Successfully transferred $${amount.toFixed(2)} to ${recipient}.`)
    })
  }
})

function loadAccountBalances() {
  // In a real application, this would be an API call to get account balances
  // For demo purposes, we'll use localStorage or default values

  const mainBalanceElement = document.getElementById("main-balance")
  const savingsBalanceElement = document.getElementById("savings-balance")

  // Get balances from localStorage or use defaults
  const mainBalance = Number.parseFloat(localStorage.getItem("zentry_main_balance") || "12456.78")
  const savingsBalance = Number.parseFloat(localStorage.getItem("zentry_savings_balance") || "45678.90")

  // Update UI
  if (mainBalanceElement) {
    mainBalanceElement.textContent = formatCurrency(mainBalance)
  }

  if (savingsBalanceElement) {
    savingsBalanceElement.textContent = formatCurrency(savingsBalance)
  }
}

function loadTransactions() {
  const transactionsBody = document.getElementById("transactions-body")
  if (!transactionsBody) return

  // Clear existing transactions
  transactionsBody.innerHTML = ""

  // Get transactions from localStorage or use defaults
  let transactions = JSON.parse(localStorage.getItem("zentry_transactions") || "[]")

  // If no transactions exist, create some dummy data
  if (transactions.length === 0) {
    transactions = [
      {
        description: "Grocery Store",
        date: "2023-05-06",
        category: "Shopping",
        amount: -82.45,
        status: "completed",
      },
      {
        description: "Salary Deposit",
        date: "2023-05-05",
        category: "Income",
        amount: 3500.0,
        status: "completed",
      },
      {
        description: "Electric Bill",
        date: "2023-05-04",
        category: "Utilities",
        amount: -145.3,
        status: "completed",
      },
      {
        description: "Restaurant",
        date: "2023-05-03",
        category: "Food",
        amount: -65.2,
        status: "completed",
      },
      {
        description: "Transfer to Savings",
        date: "2023-05-02",
        category: "Transfer",
        amount: -500.0,
        status: "completed",
      },
      {
        description: "Online Subscription",
        date: "2023-05-01",
        category: "Entertainment",
        amount: -14.99,
        status: "pending",
      },
    ]

    // Save to localStorage
    localStorage.setItem("zentry_transactions", JSON.stringify(transactions))
  }

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
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

  if (!currentUser.id) {
    // Redirect to login page if not logged in
    window.location.href = "login.html"
    return
  }

  // Set user name and avatar
  const userNameElement = document.getElementById("userName")
  const userAvatarElement = document.getElementById("userAvatar")

  if (userNameElement && currentUser.name) {
    userNameElement.textContent = currentUser.name
  }

  if (userAvatarElement && currentUser.name) {
    userAvatarElement.textContent = currentUser.name.charAt(0)
  }

  // Sidebar toggle
  const sidebarToggle = document.querySelector(".sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")

  if (sidebarToggle && sidebar && mainContent) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
    })
  }

  // Mobile sidebar toggle
  const mobileSidebarToggle = document.querySelector(".mobile-sidebar-toggle")

  if (mobileSidebarToggle && sidebar) {
    mobileSidebarToggle.addEventListener("click", () => {
      sidebar.classList.add("active")
    })

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (event) => {
      if (
        window.innerWidth <= 768 &&
        !sidebar.contains(event.target) &&
        !mobileSidebarToggle.contains(event.target) &&
        sidebar.classList.contains("active")
      ) {
        sidebar.classList.remove("active")
      }
    })
  }

  // Logout functionality
  const logoutBtn = document.querySelector(".logout-btn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Clear user data
      localStorage.removeItem("currentUser")

      // Redirect to login page
      window.location.href = "login.html"
    })
  }

  // Load account data
  loadAccountData()

  // Load transactions
  loadTransactions2()

  // Load spending summary
  loadSpendingSummary()

  // Period selector for spending summary
  const periodButtons = document.querySelectorAll(".period-btn")

  if (periodButtons.length > 0) {
    periodButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        periodButtons.forEach((btn) => btn.classList.remove("active"))

        // Add active class to clicked button
        this.classList.add("active")

        // Update spending summary based on selected period
        loadSpendingSummary(this.dataset.period)
      })
    })
  }
})

// Load account data
function loadAccountData() {
  // In a real application, this would fetch data from an API
  // For demo purposes, we'll use dummy data

  const accounts = [
    {
      id: "acc-1",
      type: "Checking Account",
      number: "**** **** **** 4567",
      balance: 5432.1,
    },
    {
      id: "acc-2",
      type: "Savings Account",
      number: "**** **** **** 7890",
      balance: 12345.67,
    },
  ]

  // Update account balances
  accounts.forEach((account) => {
    const balanceElement = document.getElementById(`${account.id}-balance`)

    if (balanceElement) {
      balanceElement.textContent = formatCurrency2(account.balance)
    }
  })
}

// Load transactions
function loadTransactions2() {
  // In a real application, this would fetch data from an API
  // For demo purposes, we'll use dummy data

  const transactions = [
    {
      id: "tx-1",
      date: "2023-05-10",
      description: "Grocery Store",
      amount: -85.42,
      status: "completed",
    },
    {
      id: "tx-2",
      date: "2023-05-09",
      description: "Salary Deposit",
      amount: 3500.0,
      status: "completed",
    },
    {
      id: "tx-3",
      date: "2023-05-08",
      description: "Electric Bill",
      amount: -124.56,
      status: "completed",
    },
    {
      id: "tx-4",
      date: "2023-05-07",
      description: "Restaurant",
      amount: -45.8,
      status: "completed",
    },
    {
      id: "tx-5",
      date: "2023-05-06",
      description: "Online Shopping",
      amount: -65.99,
      status: "pending",
    },
  ]

  const transactionsTableBody = document.getElementById("transactionsTableBody")

  if (transactionsTableBody) {
    // Clear existing rows
    transactionsTableBody.innerHTML = ""

    // Add transaction rows
    transactions.forEach((transaction) => {
      const row = document.createElement("tr")

      // Format date
      const date = new Date(transaction.date)
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })

      // Determine amount class
      const amountClass = transaction.amount >= 0 ? "text-success" : "text-danger"

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
        <td class="${amountClass}">${formatCurrency2(transaction.amount)}</td>
        <td><span class="transaction-status ${statusClass}">${transaction.status}</span></td>
      `

      transactionsTableBody.appendChild(row)
    })
  }
}

// Load spending summary
function loadSpendingSummary(period = "month") {
  // In a real application, this would fetch data from an API
  // For demo purposes, we'll use dummy data

  const categories = [
    {
      name: "Food & Dining",
      icon: "food",
      amount: 450.75,
      percentage: 30,
    },
    {
      name: "Shopping",
      icon: "shopping",
      amount: 320.5,
      percentage: 20,
    },
    {
      name: "Bills & Utilities",
      icon: "bills",
      amount: 250.3,
      percentage: 15,
    },
    {
      name: "Transportation",
      icon: "transportation",
      amount: 180.25,
      percentage: 12,
    },
  ]

  const spendingCategoriesContainer = document.getElementById("spendingCategories")

  if (spendingCategoriesContainer) {
    // Clear existing categories
    spendingCategoriesContainer.innerHTML = ""

    // Add category items
    categories.forEach((category) => {
      const categoryItem = document.createElement("div")
      categoryItem.className = "category-item"

      categoryItem.innerHTML = `
        <div class="category-icon ${category.icon}"></div>
        <div class="category-details">
          <span class="category-name">${category.name}</span>
          <span class="category-amount">${formatCurrency2(category.amount)}</span>
        </div>
        <div class="category-bar">
          <div class="category-progress" style="width: ${category.percentage}%"></div>
        </div>
      `

      spendingCategoriesContainer.appendChild(categoryItem)
    })
  }
}

// Format currency
function formatCurrency2(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}
