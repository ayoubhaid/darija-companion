import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_colors.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _soundEnabled = true;
  bool _vibrationEnabled = true;
  bool _autoPlayAudio = true;
  bool _showTransliteration = true;
  bool _darkModeEnabled = false;
  String _selectedLanguage = 'English';
  String _selectedDifficulty = 'Beginner';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Settings',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Profile Section
            _buildSection(
              'Profile',
              Icons.person,
              [
                _buildListTile(
                  'Edit Profile',
                  'Update your personal information',
                  Icons.edit,
                  onTap: () {
                    // TODO: Navigate to edit profile
                  },
                ),
                _buildListTile(
                  'Change Password',
                  'Update your account password',
                  Icons.lock,
                  onTap: () {
                    // TODO: Navigate to change password
                  },
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Learning Preferences
            _buildSection(
              'Learning Preferences',
              Icons.school,
              [
                _buildDropdownTile(
                  'Difficulty Level',
                  _selectedDifficulty,
                  ['Beginner', 'Intermediate', 'Advanced'],
                  (value) {
                    setState(() {
                      _selectedDifficulty = value!;
                    });
                  },
                ),
                _buildDropdownTile(
                  'Interface Language',
                  _selectedLanguage,
                  ['English', 'French', 'Arabic'],
                  (value) {
                    setState(() {
                      _selectedLanguage = value!;
                    });
                  },
                ),
                _buildSwitchTile(
                  'Show Transliteration',
                  'Display Latin script alongside Arabic text',
                  _showTransliteration,
                  (value) {
                    setState(() {
                      _showTransliteration = value;
                    });
                  },
                ),
                _buildSwitchTile(
                  'Auto-play Audio',
                  'Automatically play pronunciation audio',
                  _autoPlayAudio,
                  (value) {
                    setState(() {
                      _autoPlayAudio = value;
                    });
                  },
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Notifications
            _buildSection(
              'Notifications',
              Icons.notifications,
              [
                _buildSwitchTile(
                  'Push Notifications',
                  'Receive daily reminders and updates',
                  _notificationsEnabled,
                  (value) {
                    setState(() {
                      _notificationsEnabled = value;
                    });
                  },
                ),
                _buildSwitchTile(
                  'Sound',
                  'Play notification sounds',
                  _soundEnabled,
                  (value) {
                    setState(() {
                      _soundEnabled = value;
                    });
                  },
                ),
                _buildSwitchTile(
                  'Vibration',
                  'Vibrate on notifications',
                  _vibrationEnabled,
                  (value) {
                    setState(() {
                      _vibrationEnabled = value;
                    });
                  },
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Appearance
            _buildSection(
              'Appearance',
              Icons.palette,
              [
                _buildSwitchTile(
                  'Dark Mode',
                  'Use dark theme',
                  _darkModeEnabled,
                  (value) {
                    setState(() {
                      _darkModeEnabled = value;
                    });
                  },
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Data & Storage
            _buildSection(
              'Data & Storage',
              Icons.storage,
              [
                _buildListTile(
                  'Download Lessons',
                  'Store lessons for offline use',
                  Icons.download,
                  onTap: () {
                    _showDownloadDialog();
                  },
                ),
                _buildListTile(
                  'Clear Cache',
                  'Free up storage space',
                  Icons.clear_all,
                  onTap: () {
                    _showClearCacheDialog();
                  },
                ),
                _buildListTile(
                  'Export Data',
                  'Backup your progress',
                  Icons.backup,
                  onTap: () {
                    _showExportDialog();
                  },
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Support & About
            _buildSection(
              'Support & About',
              Icons.help,
              [
                _buildListTile(
                  'Help & FAQ',
                  'Get help and answers',
                  Icons.help_outline,
                  onTap: () {
                    // TODO: Navigate to help
                  },
                ),
                _buildListTile(
                  'Contact Support',
                  'Get in touch with us',
                  Icons.support_agent,
                  onTap: () {
                    // TODO: Navigate to contact
                  },
                ),
                _buildListTile(
                  'Rate App',
                  'Rate us on the app store',
                  Icons.star,
                  onTap: () {
                    // TODO: Open app store
                  },
                ),
                _buildListTile(
                  'About',
                  'App version and information',
                  Icons.info,
                  onTap: () {
                    _showAboutDialog();
                  },
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Account Actions
            _buildSection(
              'Account',
              Icons.account_circle,
              [
                _buildListTile(
                  'Privacy Policy',
                  'Read our privacy policy',
                  Icons.privacy_tip,
                  onTap: () {
                    // TODO: Open privacy policy
                  },
                ),
                _buildListTile(
                  'Terms of Service',
                  'Read our terms of service',
                  Icons.description,
                  onTap: () {
                    // TODO: Open terms of service
                  },
                ),
                _buildListTile(
                  'Sign Out',
                  'Sign out of your account',
                  Icons.logout,
                  onTap: () {
                    _showSignOutDialog();
                  },
                  isDestructive: true,
                ),
              ],
            ),
            
            const SizedBox(height: 100), // Bottom padding
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, IconData icon, List<Widget> children) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  color: AppColors.primary,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildListTile(
    String title,
    String subtitle,
    IconData icon, {
    VoidCallback? onTap,
    bool isDestructive = false,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: isDestructive ? AppColors.error : AppColors.textSecondary,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isDestructive ? AppColors.error : AppColors.textPrimary,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: AppColors.textSecondary,
        ),
      ),
      trailing: const Icon(Icons.arrow_forward_ios),
      onTap: onTap,
    );
  }

  Widget _buildSwitchTile(
    String title,
    String subtitle,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return ListTile(
      title: Text(title),
      subtitle: Text(
        subtitle,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: AppColors.textSecondary,
        ),
      ),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: AppColors.primary,
      ),
    );
  }

  Widget _buildDropdownTile(
    String title,
    String value,
    List<String> options,
    ValueChanged<String?> onChanged,
  ) {
    return ListTile(
      title: Text(title),
      trailing: DropdownButton<String>(
        value: value,
        items: options.map((option) {
          return DropdownMenuItem(
            value: option,
            child: Text(option),
          );
        }).toList(),
        onChanged: onChanged,
        underline: Container(),
      ),
    );
  }

  void _showDownloadDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Download Lessons'),
        content: const Text('This will download all lessons for offline use. This may take some time and use significant storage space.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              // TODO: Implement download
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Download started!')),
              );
            },
            child: const Text('Download'),
          ),
        ],
      ),
    );
  }

  void _showClearCacheDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Cache'),
        content: const Text('This will clear all cached data. You\'ll need to download lessons again for offline use.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              // TODO: Implement clear cache
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Cache cleared!')),
              );
            },
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }

  void _showExportDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Export Data'),
        content: const Text('Export your learning progress and data to a file.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              // TODO: Implement export
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Data exported!')),
              );
            },
            child: const Text('Export'),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('About'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('My Darija Companion'),
            const SizedBox(height: 8),
            Text('Version 1.0.0'),
            const SizedBox(height: 16),
            const Text('Learn Moroccan Arabic (Darija) with interactive lessons and AI-powered features.'),
            const SizedBox(height: 16),
            const Text('© 2024 My Darija Companion. All rights reserved.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showSignOutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              // TODO: Implement sign out
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Signed out successfully!')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
            ),
            child: const Text('Sign Out'),
          ),
        ],
      ),
    );
  }
} 