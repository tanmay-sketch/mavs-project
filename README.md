# DraftHub 🏀

A modern NBA Draft scouting platform built for Front Office decision makers. DraftHub provides an interactive way to view, analyze, and track draft prospects.

## Features 🌟

### Big Board
- Dynamic prospect ranking based on scout evaluations
- Visual indicators for high/low prospect rankings
- Real-time filtering and sorting capabilities
- Responsive grid layout for all screen sizes

### Player Profiles
- Comprehensive player statistics
- Season averages and detailed game logs
- Physical measurements and combine data
- Team affiliations and background information

### Scouting Reports
- Add new scouting reports for prospects
- Track multiple scouts' evaluations
- Compare different scout rankings
- Identify outlier opinions on prospects

### Interactive UI
- Modern Material UI components
- Dark/Light mode support
- Responsive design for mobile, tablet, and desktop
- Animated transitions and loading states
- Interactive background effects

## Tech Stack 💻

- React with Vite
- Material UI
- React Router
- TailwindCSS
- Motion/React for animations

## Getting Started 🚀

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/DraftHub.git
cd DraftHub
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure 📁

```
DraftHub/
├── src/
│   ├── components/     # React components
│   ├── data/          # JSON data files
│   ├── utils/         # Utility functions
│   ├── context/       # React context providers
│   └── assets/        # Static assets
├── public/            # Public assets
└── ...config files
```

## Key Components 🔑

- `Board.jsx`: Main big board display
- `PlayerCard.jsx`: Individual prospect card
- `PlayerProfile.jsx`: Detailed player view
- `ScoutNotes.jsx`: Scouting report management
- `SearchAndFilter.jsx`: Search and filtering controls

## Data Structure 📊

The application uses a JSON data structure that includes:
- Player biographical information
- Scout rankings
- Statistical data
- Physical measurements
- Scouting reports