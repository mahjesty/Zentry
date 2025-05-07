/**
 * Zentry Banking - Main JavaScript
 * Global functionality shared across all pages
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize mobile menu
  initMobileMenu()

  // Initialize theme toggle
  initThemeToggle()

  // Initialize notifications
  initNotifications()

  // Initialize tooltips
  initTooltips()

  // Initialize modals
  initModals()

  // Initialize dropdown menus
  initDropdowns()

  // Check if user is logged in
  checkAuthStatus()
})

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
  const menuToggle = document.querySelector(".mobile-menu-toggle")
  const mobileMenu = document.querySelector(".mobile-menu")
  const closeMenu = document.querySelector(".mobile-menu-close")

  if (!menuToggle || !mobileMenu) return

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("open")
    document.body.style.overflow = "hidden"
  })

  if (closeMenu) {
    closeMenu.addEventListener("click", () => {
      mobileMenu.classList.remove("open")
      document.body.style.overflow = ""
    })
  }

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      mobileMenu &&
      mobileMenu.classList.contains("open") &&
      !mobileMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      mobileMenu.classList.remove("open")
      document.body.style.overflow = ""
    }
  })
}

/**
 * Theme Toggle Functionality
 */
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle")

  if (!themeToggle) return

  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark-mode")
    updateThemeToggle(true)
  }

  themeToggle.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode")
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
    updateThemeToggle(isDarkMode)
  })
}

/**
 * Update theme toggle button appearance
 */
function updateThemeToggle(isDarkMode) {
  const themeToggle = document.getElementById("themeToggle")
  if (!themeToggle) return

  const themeIcon = themeToggle.querySelector("i")
  const themeText = themeToggle.querySelector("span")

  if (isDarkMode) {
    themeIcon.classList.remove("fa-moon")
    themeIcon.classList.add("fa-sun")
    if (themeText) themeText.textContent = "Light Mode"
  } else {
    themeIcon.classList.remove("fa-sun")
    themeIcon.classList.add("fa-moon")
    if (themeText) themeText.textContent = "Dark Mode"
  }
}

/**
 * Notifications Functionality
 */
function initNotifications() {
  const notificationBell = document.querySelector(".notification-bell")
  const notificationPanel = document.getElementById("notificationPanel")
  const closeNotifications = document.querySelector(".close-notifications")

  if (!notificationBell || !notificationPanel) return

  notificationBell.addEventListener("click", (e) => {
    e.stopPropagation()
    notificationPanel.classList.toggle("open")
  })

  if (closeNotifications) {
    closeNotifications.addEventListener("click", () => {
      notificationPanel.classList.remove("open")
    })
  }

  // Close panel when clicking outside
  document.addEventListener("click", (event) => {
    if (
      notificationPanel &&
      notificationPanel.classList.contains("open") &&
      !notificationPanel.contains(event.target) &&
      !notificationBell.contains(event.target)
    ) {
      notificationPanel.classList.remove("open")
    }
  })

  // Mark notifications as read
  const markReadButtons = document.querySelectorAll(".mark-read")
  markReadButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation()
      const notificationItem = this.closest(".notification-item")
      notificationItem.classList.remove("unread")
      this.remove()

      // Update notification count
      updateNotificationCount()
    })
  })
}

/**
 * Update notification badge count
 */
function updateNotificationCount() {
  const unreadNotifications = document.querySelectorAll(".notification-item.unread")
  const notificationBadge = document.querySelector(".notification-badge")

  if (notificationBadge) {
    const count = unreadNotifications.length
    notificationBadge.textContent = count

    if (count === 0) {
      notificationBadge.style.display = "none"
    } else {
      notificationBadge.style.display = "flex"
    }
  }
}

/**
 * Tooltips Functionality
 */
function initTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]")

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const tooltipText = this.getAttribute("data-tooltip")

      const tooltip = document.createElement("div")
      tooltip.classList.add("tooltip")
      tooltip.textContent = tooltipText

      document.body.appendChild(tooltip)

      const elementRect = this.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()

      tooltip.style.top = `${elementRect.top - tooltipRect.height - 10}px`
      tooltip.style.left = `${elementRect.left + (elementRect.width / 2) - tooltipRect.width / 2}px`

      tooltip.classList.add("visible")

      this.addEventListener("mouseleave", function onMouseLeave() {
        tooltip.remove()
        this.removeEventListener("mouseleave", onMouseLeave)
      })
    })
  })
}

/**
 * Modal Functionality
 */
function initModals() {
  // Open modal buttons
  const modalTriggers = document.querySelectorAll("[data-modal]")

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const modalId = this.getAttribute("data-modal")
      const modal = document.getElementById(modalId)

      if (modal) {
        openModal(modal)
      }
    })
  })

  // Close modal buttons
  const closeButtons = document.querySelectorAll(".modal-close, [data-close-modal]")

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal")
      closeModal(modal)
    })
  })

  // Close modal when clicking outside
  const modals = document.querySelectorAll(".modal")

  modals.forEach((modal) => {
    modal.addEventListener("click", function (event) {
      if (event.target === this) {
        closeModal(this)
      }
    })
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openModal = document.querySelector(".modal.open")
      if (openModal) {
        closeModal(openModal)
      }
    }
  })
}

/**
 * Open a modal
 */
function openModal(modal) {
  modal.classList.add("open")
  document.body.style.overflow = "hidden"

  // Focus first input if exists
  const firstInput = modal.querySelector("input, button:not(.modal-close)")
  if (firstInput) {
    setTimeout(() => {
      firstInput.focus()
    }, 100)
  }
}

