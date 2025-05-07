document.addEventListener("DOMContentLoaded", () => {
  // Helper function to generate a unique ID
  function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Helper function to save data to localStorage
  function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  // Admin login form submission
  const adminLoginForm = document.getElementById("adminLoginForm")

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const username = document.getElementById("adminUsername").value
      const password = document.getElementById("adminPassword").value

      // Simple validation
      if (!username || !password) {
        alert("Please enter both admin ID and password.")
        return
      }

      // Simulate login API call
      const submitButton = this.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent

      submitButton.disabled = true
      submitButton.textContent = "Logging in..."

      // For demo purposes, accept any credentials
      setTimeout(() => {
        // Store admin info in localStorage
        const admin = {
          id: generateId(),
          username: username,
          name: "Admin User",
          email: "admin@zentrybank.com",
          role: "admin",
        }

        saveToStorage("currentAdmin", admin)

        // Redirect to admin dashboard
        window.location.href = "admin-dashboard.html"
      }, 1500)
    })
  }
})
