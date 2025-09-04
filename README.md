# Marpro Website
![CI](https://github.com/Kseni-ia/marpro/actions/workflows/ci.yml/badge.svg)

A modern React TypeScript single-page application for Marpro, featuring three main service sections: Containers, Bagers, and Constructions.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm start
```
The application will open at [http://localhost:3000](http://localhost:3000)

### Building for Production
```bash
npm run build
```

## ▶️ Next.js app (`nextjs-app/`)

This repository also contains a Next.js app. To work with it:

```bash
cd nextjs-app
npm install
npm run dev    # start Next.js dev server on http://localhost:3000
npm run build  # build Next.js app
npm start      # start Next.js production server
npm run lint   # run Next.js linter
```

## 🎨 Design System

### Color Palette
- **Primary Black**: `#000000` - Main background
- **Primary Red**: `#cc0000` - Brand color and accents
- **Dark Red**: `#1a0000` - Card backgrounds
- **Light Gray**: `#cccccc` - Text color

## 📁 Project Structure

```
marpro/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Containers.tsx      # Containers section component
│   │   ├── Bagers.tsx          # Bagers section component
│   │   ├── Constructions.tsx   # Constructions section component
│   │   └── Sections.css        # Shared styles for sections
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── index.tsx               # Application entry point
│   └── index.css               # Global styles
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Features

- **Single Page Application**: Smooth navigation without page reloads
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean interface with hover effects and animations
- **TypeScript**: Full type safety and better development experience
- **Component-Based**: Modular architecture for easy maintenance

## 📝 Next Steps

To add content to each section:

1. **Containers Section** (`src/components/Containers.tsx`)
   - Add container types and specifications
   - Include rental and purchase options
   - Add delivery service information

2. **Bagers Section** (`src/components/Bagers.tsx`)
   - List available bager models
   - Add equipment specifications
   - Include rental rates

3. **Constructions Section** (`src/components/Constructions.tsx`)
   - Showcase construction projects
   - Add portfolio items
   - Include service descriptions

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (one-way operation)

## 📦 Dependencies

- React 18.2.0
- TypeScript 4.9.5
- React Router DOM 6.20.1
- React Scripts 5.0.1

## 🤝 Contributing

When adding new features:
1. Keep components under 300 lines
2. Maintain the black and red color scheme
3. Ensure responsive design
4. Add proper TypeScript types
5. Test on different screen sizes

## 📄 License

Private project - All rights reserved
