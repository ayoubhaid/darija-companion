import 'dart:io';

void main() async {
  print('🔥 Firebase Setup for My Darija Companion');
  print('==========================================\n');

  // Check if configuration files exist
  await checkConfigurationFiles();
  
  // Provide setup instructions
  printSetupInstructions();
  
  // Test Firebase connection
  await testFirebaseConnection();
}

Future<void> checkConfigurationFiles() async {
  print('📁 Checking configuration files...');
  
  // Check Android configuration
  final androidConfig = File('android/app/google-services.json');
  if (await androidConfig.exists()) {
    print('✅ android/app/google-services.json found');
  } else {
    print('❌ android/app/google-services.json missing');
    print('   Download from Firebase Console → Project Settings → Your Apps → Android app');
  }
  
  // Check iOS configuration
  final iosConfig = File('ios/Runner/GoogleService-Info.plist');
  if (await iosConfig.exists()) {
    print('✅ ios/Runner/GoogleService-Info.plist found');
  } else {
    print('❌ ios/Runner/GoogleService-Info.plist missing');
    print('   Download from Firebase Console → Project Settings → Your Apps → iOS app');
  }
  
  print('');
}

void printSetupInstructions() {
  print('📋 Setup Instructions:');
  print('1. Create Firebase project at https://console.firebase.google.com/');
  print('2. Add Android app with package name: com.example.my_darija_companion');
  print('3. Add iOS app with bundle ID: com.example.myDarijaCompanion');
  print('4. Download configuration files and place them in the correct locations');
  print('5. Enable Authentication (Email/Password)');
  print('6. Create Firestore Database in test mode');
  print('7. Enable Storage in test mode');
  print('8. Deploy security rules from firestore.rules and storage.rules');
  print('');
}

Future<void> testFirebaseConnection() async {
  print('🧪 Testing Firebase connection...');
  
  try {
    // This would test the actual Firebase connection
    // For now, just provide guidance
    print('ℹ️  To test Firebase connection:');
    print('   1. Run: flutter run');
    print('   2. Try to sign up with email/password');
    print('   3. Check Firebase Console → Authentication → Users');
    print('   4. Complete a lesson and check Firestore Database');
  } catch (e) {
    print('❌ Firebase connection test failed: $e');
  }
  
  print('');
}

void printNextSteps() {
  print('🚀 Next Steps:');
  print('1. Run the app: flutter run');
  print('2. Test authentication flows');
  print('3. Verify data persistence');
  print('4. Test offline functionality');
  print('5. Set up push notifications');
  print('6. Configure analytics events');
  print('7. Deploy to app stores');
  print('');
} 