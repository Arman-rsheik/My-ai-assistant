🤖 AVA — Your Personal AI Assistant
AVA is a high-performance, sleek, and modern AI assistant interface. Built with the latest web technologies, it features fluid animations, a responsive design, and a "single-file" build capability for easy portability.
![alt text](https://img.shields.io/badge/license-MIT-blue.svg)

![alt text](https://img.shields.io/badge/React-19-blue?logo=react)

![alt text](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)

![alt text](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
✨ Features
React 19 Core: Leverages the latest improvements in the React ecosystem.
Tailwind CSS v4: Utilizes the next-generation CSS engine for ultra-fast styling and modern design tokens.
Fluid Animations: Smooth, physics-based UI transitions powered by Framer Motion.
Iconography: Clean and consistent interface icons via Lucide React.
Portable Build: Configured with vite-plugin-singlefile to bundle the entire application into a single .html file for easy sharing or offline use.
🚀 Tech Stack
Technology	Purpose
React 19	UI Framework
Vite 7	Build Tool & Dev Server
TypeScript	Type Safety
Tailwind CSS 4	Utility-first Styling
Framer Motion	Interaction Animations
Lucide React	Icons
🛠️ Getting Started
Prerequisites
Node.js (Version 20+ recommended)
npm
Installation
Clone the repository:
code
Bash
git clone https://github.com/your-username/ava-ai-assistant.git
cd ava-ai-assistant
Install dependencies:
code
Bash
npm install
Start the development server:
code
Bash
npm run dev
Open http://localhost:5173 in your browser.
Building for Production
To create a production-ready build:
code
Bash
npm run build
The output will be located in the dist/ folder. Thanks to the vite-plugin-singlefile, your entire app will be contained within a single index.html file.
📁 Project Structure
code
Text
├── src/
│   ├── main.tsx        # Entry point
│   ├── App.tsx         # Main application logic
│   └── components/     # UI Components
├── index.html          # HTML Template
├── package.json        # Dependencies and Scripts
├── tsconfig.json       # TypeScript Configuration
└── vite.config.ts      # Vite & Tailwind 4 Configuration
📜 Scripts
npm run dev: Starts the Vite development server.
npm run build: Bundles the application for production (Single HTML file).
npm run preview: Locally previews the production build.
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
