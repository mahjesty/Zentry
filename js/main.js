// Common functionality across all pages
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const navList = document.querySelector(".nav-list")

  if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
      navList.classList.toggle("active")
      menuToggle.classList.toggle("active")
    })
  }

  // Password visibility toggle
  const passwordToggles = document.querySelectorAll(".password-toggle")

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const passwordInput = this.previousElementSibling
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)
      this.classList.toggle("show")
    })
  })

  // Sidebar toggle for dashboard
  const sidebarToggle = document.querySelector(".sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
    })
  }

  // Mobile sidebar toggle
  const mobileToggle = document.querySelector(".mobile-toggle")

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  }
})

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

function generateId(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let id = ""
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// Authentication functions
function checkAuth() {
  const userData = JSON.parse(localStorage.getItem("zentry_user") || "{}")

  // Check if user is logged in
  if (!userData.isLoggedIn) {
    // Redirect to login page if not on login, admin-login, or index page
    const currentPage = window.location.pathname.split("/").pop()
    if (
      currentPage !== "login.html" &&
      currentPage !== "admin-login.html" &&
      currentPage !== "index.html" &&
      currentPage !== "" &&
      currentPage !== "application.html" &&
      currentPage !== "status.html"
    ) {
      window.location.href = "login.html"
      return false
    }
  } else {
    // If user is logged in and trying to access login page, redirect to appropriate dashboard
    const currentPage = window.location.pathname.split("/").pop()
    if (currentPage === "login.html") {
      if (userData.role === "admin") {
        window.location.href = "admin-dashboard.html"
      } else {
        window.location.href = "dashboard.html"
      }
      return false
    }
  }

  return true
}

function logout() {
  // Clear user data
  localStorage.removeItem("zentry_user")

  // Show success message
  showToast("Logged out successfully", "success")

  // Redirect to login page
  window.location.href = "login.html"
}

// UI utility functions
function showToast(message, type = "info", title = "") {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector(".toast-container")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.className = "toast-container"
    document.body.appendChild(toastContainer)
  }

  // Create toast element
  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  // Create toast content
  let titleText = title
  if (!title) {
    switch (type) {
      case "success":
        titleText = "Success"
        break
      case "error":
        titleText = "Error"
        break
      case "warning":
        titleText = "Warning"
        break
      default:
        titleText = "Information"
    }
  }

  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${titleText}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">&times;</button>
  `

  // Add to container
  toastContainer.appendChild(toast)

  // Show toast
  setTimeout(() => {
    toast.classList.add("show")
  }, 10)

  // Add close event
  const closeBtn = toast.querySelector(".toast-close")
  closeBtn.addEventListener("click", () => {
    toast.classList.remove("show")
    setTimeout(() => {
      toastContainer.removeChild(toast)
    }, 300)
  })

  // Auto hide after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove("show")
      setTimeout(() => {
        if (toast.parentNode) {
          toastContainer.removeChild(toast)
        }
      }, 300)
    }
  }, 5000)
}

// Local storage helpers
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getFromStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

// Dummy functions to satisfy the linter.  These would normally be defined in a separate module.
function initApp() {
  console.log("initApp called")
}

function setupEventListeners() {
  console.log("setupEventListeners called")
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication first
  if (!checkAuth()) return

  // Initialize the application
  initApp()

  // Add event listeners
  setupEventListeners()
})
