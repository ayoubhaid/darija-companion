import 'package:flutter/material.dart';

class AppColors {
  // Primary Moroccan-inspired colors
  static const Color primary = Color(0xFFD4AF37); // Moroccan Gold
  static const Color primaryDark = Color(0xFFB8941F);
  static const Color primaryLight = Color(0xFFE6C866);
  
  // Secondary colors
  static const Color secondary = Color(0xFF1E3A8A); // Deep Blue
  static const Color secondaryDark = Color(0xFF1E40AF);
  static const Color secondaryLight = Color(0xFF3B82F6);
  
  // Accent colors
  static const Color accent = Color(0xFFF97316); // Vibrant Orange
  static const Color accentDark = Color(0xFFEA580C);
  static const Color accentLight = Color(0xFFFB923C);
  
  // Background colors
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF5F5F5);
  
  // Text colors
  static const Color textPrimary = Color(0xFF1F2937);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textLight = Color(0xFF9CA3AF);
  static const Color textOnPrimary = Color(0xFFFFFFFF);
  static const Color textOnSecondary = Color(0xFFFFFFFF);
  
  // Status colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);
  
  // Moroccan pattern colors
  static const Color patternBlue = Color(0xFF1E40AF);
  static const Color patternGreen = Color(0xFF059669);
  static const Color patternPurple = Color(0xFF7C3AED);
  static const Color patternOrange = Color(0xFFEA580C);
  static const Color patternRed = Color(0xFFDC2626);
  static const Color patternYellow = Color(0xFFD97706);
  
  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFFD4AF37),
      Color(0xFFB8941F),
    ],
  );
  
  static const LinearGradient secondaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF1E3A8A),
      Color(0xFF1E40AF),
    ],
  );
  
  static const LinearGradient accentGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFFF97316),
      Color(0xFFEA580C),
    ],
  );
  
  // Shadow
  static const Color shadow = Color(0xFF000000);
  
  // Overlay colors
  static const Color overlay = Color(0x80000000);
  static const Color overlayLight = Color(0x40000000);
  
  // Border colors
  static const Color border = Color(0xFFE5E7EB);
  static const Color borderLight = Color(0xFFF3F4F6);
  
  // Disabled colors
  static const Color disabled = Color(0xFFD1D5DB);
  static const Color disabledText = Color(0xFF9CA3AF);
  
  // Focus colors
  static const Color focus = Color(0xFF3B82F6);
  static const Color focusLight = Color(0xFFDBEAFE);
  
  // Selection colors
  static const Color selection = Color(0xFFDBEAFE);
  static const Color selectionText = Color(0xFF1E40AF);
  
  // Link colors
  static const Color link = Color(0xFF3B82F6);
  static const Color linkVisited = Color(0xFF7C3AED);
  static const Color linkHover = Color(0xFF1E40AF);
  
  // Code colors
  static const Color codeBackground = Color(0xFFF3F4F6);
  static const Color codeText = Color(0xFF1F2937);
  static const Color codeComment = Color(0xFF6B7280);
  static const Color codeKeyword = Color(0xFFDC2626);
  static const Color codeString = Color(0xFF059669);
  static const Color codeNumber = Color(0xFF7C3AED);
  
  // Chart colors
  static const List<Color> chartColors = [
    Color(0xFF3B82F6),
    Color(0xFF10B981),
    Color(0xFFF59E0B),
    Color(0xFFEF4444),
    Color(0xFF8B5CF6),
    Color(0xFF06B6D4),
    Color(0xFF84CC16),
    Color(0xFFF97316),
  ];
  
  // Heatmap colors
  static const List<Color> heatmapColors = [
    Color(0xFFEBEDF0),
    Color(0xFF9BE9A8),
    Color(0xFF40C463),
    Color(0xFF30A14E),
    Color(0xFF216E39),
  ];
  
  // Semantic colors
  static const Color positive = Color(0xFF10B981);
  static const Color negative = Color(0xFFEF4444);
  static const Color neutral = Color(0xFF6B7280);
  static const Color attention = Color(0xFFF59E0B);
  
  // Brand colors
  static const Color brandPrimary = Color(0xFFD4AF37);
  static const Color brandSecondary = Color(0xFF1E3A8A);
  static const Color brandAccent = Color(0xFFF97316);
  
  // Material Design 3 colors
  static const ColorScheme lightColorScheme = ColorScheme(
    brightness: Brightness.light,
    primary: primary,
    onPrimary: textOnPrimary,
    secondary: secondary,
    onSecondary: textOnPrimary,
    tertiary: accent,
    onTertiary: textOnPrimary,
    error: error,
    onError: textOnPrimary,
    surface: surface,
    onSurface: textPrimary,
    surfaceContainerHighest: surfaceVariant,
    onSurfaceVariant: textSecondary,
    outline: border,
    outlineVariant: borderLight,
    shadow: shadow,
    scrim: overlay,
    inverseSurface: textPrimary,
    onInverseSurface: surface,
    inversePrimary: primaryLight,
    surfaceTint: primary,
  );
  
  static const ColorScheme darkColorScheme = ColorScheme(
    brightness: Brightness.dark,
    primary: primaryLight,
    onPrimary: textPrimary,
    secondary: secondaryLight,
    onSecondary: textPrimary,
    tertiary: accentLight,
    onTertiary: textPrimary,
    error: error,
    onError: textOnPrimary,
    surface: Color(0xFF1F1F1F),
    onSurface: Color(0xFFE5E7EB),
    surfaceContainerHighest: Color(0xFF2D2D2D),
    onSurfaceVariant: Color(0xFFD1D5DB),
    outline: Color(0xFF404040),
    outlineVariant: Color(0xFF525252),
    shadow: shadow,
    scrim: overlay,
    inverseSurface: Color(0xFFE5E7EB),
    onInverseSurface: Color(0xFF1F1F1F),
    inversePrimary: primaryDark,
    surfaceTint: primaryLight,
  );
} 