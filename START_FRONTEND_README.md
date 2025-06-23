# 🌟 RainbowForest Frontend Setup Guide

![RainbowForest Frontend](/home/ubuntu/screenshots/localhost_3000_071831.png)

*Professional dark mode e-commerce frontend with sparkling background effects*

## 📋 Overview

This guide will help you set up and run the RainbowForest E-commerce frontend application on any platform. The frontend is built with Next.js 14, TypeScript, and Tailwind CSS, featuring a professional dark mode design with sparkling background effects.

## ✨ Features

- 🎨 **Professional Dark Mode Design** with sparkling background animations
- 🛍️ **Complete E-commerce Interface** with product catalog, cart, and user management
- 📱 **Fully Responsive** design for desktop, tablet, and mobile
- ⭐ **Product Reviews & Recommendations** with star rating system
- 🔍 **Advanced Search & Filtering** capabilities
- 🛒 **Shopping Cart Management** with quantity controls
- 👤 **User Profile Management** with editable information

## 🔧 Prerequisites

Before starting, ensure you have the following installed on your system:

### For All Platforms:
- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for version control

### Platform-Specific Installation:

#### 🪟 Windows
```bash
# Install Node.js from official website
# Download from: https://nodejs.org/en/download/

# Or use Chocolatey (if installed)
choco install nodejs

# Or use winget
winget install OpenJS.NodeJS
```

#### 🍎 macOS
```bash
# Install using Homebrew (recommended)
brew install node

# Or download from official website
# https://nodejs.org/en/download/

# Or use MacPorts
sudo port install nodejs18
```

#### 🐧 Linux (Ubuntu/Debian)
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Or install latest version using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 🐧 Linux (CentOS/RHEL/Fedora)
```bash
# For CentOS/RHEL
sudo yum install nodejs npm

# For Fedora
sudo dnf install nodejs npm

# Or use NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/raimonvibe/ecommerce-microservices-java.git
cd ecommerce-microservices-java
```

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### 4. Start Development Server
```bash
# Using npm
npm run dev

# Or using yarn
yarn dev

# Or using pnpm
pnpm dev
```

### 5. Open in Browser
The application will be available at: **http://localhost:3000**

You should see the RainbowForest homepage with:
- ✅ Professional dark mode styling
- ✅ Sparkling background animation
- ✅ Navigation menu (Home, Products, Reviews, Cart, Profile)
- ✅ Featured products section
- ✅ Responsive design

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── products/          # Product catalog
│   │   ├── cart/              # Shopping cart
│   │   ├── profile/           # User profile
│   │   └── recommendations/   # Product reviews
│   ├── components/            # Reusable React components
│   │   ├── Navigation.tsx     # Main navigation
│   │   ├── ProductCard.tsx    # Product display card
│   │   ├── SparkleBackground.tsx # Background animation
│   │   └── LoadingSpinner.tsx # Loading indicator
│   ├── data/                  # Dummy data for development
│   ├── services/              # API integration layer
│   └── types/                 # TypeScript type definitions
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
└── tsconfig.json              # TypeScript configuration
```

## 🎯 Available Pages

| Page | URL | Description |
|------|-----|-------------|
| **Home** | `/` | Landing page with platform overview |
| **Products** | `/products` | Product catalog with search & filters |
| **Reviews** | `/recommendations` | Customer reviews & recommendations |
| **Cart** | `/cart` | Shopping cart management |
| **Profile** | `/profile` | User account information |

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🌐 Backend Integration

The frontend is configured to integrate with the Java microservices backend:

- **API Gateway**: http://localhost:8900
- **CORS**: Pre-configured for local development
- **Endpoints**: Ready for user management, product catalog, cart, and recommendations

To connect with the backend:
1. Start all Java microservices (see main README.md)
2. Ensure API Gateway is running on port 8900
3. The frontend will automatically proxy API calls

## 🎨 Customization

### Theme Colors
The application uses a professional dark theme with customizable colors in `tailwind.config.js`:

```javascript
colors: {
  gold: {
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
  },
  silver: {
    400: '#9ca3af',
    500: '#6b7280',
  },
  dark: {
    600: '#374151',
    700: '#1f2937',
    800: '#111827',
    900: '#0f172a',
  }
}
```

### Sparkling Background
The sparkling animation can be customized in `src/components/SparkleBackground.tsx`:
- Particle count
- Animation speed
- Colors and opacity
- Size variations

## 🐛 Troubleshooting

### Common Issues:

#### Port Already in Use
```bash
# Kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Should be 18.0 or higher
# Update Node.js if needed
```

#### Dependencies Installation Failed
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or try yarn
yarn install
```

#### TypeScript Errors
```bash
# Run type checking
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Platform-Specific Issues:

#### Windows
- **PowerShell Execution Policy**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **Long Path Names**: Enable long path support in Windows settings
- **Antivirus**: Add project folder to antivirus exclusions

#### macOS
- **Xcode Command Line Tools**: Run `xcode-select --install`
- **Permissions**: Use `sudo` if needed for global installations
- **M1/M2 Macs**: Ensure Node.js is compatible with ARM architecture

#### Linux
- **Permissions**: Avoid using `sudo` with npm, configure npm properly
- **Missing Build Tools**: Install `build-essential` package
- **Node.js Version**: Use NodeSource repository for latest versions

## 📊 Performance Tips

1. **Development Mode**: Use `npm run dev` for hot reloading
2. **Production Build**: Always run `npm run build` before deployment
3. **Image Optimization**: Images are automatically optimized by Next.js
4. **Bundle Analysis**: Use `npm run analyze` to check bundle size
5. **Memory Usage**: Restart dev server if it becomes slow

## 🔒 Security Notes

- **Environment Variables**: Never commit sensitive data
- **CORS**: Configured for development, adjust for production
- **Dependencies**: Regularly update packages for security patches
- **Build Output**: The `.next` folder contains build artifacts

## 📱 Mobile Testing

Test the responsive design on different screen sizes:

```bash
# Start dev server
npm run dev

# Open in browser and use developer tools
# Test breakpoints: mobile (320px), tablet (768px), desktop (1024px+)
```

## 🚀 Deployment

For production deployment:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Environment Configuration**:
   - Update API endpoints for production
   - Configure proper CORS settings
   - Set up environment variables

## 📞 Support

If you encounter issues:

1. **Check this README** for common solutions
2. **Verify Prerequisites** are correctly installed
3. **Check Console Logs** in browser developer tools
4. **Review Terminal Output** for error messages
5. **Update Dependencies** if using older versions

## 🎉 Success!

If everything is working correctly, you should see:
- ✅ Professional dark mode interface
- ✅ Sparkling background animation
- ✅ Smooth navigation between pages
- ✅ Responsive design on all devices
- ✅ Product catalog with search functionality
- ✅ Interactive shopping cart
- ✅ User profile management

Enjoy developing with the RainbowForest E-commerce platform! 🌟
