document.addEventListener("DOMContentLoaded", () => {
  // Check if admin is logged in
  const userData = JSON.parse(localStorage.getItem("zentry_user") || "{}")

  if (!userData.isLoggedIn || userData.role !== "admin") {
    // Redirect to admin login page if not logged in as admin
    window.location.href = "admin-login.html"
    return
  }

  // Set admin name and avatar
  const adminNameElement = document.getElementById("admin-name")
  const userAvatarElement = document.getElementById("user-avatar")

  if (adminNameElement && userData.name) {
    adminNameElement.textContent = userData.name
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

      // Redirect to admin login page
      window.location.href = "admin-login.html"
    })
  }

  // Load applications
  loadApplicationsOld()

  // Update dashboard stats
  updateDashboardStats()
})

function loadApplicationsOld() {
  const applicationsBody = document.getElementById("applications-body")
  if (!applicationsBody) return

  // Clear existing applications
  applicationsBody.innerHTML = ""

  // Get user's application if it exists
  const userApplication = JSON.parse(localStorage.getItem("zentry_application_data") || "null")

  // Generate dummy applications
  const applications = generateDummyApplications()

  // Add user's application if it exists
  if (userApplication) {
    applications.unshift(userApplication)
  }

  // Save applications to localStorage for persistence
  localStorage.setItem("zentry_admin_applications", JSON.stringify(applications))

  // Add applications to the table
  applications.forEach((application) => {
    const row = document.createElement("tr")

    // Format the date
    const dob = new Date(application.dob)
    const formattedDob = dob.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

    // Determine status class
    let statusClass = ""
    switch (application.status) {
      case "review":
        statusClass = "status-pending"
        break
      case "approved":
        statusClass = "status-completed"
        break
      case "rejected":
        statusClass = "status-failed"
        break
    }

    // Format status text
    let statusText = ""
    switch (application.status) {
      case "review":
        statusText = "Under Review"
        break
      case "approved":
        statusText = "Approved"
        break
      case "rejected":
        statusText = "Rejected"
        break
    }

    row.innerHTML = `
      <td>${application.id}</td>
      <td>${application.fullName}</td>
      <td>${formattedDob}</td>
      <td>${application.email}</td>
      <td><span class="transaction-status ${statusClass}">${statusText}</span></td>
      <td class="application-actions">
        <button class="application-action approve" data-id="${application.id}">Approve</button>
        <button class="application-action reject" data-id="${application.id}">Reject</button>
        <button class="application-action delete" data-id="${application.id}">Delete</button>
      </td>
    `

    applicationsBody.appendChild(row)
  })

  // Add event listeners to action buttons
  document.querySelectorAll(".application-action").forEach((button) => {
    button.addEventListener("click", handleApplicationActionOld)
  })
}

function handleApplicationActionOld(event) {
  const action = event.target.classList.contains("approve")
    ? "approved"
    : event.target.classList.contains("reject")
      ? "rejected"
      : "delete"

  const applicationId = event.target.dataset.id

  // Get applications from localStorage
  const applications = JSON.parse(localStorage.getItem("zentry_admin_applications") || "[]")

  // Find the application
  const applicationIndex = applications.findIndex((app) => app.id === applicationId)

  if (applicationIndex === -1) {
    alert("Application not found.")
    return
  }

  // Handle the action
  if (action === "delete") {
    // Remove the application
    applications.splice(applicationIndex, 1)

    // If this is the user's application, update their status
    const userApplication = JSON.parse(localStorage.getItem("zentry_application_data") || "null")
    if (userApplication && userApplication.id === applicationId) {
      localStorage.removeItem("zentry_application_data")
      localStorage.removeItem("zentry_application_submitted")
      localStorage.removeItem("zentry_application_status")
    }
  } else {
    // Update the application status
    applications[applicationIndex].status = action

    // If this is the user's application, update their status
    const userApplication = JSON.parse(localStorage.getItem("zentry_application_data") || "null")
    if (userApplication && userApplication.id === applicationId) {
      userApplication.status = action
      localStorage.setItem("zentry_application_data", JSON.stringify(userApplication))
      localStorage.setItem("zentry_application_status", action)
    }
  }

  // Save updated applications
  localStorage.setItem("zentry_admin_applications", JSON.stringify(applications))

  // Reload applications
  loadApplicationsOld()

  // Update dashboard stats
  updateDashboardStats()

  // Show success message
  alert(`Application ${action === "delete" ? "deleted" : action} successfully.`)
}

