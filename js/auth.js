document.addEventListener("DOMContentLoaded", () => {
  // Helper function to generate a unique ID
  function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Helper function to save data to localStorage
  function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  // Login form submission
  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const username = document.getElementById("username").value
      const password = document.getElementById("password").value

      // Simple validation
      if (!username || !password) {
        alert("Please enter both username and password.")
        return
      }

      // Simulate login API call
      const submitButton = this.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent

      submitButton.disabled = true
      submitButton.textContent = "Logging in..."

      // For demo purposes, accept any credentials
      setTimeout(() => {
        // Store user info in localStorage
        const user = {
          id: generateId(),
          username: username,
          name: "John Doe",
          email: "john.doe@example.com",
          role: "customer",
        }

        saveToStorage("currentUser", user)

        // Redirect to dashboard
        window.location.href = "dashboard.html"
      }, 1500)
    })
  }
})
