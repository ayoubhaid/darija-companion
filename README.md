# My Darija Companion

A modern Moroccan Darija learning app built with Flutter and Firebase, designed to help beginners and intermediate learners master Moroccan Arabic (Darija) through interactive lessons, AI-powered features, and gamification.

## 🌟 Features

### Core Learning Features
- **Interactive Lessons**: Themed units with vocabulary, sentences, audio, and exercises
- **Native Audio & Pronunciation**: Practice with native speaker audio and speech recognition
- **Vocabulary Flashcards**: Spaced repetition system (SRS) for optimal learning
- **Interactive Quizzes**: Multiple choice, matching, fill-in-the-blank, and adaptive quizzes

### Engagement & AI
- **Personalized Learning Path**: Customizable goals and adaptive difficulty
- **Gamification**: Daily streaks, XP system, levels, badges, and motivational messages
- **AI-Powered Chat**: Practice conversations with an AI chatbot

### Community & Tools
- **Language Exchange**: In-app chat and partner matching
- **User-Generated Content**: Share mnemonics, tips, and custom decks
- **Grammar Reference**: Short guides and examples
- **Cultural Context**: Moroccan customs, idioms, and proverbs

### Technical Features
- **Offline Mode**: Download lessons for offline learning
- **Transliteration Support**: Toggle between Arabic and Latin script
- **Progress Tracking**: Comprehensive dashboard and analytics
- **Cross-Platform**: Works on Android, iOS, and Web

## 🛠 Tech Stack

- **Frontend**: Flutter (Dart)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: Riverpod
- **Navigation**: GoRouter
- **Audio**: AudioPlayers, Speech-to-Text, Text-to-Speech
- **Local Storage**: Hive, SharedPreferences, SQLite
- **UI/UX**: Material Design 3, Custom Moroccan-inspired theme

## 📱 Screenshots

*Screenshots will be added here*

## 🚀 Getting Started

### Prerequisites
- Flutter SDK (3.0 or higher)
- Dart SDK (3.0 or higher)
- Firebase project setup
- Android Studio / VS Code

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/my_darija_companion.git
   cd my_darija_companion
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Firebase Setup**
   - Create a new Firebase project
   - Enable Authentication, Firestore, and Storage
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place them in the appropriate directories

4. **Run the app**
   ```bash
   flutter run
   ```

## 📁 Project Structure

```
lib/
├── core/
│   ├── constants/          # App constants and configuration
│   ├── theme/             # App theme and styling
│   ├── utils/             # Utility functions
│   └── services/          # Core services
├── data/
│   ├── models/            # Data models
│   ├── repositories/      # Repository implementations
│   └── services/          # Data services
├── domain/
│   ├── entities/          # Business entities
│   ├── repositories/      # Repository interfaces
│   └── usecases/          # Business logic
├── presentation/
│   ├── screens/           # UI screens
│   ├── widgets/           # Reusable widgets
│   ├── providers/         # State management
│   └── navigation/        # Routing
└── shared/
    ├── widgets/           # Shared widgets
    └── models/            # Shared models
```

## 🎨 Design System

The app uses a custom Moroccan-inspired design system with:

- **Primary Colors**: Moroccan Gold (#D4AF37)
- **Secondary Colors**: Deep Blue (#1E3A8A)
- **Accent Colors**: Vibrant Orange (#F97316)
- **Typography**: Google Fonts (Poppins, Noto Sans Arabic)
- **Icons**: Material Design Icons

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### Firebase Configuration
1. Enable Authentication (Email/Password, Google)
2. Set up Firestore Database
3. Configure Storage for audio files
4. Set up Firebase Analytics

## 📊 Features Roadmap

### Phase 1 (Current)
- [x] Basic app structure and navigation
- [x] Authentication system
- [x] Lesson management
- [x] Vocabulary flashcards
- [x] Basic quiz system
- [x] Profile and progress tracking

### Phase 2 (Next)
- [ ] AI-powered conversation chatbot
- [ ] Speech recognition and pronunciation practice
- [ ] Spaced repetition system
- [ ] Offline mode
- [ ] User-generated content

### Phase 3 (Future)
- [ ] Augmented reality vocabulary learning
- [ ] Video lessons with interactive transcripts
- [ ] Language exchange features
- [ ] Advanced analytics and insights
- [ ] Social features and leaderboards

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Moroccan Arabic speakers and teachers
- Flutter and Firebase communities
- Open source contributors
- Beta testers and feedback providers

## 📞 Support

- **Email**: support@mydarijacompanion.com
- **Discord**: [Join our community](https://discord.gg/mydarija)
- **Issues**: [GitHub Issues](https://github.com/yourusername/my_darija_companion/issues)

## 🔗 Links

- **Website**: [mydarijacompanion.com](https://mydarijacompanion.com)
- **Documentation**: [docs.mydarijacompanion.com](https://docs.mydarijacompanion.com)
- **API Reference**: [api.mydarijacompanion.com](https://api.mydarijacompanion.com)

---

Made with ❤️ for the Moroccan Arabic learning community
