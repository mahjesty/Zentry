document.addEventListener("DOMContentLoaded", () => {
  // Helper functions
  function generateId() {
    return "APP-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  function getFromStorage(key) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  // Application form steps
  const applicationForm = document.getElementById("applicationForm")
  const progressSteps = document.querySelectorAll(".progress-step")
  const formSteps = document.querySelectorAll(".form-step")
  const nextButtons = document.querySelectorAll(".next-step")
  const prevButtons = document.querySelectorAll(".prev-step")
  const successModal = document.getElementById("successModal")

  let currentStep = 1

  // Initialize form data object
  const formData = {}

  if (applicationForm) {
    // Next step buttons
    nextButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Validate current step
        const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`)
        const inputs = currentFormStep.querySelectorAll("input, select")
        let isValid = true

        inputs.forEach((input) => {
          if (input.hasAttribute("required") && !input.value) {
            isValid = false
            input.classList.add("error")
          } else {
            input.classList.remove("error")
            // Store form data
            if (input.name) {
              formData[input.name] = input.value
            }
          }
        })

        if (!isValid) {
          alert("Please fill in all required fields.")
          return
        }

        // Move to next step
        currentStep++
        updateFormSteps()

        // If moving to review step, populate review data
        if (currentStep === 4) {
          populateReviewData()
        }
      })
    })

    // Previous step buttons
    prevButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentStep--
        updateFormSteps()
      })
    })

    // Form submission
    applicationForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Check terms agreement
      const termsAgree = document.getElementById("termsAgree")
      if (!termsAgree.checked) {
        alert("Please agree to the terms and conditions.")
        return
      }

      // Simulate form submission
      const submitButton = this.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent

      submitButton.disabled = true
      submitButton.textContent = "Submitting..."

      // Generate application ID
      const applicationId = generateId()

      // Store application data in localStorage
      const application = {
        id: applicationId,
        data: formData,
        status: "pending",
        date: new Date().toISOString(),
        updates: [
          {
            date: new Date().toISOString(),
            status: "pending",
            message: "Application submitted successfully.",
          },
        ],
      }

      // Get existing applications or create new array
      const applications = getFromStorage("applications") || []
      applications.push(application)
      saveToStorage("applications", applications)

      // Show success modal after delay
      setTimeout(() => {
        document.getElementById("applicationId").textContent = applicationId
        successModal.classList.add("active")
        submitButton.disabled = false
        submitButton.textContent = originalText
      }, 2000)
    })
  }

  // Update form steps visibility
  function updateFormSteps() {
    // Update progress steps
    progressSteps.forEach((step) => {
      const stepNum = Number.parseInt(step.dataset.step)
      step.classList.remove("active", "completed")

      if (stepNum === currentStep) {
        step.classList.add("active")
      } else if (stepNum < currentStep) {
        step.classList.add("completed")
      }
    })

    // Update form steps visibility
    formSteps.forEach((step) => {
      step.classList.remove("active")
      if (Number.parseInt(step.dataset.step) === currentStep) {
        step.classList.add("active")
      }
    })
  }

  // Populate review data
  function populateReviewData() {
    const reviewPersonal = document.getElementById("reviewPersonal")
    const reviewContact = document.getElementById("reviewContact")
    const reviewFinancial = document.getElementById("reviewFinancial")

    if (!reviewPersonal || !reviewContact || !reviewFinancial) return

    // Personal information
    reviewPersonal.innerHTML = `
      <div>
        <strong>Full Name</strong>
        <p>${formData.firstName || ""} ${formData.lastName || ""}</p>
      </div>
      <div>
        <strong>Date of Birth</strong>
        <p>${formData.dob || ""}</p>
      </div>
      <div>
        <strong>SSN</strong>
        <p>XXX-XX-${formData.ssn ? formData.ssn.slice(-4) : ""}</p>
      </div>
      <div>
        <strong>ID Type</strong>
        <p>${formData.idType || ""}</p>
      </div>
      <div>
        <strong>ID Number</strong>
        <p>${formData.idNumber || ""}</p>
      </div>
    `

    // Contact information
    reviewContact.innerHTML = `
      <div>
        <strong>Email</strong>
        <p>${formData.email || ""}</p>
      </div>
      <div>
        <strong>Phone</strong>
        <p>${formData.phone || ""}</p>
      </div>
      <div>
        <strong>Address</strong>
        <p>${formData.address || ""}</p>
      </div>
      <div>
        <strong>City</strong>
        <p>${formData.city || ""}</p>
      </div>
      <div>
        <strong>State</strong>
        <p>${formData.state || ""}</p>
      </div>
      <div>
        <strong>ZIP Code</strong>
        <p>${formData.zip || ""}</p>
      </div>
    `

    // Financial information
    reviewFinancial.innerHTML = `
      <div>
        <strong>Employment Status</strong>
        <p>${formData.employment || ""}</p>
      </div>
      <div>
        <strong>Annual Income</strong>
        <p>$${formData.income ? Number(formData.income).toLocaleString() : "0"}</p>
      </div>
      <div>
        <strong>Account Type</strong>
        <p>${formData.accountType || ""}</p>
      </div>
      <div>
        <strong>Existing Loans</strong>
        <p>${formData.existingLoans || "No"}</p>
      </div>
      <div>
        <strong>Referral Source</strong>
        <p>${formData.referral || "N/A"}</p>
      </div>
    `
  }
})