function updateDashboardStats() {
  // Get applications from localStorage
  const applications = JSON.parse(localStorage.getItem("zentry_admin_applications") || "[]")

  // Calculate stats
  const totalApplications = applications.length
  const pendingApplications = applications.filter((app) => app.status === "review").length

  // Update UI
  const totalApplicationsElement = document.getElementById("total-applications")
  const pendingApplicationsElement = document.getElementById("pending-applications")
  const totalUsersElement = document.getElementById("total-users")

  if (totalApplicationsElement) {
    totalApplicationsElement.textContent = totalApplications
  }

  if (pendingApplicationsElement) {
    pendingApplicationsElement.textContent = pendingApplications
  }

  if (totalUsersElement) {
    // In a real application, this would be the actual number of users
    // For demo purposes, we'll use a random number between 50 and 100
    const totalUsers = Math.floor(Math.random() * 51) + 50
    totalUsersElement.textContent = totalUsers
  }
}

function generateDummyApplications() {
  // Generate 5 dummy applications
  const applications = []

  const names = ["John Smith", "Emma Johnson", "Michael Brown", "Sophia Williams", "James Davis"]

  const emails = [
    "john.smith@example.com",
    "emma.johnson@example.com",
    "michael.brown@example.com",
    "sophia.williams@example.com",
    "james.davis@example.com",
  ]

  const statuses = ["review", "approved", "rejected"]

  for (let i = 0; i < 5; i++) {
    // Generate random date of birth between 1970 and 2000
    const year = Math.floor(Math.random() * 31) + 1970
    const month = Math.floor(Math.random() * 12) + 1
    const day = Math.floor(Math.random() * 28) + 1
    const dob = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`

    // Generate application ID
    const dobFormatted = `${year}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}`
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    const applicationId = `APP-${dobFormatted}-${randomNum}`

    // Generate random status
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    applications.push({
      id: applicationId,
      fullName: names[i],
      email: emails[i],
      dob: dob,
      status: status,
      submissionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return applications
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if admin is logged in
  const currentAdmin = JSON.parse(localStorage.getItem("currentAdmin") || "{}")

  if (!currentAdmin.id || currentAdmin.role !== "admin") {
    // Redirect to admin login page if not logged in as admin
    window.location.href = "admin-login.html"
    return
  }

  // Set admin name and avatar
  const adminNameElement = document.getElementById("adminName")
  const adminAvatarElement = document.getElementById("adminAvatar")

  if (adminNameElement && currentAdmin.name) {
    adminNameElement.textContent = currentAdmin.name
  }

  if (adminAvatarElement && currentAdmin.name) {
    adminAvatarElement.textContent = currentAdmin.name.charAt(0)
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

      // Clear admin data
      localStorage.removeItem("currentAdmin")

      // Redirect to admin login page
      window.location.href = "admin-login.html"
    })
  }

  // Load dashboard stats
  loadDashboardStats()

  // Load applications
  loadApplicationsNew()

  // Load system activity
  loadSystemActivity()

  // Load users
  loadUsers()
})

// Load dashboard stats
function loadDashboardStats() {
  // In a real application, this would fetch data from an API
  // For demo purposes, we'll use dummy data

  const stats = {
    users: {
      total: 1254,
      change: 5.2,
      direction: "up",
    },
    applications: {
      total: 87,
      change: 12.5,
      direction: "up",
    },
    accounts: {
      total: 1876,
      change: 3.8,
      direction: "up",
    },
    transactions: {
      total: 15432,
      change: -2.1,
      direction: "down",
    },
  }

  // Update stats
  Object.keys(stats).forEach((key) => {
    const valueElement = document.getElementById(`${key}-value`)
    const changeElement = document.getElementById(`${key}-change`)

    if (valueElement) {
      valueElement.textContent = stats[key].total.toLocaleString()
    }

    if (changeElement) {
      changeElement.textContent = `${stats[key].direction === "up" ? "+" : ""}${stats[key].change}% from last month`
      changeElement.className = `stat-change ${stats[key].direction === "up" ? "positive" : "negative"}`
    }
  })
}

// Load applications
function loadApplicationsNew() {
  // Get applications from localStorage or use dummy data
  const storedApplications = localStorage.getItem("applications")
  let applications = storedApplications ? JSON.parse(storedApplications) : []

  // If no applications in storage, use dummy data
  if (applications.length === 0) {
    applications = generateDummyApplications()
  }

  const applicationsTableBody = document.getElementById("applicationsTableBody")

  if (applicationsTableBody) {
    // Clear existing rows
    applicationsTableBody.innerHTML = ""

    // Add application rows
    applications.forEach((application) => {
      const row = document.createElement("tr")

      // Format date
      const date = new Date(application.date)
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })

      // Determine status class
      let statusClass = ""
      switch (application.status) {
        case "approved":
          statusClass = "status-completed"
          break
        case "rejected":
          statusClass = "status-failed"
          break
        default:
          statusClass = "status-pending"
      }

      // Get applicant name
      const applicantName = application.data
        ? `${application.data.firstName || ""} ${application.data.lastName || ""}`
        : "Unknown Applicant"

      row.innerHTML = `
        <td>${application.id}</td>
        <td>${applicantName}</td>
        <td>${formattedDate}</td>
        <td>${application.data ? application.data.email || "N/A" : "N/A"}</td>
        <td><span class="transaction-status ${statusClass}">${application.status}</span></td>
        <td class="table-actions">
          <button class="action-btn view" data-id="${application.id}" title="View Details"></button>
          <button class="action-btn edit" data-id="${application.id}" title="Edit Application"></button>
          <button class="action-btn delete" data-id="${application.id}" title="Delete Application"></button>
        </td>
      `

      applicationsTableBody.appendChild(row)
    })

    // Add event listeners to action buttons
    document.querySelectorAll(".action-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const applicationId = this.dataset.id
        const action = this.classList.contains("view") ? "view" : this.classList.contains("edit") ? "edit" : "delete"

        handleApplicationActionNew(applicationId, action)
      })
    })
  }
}

// Handle application action
function handleApplicationActionNew(applicationId, action) {
  // Get applications from localStorage
  const storedApplications = localStorage.getItem("applications")
  const applications = storedApplications ? JSON.parse(storedApplications) : []

  // Find application
  const applicationIndex = applications.findIndex((app) => app.id === applicationId)

  if (applicationIndex === -1) {
    alert("Application not found.")
    return
  }

  const application = applications[applicationIndex]

  switch (action) {
    case "view":
      // In a real application, this would open a modal or navigate to a details page
      alert(
        `Application Details:\nID: ${application.id}\nStatus: ${application.status}\nDate: ${new Date(application.date).toLocaleDateString()}`,
      )
      break
    case "edit":
      // In a real application, this would open a form to edit the application
      const newStatus = prompt("Update application status (pending, approved, rejected):", application.status)

      if (newStatus && ["pending", "approved", "rejected"].includes(newStatus)) {
        // Update application status
        applications[applicationIndex].status = newStatus

        // Add update to application history
        if (!applications[applicationIndex].updates) {
          applications[applicationIndex].updates = []
        }

        applications[applicationIndex].updates.push({
          date: new Date().toISOString(),
          status: newStatus,
          message: `Application status updated to ${newStatus}.`,
        })

        // Save updated applications
        localStorage.setItem("applications", JSON.stringify(applications))

        // Reload applications
        loadApplicationsNew()
      }
      break
    case "delete":
      // Confirm deletion
      if (confirm("Are you sure you want to delete this application?")) {
        // Remove application
        applications.splice(applicationIndex, 1)

        // Save updated applications
        localStorage.setItem("applications", JSON.stringify(applications))

        // Reload applications
        loadApplicationsNew()
      }
      break
  }
}

// Load system activity
function loadSystemActivity() {
  // In a real application, this would fetch data from an API
  // For demo purposes, we'll use dummy data

  const activities = [
    {
      type: "login",
      title: "Admin Login",
      description: "Admin user logged in to the system.",
      time: "10 minutes ago",
    },
    {
      type: "application",
      title: "New Application",
      description: "A new account application was submitted.",
      time: "1 hour ago",
    },
    {
      type: "application",
      title: "Application Approved",
      description: "Account application APP-123456 was approved.",
      time: "3 hours ago",
    },
    {
      type: "account",
      title: "Account Created",
      description: "New checking account created for John Doe.",
      time: "5 hours ago",
    },
    {
      type: "login",
      title: "Admin Login",
      description: "Admin user logged in to the system.",
      time: "1 day ago",
    },
  ]

  const activityListContainer = document.getElementById("activityList")

  if (activityListContainer) {
    // Clear existing activities
    activityListContainer.innerHTML = ""

    // Add activity items
    activities.forEach((activity) => {
      const activityItem = document.createElement("div")
      activityItem.className = "activity-item"

      activityItem.innerHTML = `
        <div class="activity-icon ${activity.type}"></div>
        <div class="activity-content">
          <h4 class="activity-title">${activity.title}</h4>
          <p class="activity-description">${activity.description}</p>
        </div>
        <span class="activity-time">${activity.time}</span>
      `

      activityListContainer.appendChild(activityItem)
    })
  }
}

// Load users
function loadUsers() {
  // In a real application, this would fetch data from an API
  // For demo purposes, we'll use dummy data

  const users = [
    {
      id: "USER-001",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "user",
      status: "active",
      lastLogin: "2 days ago",
    },
    {
      id: "USER-002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "user",
      status: "inactive",
      lastLogin: "1 week ago",
    },
    {
      id: "USER-003",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "admin",
      status: "active",
      lastLogin: "5 hours ago",
    },
  ]

  const usersTableBody = document.getElementById("usersTableBody")

  if (usersTableBody) {
    // Clear existing rows
    usersTableBody.innerHTML = ""

    // Add user rows
    users.forEach((user) => {
      const row = document.createElement("tr")

      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><span class="user-status ${user.status === "active" ? "status-completed" : "status-failed"}">${user.status}</span></td>
        <td>${user.lastLogin}</td>
        <td class="table-actions">
          <button class="action-btn view" data-id="${user.id}" title="View Details"></button>
          <button class="action-btn edit" data-id="${user.id}" title="Edit User"></button>
          <button class="action-btn delete" data-id="${user.id}" title="Delete User"></button>
        </td>
      `

      usersTableBody.appendChild(row)
    })

    // Add event listeners to action buttons
    document.querySelectorAll("#usersTableBody .action-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.dataset.id
        const action = this.classList.contains("view") ? "view" : this.classList.contains("edit") ? "edit" : "delete"

        handleUserAction(userId, action)
      })
    })
  }
}

// Handle user action
function handleUserAction(userId, action) {
  // In a real application, this would fetch user data from an API
  // For demo purposes, we'll use dummy data

  const user = {
    id: userId,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    status: "active",
    lastLogin: "2 days ago",
  }

  switch (action) {
    case "view":
      // In a real application, this would open a modal or navigate to a details page
      alert(`User Details:\nID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}`)
      break
    case "edit":
      // In a real application, this would open a form to edit the user
      alert("Edit user functionality not implemented in this demo.")
      break
    case "delete":
      // Confirm deletion
      if (confirm("Are you sure you want to delete this user?")) {
        // In a real application, this would delete the user from the database
        alert("User deleted successfully.")

        // Reload users
        loadUsers()
      }
      break
  }
}
