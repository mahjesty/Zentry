document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const userData = JSON.parse(localStorage.getItem("zentry_user") || "{}")
  if (userData.isLoggedIn) {
    // Redirect to dashboard if already logged in
    window.location.href = "dashboard.html"
    return
  }

  const loginForm = document.getElementById("login-form")

  if (loginForm) {
    // Add loading state to button
    const submitButton = loginForm.querySelector('button[type="submit"]')

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault()

      const email = document.getElementById("email").value.trim()
      const password = document.getElementById("password").value

      // Simple validation
      if (!email || !password) {
        showToast("Please enter both email and password.", "error")
        return
      }

      // Show loading state
      submitButton.disabled = true
      submitButton.innerHTML = '<span class="loading-spinner"></span> Logging in...'

      // In a real application, this would be an API call to authenticate the user
      // For demo purposes, we'll just simulate a successful login with a delay
      setTimeout(() => {
        // Store user info in localStorage
        const userData = {
          email: email,
          name: email.split("@")[0], // Extract name from email for demo
          isLoggedIn: true,
          role: "user",
          lastLogin: new Date().toISOString(),
        }

        localStorage.setItem("zentry_user", JSON.stringify(userData))

        // Show success message
        showToast("Login successful! Redirecting...", "success")

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "dashboard.html"
        }, 1000)
      }, 1500)
    })
  }

  // Toast notification function
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
})
