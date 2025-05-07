# Zentry Banking

A modern banking application with a sleek user interface.

## Development

To run the project locally:

\`\`\`bash
# Install dependencies (if any)
npm install

# Build the project
npm run build

# Start the local server
npm start
\`\`\`

## Deployment

This project is configured for deployment on Vercel. The build process will create a `public` directory containing all the static files needed for deployment.
\`\`\`

Let's ensure we have a basic index.html file in the root directory:

```html file="index.html"
&lt;!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zentry Banking - Modern Banking Solutions</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/landing.css">
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
    <meta name="description" content="Zentry Banking offers modern banking solutions with secure online and mobile banking, competitive rates, and personalized service.">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="logo">
                <img src="assets/logo.png" alt="Zentry Banking Logo">
                <span>Zentry Banking</span>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#pricing">Pricing</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
            <div class="auth-buttons">
                <a href="login.html" class="btn btn-outline">Login</a>
                <a href="apply.html" class="btn btn-primary">Open Account</a>
            </div>
            <button class="mobile-menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1>Banking Made Simple</h1>
                    <p>Experience the future of banking with Zentry. Secure, fast, and designed for the modern world.</p>
                    <div class="hero-cta">
                        <a href="apply.html" class="btn btn-primary btn-large">Get Started</a>
                        <a href="#features" class="btn btn-outline btn-large">Learn More</a>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="assets/hero-banking-app.png" alt="Zentry Banking App">
                </div>
            </div>
        </section>

        &lt;!-- Rest of the landing page content -->
        &lt;!-- Features, Pricing, Testimonials, etc. -->

        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-logo">
                        <img src="assets/logo.png" alt="Zentry Banking Logo">
                        <span>Zentry Banking</span>
                    </div>
                    <div class="footer-links">
                        <div class="footer-column">
                            <h3>Products</h3>
                            <ul>
                                <li><a href="#">Checking</a></li>
                                <li><a href="#">Savings</a></li>
                                <li><a href="#">Credit Cards</a></li>
                                <li><a href="#">Loans</a></li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h3>Company</h3>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Press</a></li>
                                <li><a href="#">Blog</a></li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h3>Resources</h3>
                            <ul>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2023 Zentry Banking. All rights reserved.</p>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    </main>

    <script src="js/main.js"></script>
</body>
</html>
