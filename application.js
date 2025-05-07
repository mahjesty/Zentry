document.addEventListener("DOMContentLoaded", () => {
  const applicationForm = document.getElementById("application-form")
  const applicationFormContainer = document.getElementById("application-form-container")
  const successMessage = document.getElementById("success-message")
  const applicationIdElement = document.getElementById("application-id")

  // Check if user already has a pending application
  const hasApplication = localStorage.getItem("zentry_application_submitted")
  const applicationStatus = localStorage.getItem("zentry_application_status")

  if (hasApplication && applicationStatus !== "rejected") {
    // Redirect to status page if they already have an application
    window.location.href = "status.html"
  }

  if (applicationForm) {
    applicationForm.addEventListener("submit", (event) => {
      event.preventDefault()

      // Get form data
      const formData = new FormData(applicationForm)
      const applicationData = {}

      for (const [key, value] of formData.entries()) {
        applicationData[key] = value
      }

      // Generate application ID (format: APP-DOB-XXX)
      const dob = new Date(applicationData.dob)
      const dobFormatted = `${dob.getFullYear()}${String(dob.getMonth() + 1).padStart(2, "0")}${String(dob.getDate()).padStart(2, "0")}`
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
      const applicationId = `APP-${dobFormatted}-${randomNum}`

      // Store application data in localStorage
      applicationData.id = applicationId
      applicationData.status = "review"
      applicationData.submissionDate = new Date().toISOString()

      localStorage.setItem("zentry_application_data", JSON.stringify(applicationData))
      localStorage.setItem("zentry_application_submitted", "true")
      localStorage.setItem("zentry_application_status", "review")

      // Display success message
      applicationIdElement.textContent = applicationId
      applicationFormContainer.style.display = "none"
      successMessage.style.display = "block"

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
})
