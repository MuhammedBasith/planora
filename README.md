# Planora - Natural Language Schedule Generator

## Overview
Planora is a modern web application that converts natural language descriptions of your day into structured calendar events. Simply describe your plans in plain English, and Planora will organize them into a clean, manageable schedule.

## Features

### 🎯 Core Features
- **Natural Language Processing**: Type or speak your schedule naturally
- **Voice Input**: Built-in speech-to-text functionality
- **Interactive Calendar**: Visual representation of your schedule
- **Dark/Light Mode**: Automatic theme switching for comfortable viewing
- **Keyboard Shortcuts**: Quick actions for power users
  - `⌘/Ctrl + Enter`: Generate Schedule
  - `⌘/Ctrl + M`: Toggle Voice Input

### 📱 User Experience
- Responsive design for all devices
- Smooth animations and transitions
- Real-time voice transcription
- Intuitive event editing interface

### 📤 Export Options
- Download as .ics file (compatible with most calendar apps)
- Direct Google Calendar integration
- Single or multiple event export

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/MuhammedBasith/planora.git

# Navigate to project directory
cd planora

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage Example

Simply type or speak your schedule like this:
```
Tomorrow, I need to wake up at 7 AM, umm, hit the gym for 1 hour, then grab coffee with Sarah, uhmmm, at 10 AM. After that, I'll work on my project until 1 PM and have lunch. Maybe a short walk in the evening around 6 PM.
```

Planora will automatically convert this into structured calendar events with appropriate time slots and durations.

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Speech Recognition**: Web Speech API
- **Calendar Integration**: .ics file generation and Google Calendar API

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
