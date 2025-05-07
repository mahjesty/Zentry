document.addEventListener("DOMContentLoaded", () => {
  const adminLoginForm = document.getElementById("admin-login-form")

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (event) => {
      event.preventDefault()

      const email = document.getElementById("email").value.trim()
      const password = document.getElementById("password").value

      // Simple validation
      if (!email || !password) {
        alert("Please enter both email and password.")
        return
      }

      // In a real application, this would be an API call to authenticate the admin
      // For demo purposes, we'll just simulate a successful login

      // Store admin info in localStorage
      const adminData = {
        email: email,
        name: email.split("@")[0], // Extract name from email for demo
        isLoggedIn: true,
        role: "admin",
      }

      localStorage.setItem("zentry_user", JSON.stringify(adminData))

      // Redirect to admin dashboard
      window.location.href = "admin-dashboard.html"
    })
  }
})
