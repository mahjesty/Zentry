document.addEventListener("DOMContentLoaded", () => {
  // Get form elements
  const applicationForm = document.getElementById("applicationForm")
  const formSections = document.querySelectorAll(".form-section")
  const progressSteps = document.querySelectorAll(".progress-step")
  const nextButtons = document.querySelectorAll(".btn-next")
  const prevButtons = document.querySelectorAll(".btn-prev")
  const submitButton = document.querySelector(".btn-submit")
  const successMessage = document.querySelector(".application-success")

  // Initialize form
  let currentSection = 1
  updateFormProgress()

  // Next button click handler
  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const nextSection = Number.parseInt(this.getAttribute("data-next"))

      // Validate current section before proceeding
      if (validateSection(currentSection)) {
        currentSection = nextSection
        updateFormProgress()
      }
    })
  })

  // Previous button click handler
  prevButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const prevSection = Number.parseInt(this.getAttribute("data-prev"))
      currentSection = prevSection
      updateFormProgress()
    })
  })

  // Form submission handler
  applicationForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Validate final section
    if (validateSection(currentSection)) {
      // Show loading state
      submitButton.disabled = true
      submitButton.textContent = "Processing..."

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        // Hide form and show success message
        applicationForm.style.display = "none"
        successMessage.style.display = "block"

        // Generate random reference number
        const referenceNumber = "ZB-" + Math.floor(10000000 + Math.random() * 90000000)
        document.getElementById("referenceNumber").textContent = referenceNumber

        // Scroll to top of success message
        window.scrollTo({
          top: successMessage.offsetTop - 100,
          behavior: "smooth",
        })
      }, 2000)
    }
  })

  // Update form progress
  function updateFormProgress() {
    // Hide all sections and update progress steps
    formSections.forEach((section, index) => {
      section.classList.remove("active")
      progressSteps[index].classList.remove("active", "completed")

      // Mark completed steps
      if (index + 1 < currentSection) {
        progressSteps[index].classList.add("completed")
      }

      // Mark current step
      if (index + 1 === currentSection) {
        progressSteps[index].classList.add("active")
      }
    })

    // Show current section
    document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add("active")

    // Scroll to top of form
    window.scrollTo({
      top: applicationForm.offsetTop - 100,
      behavior: "smooth",
    })
  }

  // Validate form section
  function validateSection(sectionNumber) {
    const section = document.querySelector(`.form-section[data-section="${sectionNumber}"]`)
    const inputs = section.querySelectorAll("input, select, textarea")
    let isValid = true

    // Check each required input
    inputs.forEach((input) => {
      if (input.hasAttribute("required") && !input.value) {
        isValid = false
        highlightInvalidInput(input)
      } else if (input.type === "email" && input.value && !validateEmail(input.value)) {
        isValid = false
        highlightInvalidInput(input)
      } else if (input.id === "confirmEmail" && input.value !== document.getElementById("email").value) {
        isValid = false
        highlightInvalidInput(input)
        showError(input, "Email addresses do not match")
      } else if (input.hasAttribute("pattern") && input.value && !validatePattern(input)) {
        isValid = false
        highlightInvalidInput(input)
      } else {
        removeInvalidHighlight(input)
      }
    })

    // Special validation for section 4 (account selection)
    if (sectionNumber === 4) {
      const accountTypeSelected = section.querySelector('input[name="accountType"]:checked')
      if (!accountTypeSelected) {
        isValid = false
        showError(section.querySelector(".account-options"), "Please select an account type")
      }
    }

    return isValid
  }

  // Highlight invalid input
  function highlightInvalidInput(input) {
    input.classList.add("invalid")

    // Add error message if not already present
    const errorMessage = input.parentElement.querySelector(".error-message")
    if (!errorMessage) {
      showError(input, input.getAttribute("data-error") || "This field is required")
    }

    // Add input event listener to remove error on input
    input.addEventListener(
      "input",
      () => {
        removeInvalidHighlight(input)
      },
      { once: true },
    )
  }

  // Remove invalid highlight
  function removeInvalidHighlight(input) {
    input.classList.remove("invalid")

    // Remove error message if present
    const errorMessage = input.parentElement.querySelector(".error-message")
    if (errorMessage) {
      errorMessage.remove()
    }
  }

  // Show error message
  function showError(element, message) {
    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.textContent = message

    // Insert error message after the element
    element.parentElement.appendChild(errorDiv)
  }

  // Validate email format
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Validate input pattern
  function validatePattern(input) {
    const pattern = new RegExp(input.getAttribute("pattern"))
    return pattern.test(input.value)
  }

  // Format SSN input
  const ssnInput = document.getElementById("ssn")
  if (ssnInput) {
    ssnInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 9) {
        value = value.slice(0, 9)
      }

      if (value.length > 5) {
        value = value.slice(0, 3) + "-" + value.slice(3, 5) + "-" + value.slice(5)
      } else if (value.length > 3) {
        value = value.slice(0, 3) + "-" + value.slice(3)
      }

      e.target.value = value
    })
  }

  // Format phone number input
  const phoneInput = document.getElementById("phoneNumber")
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 10) {
        value = value.slice(0, 10)
      }

      if (value.length > 6) {
        value = value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6)
      } else if (value.length > 3) {
        value = value.slice(0, 3) + "-" + value.slice(3)
      }

      e.target.value = value
    })
  }
})
