// import 'package:firebase_core/firebase_core.dart';
// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:firebase_storage/firebase_storage.dart';
// import 'package:firebase_analytics/firebase_analytics.dart';
// import 'package:firebase_messaging/firebase_messaging.dart';

class FirebaseService {
  // static FirebaseAuth? _auth;
  // static FirebaseFirestore? _firestore;
  // static FirebaseStorage? _storage;
  // static FirebaseAnalytics? _analytics;
  // static FirebaseMessaging? _messaging;

  // static FirebaseAuth get auth => _auth!;
  // static FirebaseFirestore get firestore => _firestore!;
  // static FirebaseStorage get storage => _storage!;
  // static FirebaseAnalytics get analytics => _analytics!;
  // static FirebaseMessaging get messaging => _messaging!;

  // static Future<void> initialize() async {
  //   try {
  //     // Initialize Firebase Core
  //     await Firebase.initializeApp(
  //       options: DefaultFirebaseOptions.currentPlatform,
  //     );

  //     // Initialize Firebase services
  //     _auth = FirebaseAuth.instance;
  //     _firestore = FirebaseFirestore.instance;
  //     _storage = FirebaseStorage.instance;
  //     _analytics = FirebaseAnalytics.instance;
  //     _messaging = FirebaseMessaging.instance;

  //     // Configure Firestore settings
  //     await _firestore!.settings = const Settings(
  //       persistenceEnabled: true,
  //       cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
  //     );

  //     // Request notification permissions
  //     await _requestNotificationPermissions();

  //     print('Firebase initialized successfully');
  //   } catch (e) {
  //     print('Error initializing Firebase: $e');
  //     rethrow;
  //   }
  // }

  // static Future<void> _requestNotificationPermissions() async {
  //   try {
  //     final settings = await _messaging!.requestPermission(
  //       alert: true,
  //       announcement: false,
  //       badge: true,
  //       carPlay: false,
  //       criticalAlert: false,
  //       provisional: false,
  //       sound: true,
  //     );

  //     print('Notification permission status: ${settings.authorizationStatus}');
  //   } catch (e) {
  //     print('Error requesting notification permissions: $e');
  //   }
  // }

  // static Future<String?> getFCMToken() async {
  //   try {
  //     return await _messaging!.getToken();
  //   } catch (e) {
  //     print('Error getting FCM token: $e');
  //     return null;
  //   }
  // }

  // static Future<void> subscribeToTopic(String topic) async {
  //   try {
  //     await _messaging!.subscribeToTopic(topic);
  //     print('Subscribed to topic: $topic');
  //   } catch (e) {
  //     print('Error subscribing to topic: $e');
  //   }
  // }

  // static Future<void> unsubscribeFromTopic(String topic) async {
  //   try {
  //     await _messaging!.unsubscribeFromTopic(topic);
  //     print('Unsubscribed from topic: $topic');
  //   } catch (e) {
  //     print('Error unsubscribing from topic: $e');
  //   }
  // }

  // static Future<void> logEvent(String name, {Map<String, dynamic>? parameters}) async {
  //   try {
  //     await _analytics!.logEvent(
  //       name: name,
  //       parameters: parameters,
  //     );
  //   } catch (e) {
  //     print('Error logging analytics event: $e');
  //   }
  // }

  // static Future<void> setUserProperty(String name, String value) async {
  //   try {
  //     await _analytics!.setUserProperty(name: name, value: value);
  //   } catch (e) {
  //     print('Error setting user property: $e');
  //   }
  // }

  // static Future<void> setUserId(String userId) async {
  //   try {
  //     await _analytics!.setUserId(id: userId);
  //   } catch (e) {
  //     print('Error setting user ID: $e');
  //   }
  // }

  // static Future<String> uploadFile(String path, List<int> bytes) async {
  //   try {
  //     final ref = _storage!.ref().child(path);
  //     final uploadTask = ref.putData(bytes);
  //     final snapshot = await uploadTask;
  //     return await snapshot.ref.getDownloadURL();
  //   } catch (e) {
  //     print('Error uploading file: $e');
  //     rethrow;
  //   }
  // }

  // static Future<void> deleteFile(String path) async {
  //   try {
  //     final ref = _storage!.ref().child(path);
  //     await ref.delete();
  //   } catch (e) {
  //     print('Error deleting file: $e');
  //     rethrow;
  //   }
  // }

  // static Future<String> getDownloadURL(String path) async {
  //   try {
  //     final ref = _storage!.ref().child(path);
  //     return await ref.getDownloadURL();
  //   } catch (e) {
  //     print('Error getting download URL: $e');
  //     rethrow;
  //   }
  // }

  // Mock implementation for local development
  static Future<void> initialize() async {
    print('Firebase service disabled - running in local mode');
    await Future.delayed(const Duration(seconds: 1));
  }

  static Future<String?> getFCMToken() async {
    return 'mock-fcm-token';
  }

  static Future<void> subscribeToTopic(String topic) async {
    print('Mock: Subscribed to topic: $topic');
  }

  static Future<void> unsubscribeFromTopic(String topic) async {
    print('Mock: Unsubscribed from topic: $topic');
  }

  static Future<void> logEvent(String name, {Map<String, dynamic>? parameters}) async {
    print('Mock: Logged event: $name with parameters: $parameters');
  }

  static Future<void> setUserProperty(String name, String value) async {
    print('Mock: Set user property: $name = $value');
  }

  static Future<void> setUserId(String userId) async {
    print('Mock: Set user ID: $userId');
  }

  static Future<String> uploadFile(String path, List<int> bytes) async {
    print('Mock: Uploaded file to: $path');
    return 'mock-download-url';
  }

  static Future<void> deleteFile(String path) async {
    print('Mock: Deleted file: $path');
  }

  static Future<String> getDownloadURL(String path) async {
    print('Mock: Getting download URL for: $path');
    return 'mock-download-url';
  }
} 