# HerSafety - Mobile 🛡️

HerSafety is a comprehensive women's personal safety application designed to provide instant emergency assistance, safe routing, and a trusted guardian network.

## 🏆 Hackathon Submissions
This project was built for:
1. **RevenueCat Shipaton 2026**
2. **Amazon Developer Hackathon**
3. **Beginner's Paradise: First Commit**

## 🚀 Features
- **SOS Emergency Alert**: Instantly notify your Guardian Grid and local authorities with your live location.
- **SafeRoute (AI Powered)**: Navigate safely with routes analyzed for lighting, foot traffic, and historical safety data.
- **Guardian Grid**: A trusted network of contacts who automatically receive your live location and audio recordings during an emergency.
- **Live Threat Radar**: Real-time safety alerts based on community reports.

## 🛠️ Technologies Used
- **Frontend**: React Native, Expo, Expo Router
- **UI & Styling**: Lucide React Native, Custom StyleSheet
- **Monetization**: RevenueCat SDK (react-native-purchases)
- **AI Integration**: AWS Bedrock (Claude 3 Sonnet) for SafeRoute threat analysis
- **Voice**: Alexa+ MCP Server integration (for hands-free SOS)

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18
- npm or yarn
- Expo Go app on your mobile device (or iOS Simulator / Android Emulator)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yashhhYB/HerSafety-Mobile-.git
   cd HerSafety-Mobile-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npx expo start
   ```

4. Choose your platform:
   - **Mobile**: Open the Expo Go app on your phone and scan the QR code displayed in the terminal.
   - **Web**: Press `w` in the terminal to open the app in a web browser.
   - **Android Emulator**: Press `a` in the terminal.
   - **iOS Simulator**: Press `i` in the terminal (Requires macOS).

## 🌐 Web Version
This repository contains the mobile application built with React Native and Expo. 
The browser (web) version of the HerSafety application can be found at: 
[**HerSafety Web Application**](https://github.com/yashhhYB/HerSafetyy)

## 🤖 AI Usage Disclosure
As required by the **First Commit** hackathon guidelines:
- **Code Generation & Mentoring**: I used Google's Antigravity AI assistant to help mentor me through setting up React Native/Expo, writing the boilerplate code for the UI screens, and structuring the navigation layout.
- **Debugging**: AI was used to troubleshoot package installation issues (like React Native version mismatches).
- **Understanding**: The AI explained how Expo Router handles navigation, how to use React Native `Animated` for the SOS button pulse effect, and how to structure the RevenueCat configuration.
- **Original Work**: The core idea, feature planning, color scheme choices, and integration logic were driven by me. The AI acted as a pair-programmer to help execute the vision quickly during the hackathon timeframe.

## 📚 What I Learned
During this hackathon, I learned:
- How to bootstrap a mobile app using Expo and Expo Router.
- How to build animated UI components in React Native (the pulsing SOS button).
- How to structure full-screen modals vs standard screens.
- How to integrate the RevenueCat SDK for subscription paywalls.
- How to organize a project into multiple commits to show development progress.

## 🤝 Credits
- Icons provided by [Lucide](https://lucide.dev/)
- Built using the [Expo framework](https://expo.dev/)
- Subscription management via [RevenueCat](https://www.revenuecat.com/)
