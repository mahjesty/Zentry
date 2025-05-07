document.addEventListener("DOMContentLoaded", () => {
  // Testimonials slider
  const testimonialsSlider = document.querySelector(".testimonials-slider")

  if (testimonialsSlider) {
    // Simple auto-scroll functionality
    let scrollPosition = 0
    const testimonials = testimonialsSlider.querySelectorAll(".testimonial")
    const testimonialWidth = testimonials[0].offsetWidth + 16 // Width + gap

    setInterval(() => {
      scrollPosition += testimonialWidth
      if (scrollPosition >= testimonialsSlider.scrollWidth - testimonialsSlider.offsetWidth) {
        scrollPosition = 0
      }
      testimonialsSlider.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }, 5000)
  }

  // Contact form submission
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Simulate form submission
      const submitButton = this.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent

      submitButton.disabled = true
      submitButton.textContent = "Sending..."

      // Simulate API call
      setTimeout(() => {
        alert("Thank you for your message! We will get back to you soon.")
        contactForm.reset()
        submitButton.disabled = false
        submitButton.textContent = originalText
      }, 1500)
    })
  }
})
