const fs = require("fs")
const path = require("path")

// Function to create directory if it doesn't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
    console.log(`Created directory: ${directory}`)
  }
}

// Function to copy a file
function copyFile(source, destination) {
  try {
    const content = fs.readFileSync(source)
    fs.writeFileSync(destination, content)
    console.log(`Copied: ${source} -> ${destination}`)
  } catch (error) {
    console.error(`Error copying ${source}: ${error.message}`)
  }
}

// Function to copy directory recursively
function copyDirectory(source, destination) {
  ensureDirectoryExists(destination)

  const files = fs.readdirSync(source)

  for (const file of files) {
    const sourcePath = path.join(source, file)
    const destPath = path.join(destination, file)

    const stats = fs.statSync(sourcePath)

    if (stats.isDirectory()) {
      copyDirectory(sourcePath, destPath)
    } else {
      copyFile(sourcePath, destPath)
    }
  }
}

// Clean the public directory if it exists
if (fs.existsSync("public")) {
  fs.rmSync("public", { recursive: true, force: true })
  console.log("Cleaned existing public directory")
}

// Create the public directory
ensureDirectoryExists("public")
ensureDirectoryExists("public/styles")
ensureDirectoryExists("public/js")
ensureDirectoryExists("public/assets")
ensureDirectoryExists("public/admin")

// Copy HTML files to public
const htmlFiles = [
  "index.html",
  "login.html",
  "apply.html",
  "dashboard.html",
  "transactions.html",
  "transfer.html",
  "accounts.html",
  "settings.html",
]

htmlFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    copyFile(file, `public/${file}`)
  } else {
    console.log(`Warning: ${file} does not exist`)
  }
})

// Copy admin HTML files
if (fs.existsSync("admin")) {
  copyDirectory("admin", "public/admin")
} else {
  console.log("Warning: admin directory does not exist")
}

// Copy CSS files
if (fs.existsSync("styles")) {
  copyDirectory("styles", "public/styles")
} else {
  console.log("Warning: styles directory does not exist")
}

// Copy JS files
if (fs.existsSync("js")) {
  copyDirectory("js", "public/js")
} else {
  console.log("Warning: js directory does not exist")
}

// Copy assets if they exist
if (fs.existsSync("assets")) {
  copyDirectory("assets", "public/assets")
} else {
  console.log("Warning: assets directory does not exist")
}

// Create a simple index.html if it doesn't exist
if (!fs.existsSync("public/index.html")) {
  const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zentry Banking</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <h1>Zentry Banking</h1>
  <p>Welcome to Zentry Banking. This is a placeholder page.</p>
  <script src="js/main.js"></script>
</body>
</html>
  `
  fs.writeFileSync("public/index.html", defaultHtml)
  console.log("Created default index.html")
}

console.log('Build completed successfully. Files are ready in the "public" directory.')
