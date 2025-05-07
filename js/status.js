document.addEventListener("DOMContentLoaded", () => {
  // Helper function to get data from localStorage
  function getFromStorage(key) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  // Status check form
  const statusCheckForm = document.getElementById("statusCheckForm")
  const statusResult = document.getElementById("statusResult")
  const statusBadge = document.getElementById("status-badge")
  const statusApplicationId = document.getElementById("status-application-id")
  const statusMessage = document.getElementById("status-message")
  const submissionDate = document.getElementById("submission-date")
  const completionDate = document.getElementById("completion-date")

  // Check if user already has a pending application
  const hasApplication = localStorage.getItem("zentry_application_submitted")
  const applicationData = JSON.parse(localStorage.getItem("zentry_application_data") || "{}")

  // Auto-fill the form if they have an application
  if (hasApplication && applicationData.id) {
    const applicationIdInput = document.getElementById("applicationId")
    if (applicationIdInput) {
      applicationIdInput.value = applicationData.id
    }

    // Automatically submit the form
    if (statusCheckForm) {
      statusCheckForm.dispatchEvent(new Event("submit"))
    }
  }

  if (statusCheckForm) {
    statusCheckForm.addEventListener("submit", (event) => {
      event.preventDefault()

      const applicationId = document.getElementById("applicationId").value.trim()

      if (!applicationId) {
        alert("Please enter your application ID.")
        return
      }

      // Get applications from localStorage
      const applications = getFromStorage("applications") || []
      const application = applications.find((app) => app.id === applicationId)

      // Reset status result classes
      statusResult.classList.remove("active", "success", "error", "pending")

      if (!application) {
        // Application not found
        statusResult.classList.add("active", "error")
        document.getElementById("statusTitle").textContent = "Application Not Found"
        document.getElementById("statusMessage").textContent =
          "We could not find an application with the provided ID. Please check the ID and try again."
        document.getElementById("statusDetails").style.display = "none"
        document.getElementById("statusTimeline").style.display = "none"
      } else {
        // Application found
        statusResult.classList.add("active")

        // Set status class based on application status
        if (application.status === "approved") {
          statusResult.classList.add("success")
        } else if (application.status === "rejected") {
          statusResult.classList.add("error")
        } else {
          statusResult.classList.add("pending")
        }

        // Update status information
        document.getElementById("statusTitle").textContent = `Application ${application.id}`

        let statusMessage = ""
        switch (application.status) {
          case "approved":
            statusMessage =
              "Congratulations! Your application has been approved. You will receive further instructions via email shortly."
            break
          case "rejected":
            statusMessage =
              "We regret to inform you that your application has been rejected. Please contact our support team for more information."
            break
          default:
            statusMessage =
              "Your application is currently under review. This process typically takes 3-5 business days."
        }

        document.getElementById("statusMessage").textContent = statusMessage

        // Show details section
        document.getElementById("statusDetails").style.display = "block"

        // Format application date
        const appDate = new Date(application.date)
        document.getElementById("applicationDate").textContent = appDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })

        // Calculate estimated completion date (5 business days from submission)
        const estCompletionDate = new Date(appDate)
        estCompletionDate.setDate(estCompletionDate.getDate() + 5)
        document.getElementById("estimatedCompletion").textContent = estCompletionDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })

        // Show timeline section
        const timelineContainer = document.getElementById("statusTimeline")
        timelineContainer.style.display = "block"
        timelineContainer.innerHTML = ""

        // Add timeline items
        if (application.updates && application.updates.length > 0) {
          application.updates.forEach((update) => {
            const updateDate = new Date(update.date)
            const timelineItem = document.createElement("div")
            timelineItem.className = "timeline-item"

            timelineItem.innerHTML = `
              <div class="timeline-date">${updateDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}</div>
              <div class="timeline-title">${update.status.charAt(0).toUpperCase() + update.status.slice(1)}</div>
              <div class="timeline-description">${update.message}</div>
            `

            timelineContainer.appendChild(timelineItem)
          })
        } else {
          // Add default timeline item
          const timelineItem = document.createElement("div")
          timelineItem.className = "timeline-item"

          timelineItem.innerHTML = `
            <div class="timeline-date">${appDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}</div>
            <div class="timeline-title">Application Submitted</div>
            <div class="timeline-description">Your application has been received and is pending review.</div>
          `

          timelineContainer.appendChild(timelineItem)
        }
      }

      // Scroll to result
      statusResult.scrollIntoView({ behavior: "smooth" })
    })
  }
})
