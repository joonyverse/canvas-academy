# 🎨 Canvas Academy

> Interactive HTML5 Canvas learning platform with live code execution

[![Live Demo](https://img.shields.io/badge/Live%20Demo-🚀%20Visit%20Site-blue?style=for-the-badge)](https://inquisitive-medovik-e644b7.netlify.app)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

## ✨ Features

### 🎯 **Interactive Learning Environment**
- **Split-pane IDE** with Monaco Editor and live canvas preview
- **Real-time code execution** with instant visual feedback
- **Secure sandbox environment** with 10-second execution timeout
- **Error handling** with line-by-line debugging information

### 🎮 **Rich Example Library**
- **50+ Canvas examples** across 5 categories:
  - 🔷 **Basic Shapes** - Rectangles, circles, text, paths
  - 🎬 **Animation** - Bouncing balls, particle effects, smooth transitions
  - 🖱️ **Interaction** - Mouse events, keyboard controls, touch support
  - ✨ **Effects** - Gradients, shadows, transformations, filters
  - 🎮 **Games** - Pong, Snake, interactive demos

### 🛠️ **Developer Experience**
- **Monaco Editor** with Canvas API autocompletion
- **Keyboard shortcuts** (Ctrl+Enter to run code)
- **Virtual file system** for project organization
- **URL sharing** with TinyURL integration
- **Console logging** with expandable output panel

### 🔒 **Security & Performance**
- **Sandboxed execution** environment
- **Memory leak prevention** with automatic cleanup
- **Animation frame management** to prevent infinite loops
- **Event listener cleanup** on code changes
- **CSP headers** for enhanced security

## 🚀 Live Examples

### Basic Drawing
```javascript
// Pre-injected canvas and ctx variables
ctx.fillStyle = '#3B82F6';
ctx.fillRect(50, 50, 100, 100);

ctx.strokeStyle = '#EF4444';
ctx.lineWidth = 3;
ctx.strokeRect(200, 50, 100, 100);
```

### Animation
```javascript
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  vx: 5,
  vy: 3
};

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ball.x += ball.vx;
  ball.y += ball.vy;
  
  // Bounce off walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.vx = -ball.vx;
  }
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.vy = -ball.vy;
  }
  
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#3B82F6';
  ctx.fill();
  
  requestAnimationFrame(animate);
}

animate();
```

### Interactive Game
```javascript
// Simple Pong implementation with W/S and Arrow keys
let paddle1 = { x: 10, y: canvas.height / 2 - 30, width: 10, height: 60 };
let paddle2 = { x: canvas.width - 20, y: canvas.height / 2 - 30, width: 10, height: 60 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 5, vx: 3, vy: 2 };

// Full game loop with collision detection...
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Monaco Editor** - VS Code-powered code editing

### Canvas & Graphics
- **HTML5 Canvas API** - Native 2D graphics rendering
- **RequestAnimationFrame** - Smooth 60fps animations
- **Canvas Context 2D** - Drawing operations and transformations

### Security & Performance
- **Secure Function Execution** - Sandboxed code environment
- **Memory Management** - Automatic cleanup and leak prevention
- **CSP Headers** - Content Security Policy implementation
- **Error Boundaries** - Graceful error handling

### Development & Deployment
- **ESLint** - Code linting and formatting
- **Netlify** - Continuous deployment
- **GitHub Actions** - CI/CD pipeline

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/joonyverse/play-canvas.git
cd play-canvas

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands
```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Build and deploy to Netlify
npm run build && netlify deploy --prod --dir=dist
```

## 🗂️ Project Structure

```
play-canvas/
├── src/
│   ├── components/           # React components
│   │   ├── CanvasPreview.tsx    # Live canvas execution
│   │   ├── CodeEditor.tsx       # Monaco editor wrapper
│   │   ├── FileExplorer.tsx     # Virtual file system
│   │   └── Sidebar.tsx          # Example gallery
│   ├── data/
│   │   └── examples.ts          # Canvas example library
│   ├── hooks/
│   │   ├── useProject.ts           # Project state management
│   │   ├── useSecureCanvasExecutor.ts # Secure code execution
│   │   └── useUrlState.ts          # URL parameter handling
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   └── utils/
│       ├── fileValidation.ts    # File system validation
│       ├── securityHeaders.ts   # CSP configuration
│       └── shortLink.ts         # URL shortening
├── public/
│   └── _headers                 # Netlify security headers
└── dist/                        # Production build
```

## 🎯 Key Features Explained

### Secure Code Execution
The platform uses a sophisticated sandboxed execution environment:
- **Function constructor** with restricted globals
- **Timeout protection** (10-second limit)
- **Memory leak prevention** with automatic cleanup
- **Animation frame tracking** to prevent infinite loops

### Virtual File System
- Create, rename, and delete files/folders
- Organize projects with folder structures
- Auto-save functionality
- File validation and security checks

### URL Sharing System
- Generate short URLs for examples using TinyURL API
- Share code snippets with unique links
- Load examples from URL parameters
- Bookmark and share learning progress

### Real-time Error Handling
- Line-by-line error reporting
- Stack trace analysis with line numbers
- Helpful debugging suggestions
- Console output with log levels

## 🔒 Security Features

- **Content Security Policy** headers
- **Sandboxed execution** environment
- **Input validation** and sanitization
- **Memory management** and cleanup
- **No eval() usage** - safe Function constructor
- **Limited global access** - restricted environment

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Guidelines
1. Follow TypeScript best practices
2. Write tests for new features
3. Maintain security standards
4. Update documentation
5. Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Monaco Editor** - VS Code editing experience
- **React** - Component architecture
- **Canvas API** - 2D graphics rendering
- **Netlify** - Deployment platform
- **TinyURL** - URL shortening service

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/joonyverse">@joonyverse</a></p>
  <p>
    <a href="https://inquisitive-medovik-e644b7.netlify.app">🚀 Live Demo</a> •
    <a href="https://github.com/joonyverse/play-canvas">📁 Source Code</a> •
    <a href="https://github.com/joonyverse/play-canvas/issues">🐛 Report Bug</a>
  </p>
</div>