/**
 * Close a modal
 */
function closeModal(modal) {
  modal.classList.remove("open")
  document.body.style.overflow = ""
}

/**
 * Dropdown Menu Functionality
 */
function initDropdowns() {
  const dropdownTriggers = document.querySelectorAll(".dropdown-toggle")

  dropdownTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
      e.stopPropagation()
      const dropdown = this.nextElementSibling

      // Close all other dropdowns
      document.querySelectorAll(".dropdown-content.show").forEach((openDropdown) => {
        if (openDropdown !== dropdown) {
          openDropdown.classList.remove("show")
        }
      })

      // Toggle current dropdown
      dropdown.classList.toggle("show")
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-content.show").forEach((dropdown) => {
      dropdown.classList.remove("show")
    })
  })
}

/**
 * Check Authentication Status
 */
function checkAuthStatus() {
  // Check if user is logged in (e.g., by checking for auth token in localStorage)
  const authToken = localStorage.getItem("authToken")

  if (authToken) {
    // User is logged in
    document.querySelectorAll(".logged-out-only").forEach((element) => {
      element.style.display = "none"
    })

    document.querySelectorAll(".logged-in-only").forEach((element) => {
      element.style.display = ""
    })

    // Fetch user data if needed
    fetchUserData()
  } else {
    // User is not logged in
    document.querySelectorAll(".logged-in-only").forEach((element) => {
      element.style.display = "none"
    })

    document.querySelectorAll(".logged-out-only").forEach((element) => {
      element.style.display = ""
    })
  }
}

/**
 * Fetch User Data
 */
function fetchUserData() {
  // This would typically be an API call to get user data
  // For demo purposes, we'll just use mock data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/assets/avatar.jpg",
  }

  // Update UI with user data
  const userNameElements = document.querySelectorAll(".user-name")
  userNameElements.forEach((element) => {
    element.textContent = userData.name
  })

  const userAvatars = document.querySelectorAll(".avatar")
  userAvatars.forEach((avatar) => {
    avatar.src = userData.avatar
    avatar.alt = userData.name
  })
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

/**
 * Format date
 */
function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date))
}

/**
 * Show toast notification
 */
function showToast(message, type = "info", duration = 3000) {
  const toast = document.createElement("div")
  toast.classList.add("toast", `toast-${type}`)

  const icon = document.createElement("i")

  switch (type) {
    case "success":
      icon.className = "fas fa-check-circle"
      break
    case "error":
      icon.className = "fas fa-exclamation-circle"
      break
    case "warning":
      icon.className = "fas fa-exclamation-triangle"
      break
    default:
      icon.className = "fas fa-info-circle"
  }

  toast.appendChild(icon)

  const messageSpan = document.createElement("span")
  messageSpan.textContent = message
  toast.appendChild(messageSpan)

  // Add close button
  const closeBtn = document.createElement("button")
  closeBtn.className = "toast-close"
  closeBtn.innerHTML = "&times;"
  closeBtn.addEventListener("click", () => {
    toast.remove()
  })

  toast.appendChild(closeBtn)

  // Add to DOM
  const toastContainer = document.querySelector(".toast-container")
  if (!toastContainer) {
    const newToastContainer = document.createElement("div")
    newToastContainer.className = "toast-container"
    document.body.appendChild(newToastContainer)
    newToastContainer.appendChild(toast)
  } else {
    toastContainer.appendChild(toast)
  }

  // Auto remove after duration
  setTimeout(() => {
    toast.classList.add("toast-hiding")
    setTimeout(() => {
      toast.remove()
    }, 300)
  }, duration)
}

/**
 * Handle form validation
 */
function validateForm(form) {
  let isValid = true
  const inputs = form.querySelectorAll("input, select, textarea")

  inputs.forEach((input) => {
    if (input.hasAttribute("required") && !input.value.trim()) {
      markInvalid(input, "This field is required")
      isValid = false
    } else if (input.type === "email" && input.value && !isValidEmail(input.value)) {
      markInvalid(input, "Please enter a valid email address")
      isValid = false
    } else if (input.pattern && input.value && !new RegExp(input.pattern).test(input.value)) {
      markInvalid(input, input.dataset.errorMessage || "Please match the requested format")
      isValid = false
    } else {
      markValid(input)
    }
  })

  return isValid
}

/**
 * Mark form field as invalid
 */
function markInvalid(input, message) {
  input.classList.add("invalid")

  // Remove existing error message if any
  const existingError = input.parentElement.querySelector(".error-message")
  if (existingError) {
    existingError.remove()
  }

  // Add error message
  const errorMessage = document.createElement("div")
  errorMessage.className = "error-message"
  errorMessage.textContent = message
  input.parentElement.appendChild(errorMessage)

  // Add input event to remove error on input
  input.addEventListener("input", function removeError() {
    input.classList.remove("invalid")
    const error = input.parentElement.querySelector(".error-message")
    if (error) {
      error.remove()
    }
    input.removeEventListener("input", removeError)
  })
}

/**
 * Mark form field as valid
 */
function markValid(input) {
  input.classList.remove("invalid")
  const error = input.parentElement.querySelector(".error-message")
  if (error) {
    error.remove()
  }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

/**
 * Handle logout
 */
function handleLogout() {
  // Clear auth token
  localStorage.removeItem("authToken")

  // Redirect to login page
  window.location.href = "login.html"
}

// Add event listener to logout buttons
document.addEventListener("DOMContentLoaded", () => {
  const logoutButtons = document.querySelectorAll("#logoutBtn, .logout-btn")

  logoutButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      handleLogout()
    })
  })
})
