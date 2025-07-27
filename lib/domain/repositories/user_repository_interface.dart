import '../entities/user.dart';

abstract class UserRepositoryInterface {
  Future<User?> getUser(String userId);
  Future<void> createUser(User user);
  Future<void> updateUser(User user);
  Future<void> deleteUser(String userId);
  Future<List<User>> getAllUsers();
  Future<User?> getUserByEmail(String email);
  Future<User?> getUserByUsername(String username);
  Future<void> updateUserProgress(String userId, UserProgress progress);
  Future<void> updateUserStats(String userId, UserStats stats);
  Future<void> updateUserLevel(String userId, UserLevel level);
  Future<void> updateUserStreak(String userId, int currentStreak, int longestStreak);
  Future<void> addUserBadge(String userId, String badge);
  Future<void> updateUserPreferences(String userId, UserPreferences preferences);
  Future<void> addUserXp(String userId, int xp);
  Future<List<User>> getTopUsers({int limit = 10});
  Future<List<User>> getUsersByLevel(int level);
  Future<List<User>> getUsersByStreak(int minStreak);
  Stream<User?> watchUser(String userId);
  Stream<List<User>> watchTopUsers({int limit = 10});
  Future<void> updateLastActive(String userId);
  Future<bool> checkUsernameAvailability(String username);
  Future<bool> checkEmailAvailability(String email);
} 