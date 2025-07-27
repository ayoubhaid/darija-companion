# Firebase Setup Guide for My Darija Companion

## 🚀 Quick Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `my-darija-companion`
4. Enable Google Analytics (recommended)
5. Choose analytics location
6. Click "Create project"

### 2. Add Your App to Firebase

#### For Android:
1. In Firebase Console, click the Android icon (</>) to add Android app
2. Android package name: `com.example.my_darija_companion`
3. App nickname: `My Darija Companion`
4. Debug signing certificate SHA-1: (optional for now)
5. Click "Register app"
6. Download `google-services.json`
7. Place it in: `android/app/google-services.json`

#### For iOS:
1. In Firebase Console, click the iOS icon to add iOS app
2. iOS bundle ID: `com.example.myDarijaCompanion`
3. App nickname: `My Darija Companion`
4. App Store ID: (optional)
5. Click "Register app"
6. Download `GoogleService-Info.plist`
7. Place it in: `ios/Runner/GoogleService-Info.plist`

### 3. Enable Firebase Services

#### Authentication:
1. Go to Authentication → Sign-in method
2. Enable "Email/Password"
3. Enable "Google" (optional)
4. For Google Sign-in, add your app's SHA-1 fingerprint

#### Firestore Database:
1. Go to Firestore Database → Create database
2. Start in test mode
3. Choose location (recommend: `us-central1` or closest to your users)
4. Click "Done"

#### Storage:
1. Go to Storage → Get started
2. Start in test mode
3. Choose same location as Firestore
4. Click "Done"

### 4. Configure Security Rules

#### Firestore Rules:
1. Go to Firestore Database → Rules
2. Replace with the content from `firestore.rules` file
3. Click "Publish"

#### Storage Rules:
1. Go to Storage → Rules
2. Replace with the content from `storage.rules` file
3. Click "Publish"

### 5. Get SHA-1 Fingerprint (for Google Sign-in)

#### For Android:
```bash
cd android
./gradlew signingReport
```
Look for the SHA-1 value and add it to Firebase Console → Project Settings → Your Apps → Android app → Add fingerprint

#### For iOS:
No SHA-1 needed, but make sure your bundle ID matches exactly.

### 6. Test the Setup

Run the app:
```bash
flutter run
```

## 🔧 Configuration Details

### Firebase Console Settings

#### Project Settings:
- Project ID: `my-darija-companion-xxxxx`
- Project name: `My Darija Companion`
- Default GCP resource location: Choose closest to your users

#### Authentication Settings:
- Authorized domains: Add your custom domain if needed
- Sign-in providers: Email/Password, Google (optional)

#### Firestore Settings:
- Database location: `us-central1` (or closest to users)
- Security rules: Use the provided `firestore.rules`

#### Storage Settings:
- Storage location: Same as Firestore
- Security rules: Use the provided `storage.rules`

### Environment Variables

Create a `.env` file in your project root:
```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_PROJECT_ID=my-darija-companion-xxxxx
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:android:abcdef123456
```

### Android Configuration

Make sure your `android/app/build.gradle` has:
```gradle
android {
    defaultConfig {
        applicationId "com.example.my_darija_companion"
        minSdkVersion 21
        targetSdkVersion 33
    }
}
```

And `android/build.gradle` has:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

### iOS Configuration

Make sure your `ios/Runner/Info.plist` has:
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>REVERSED_CLIENT_ID</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.YOUR_REVERSED_CLIENT_ID</string>
        </array>
    </dict>
</array>
```

## 🧪 Testing Firebase Connection

### Test Authentication:
1. Run the app
2. Try to sign up with email/password
3. Check Firebase Console → Authentication → Users

### Test Firestore:
1. Complete a lesson or quiz
2. Check Firebase Console → Firestore Database → Data

### Test Storage:
1. Upload a profile picture
2. Check Firebase Console → Storage → Files

## 🚨 Common Issues & Solutions

### Issue: "Firebase not initialized"
**Solution:** Make sure `google-services.json` and `GoogleService-Info.plist` are in the correct locations.

### Issue: "Permission denied"
**Solution:** Check that security rules are properly configured and published.

### Issue: "SHA-1 fingerprint not found"
**Solution:** Add your app's SHA-1 to Firebase Console → Project Settings → Your Apps.

### Issue: "Network error"
**Solution:** Check your internet connection and Firebase project location.

## 📱 Production Deployment

### Before going live:
1. Update security rules to production mode
2. Set up proper authentication methods
3. Configure custom domains
4. Set up monitoring and analytics
5. Test all features thoroughly

### Security Rules for Production:
Update the rules to be more restrictive:
- Remove "test mode" settings
- Add proper user authentication checks
- Implement rate limiting
- Add data validation

## 🔍 Monitoring & Analytics

### Firebase Analytics:
- User engagement
- Feature usage
- Crash reports
- Performance monitoring

### Firebase Performance:
- App startup time
- Network requests
- Custom traces

### Firebase Crashlytics:
- Crash reporting
- Error tracking
- Performance issues

## 📞 Support

If you encounter issues:
1. Check Firebase Console for error messages
2. Review security rules
3. Verify configuration files
4. Check Flutter Firebase documentation
5. Contact Firebase support if needed

## 🎯 Next Steps

After Firebase is set up:
1. Test all authentication flows
2. Verify data persistence
3. Test offline functionality
4. Set up push notifications
5. Configure analytics events
6. Deploy to app stores 