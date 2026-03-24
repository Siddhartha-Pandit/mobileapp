# Application Consistency Guide

This document outlines the rules and guidelines to maintain consistency across the Dhukuti application. Following these guidelines ensures a cohesive user experience, especially dealing with cross-platform (iOS/Android/Web) nuances.

## 1. Guiding Principles

- **Premium UI/UX:** The app must feel high-quality, utilizing generous padding, large rounded corners (`borderRadius: 20-30`), and soft shadows to create depth.
- **Cross-Platform Compatibility:** Features must work elegantly on iOS, Android, and Web without horizontal scrolling or visual breakage.
- **One-Handed Usability:** Critical UI elements (like the Bottom Navigation Bar and primary CTAs) should be within easy reach at the bottom of the screen.

## 2. UI/UX Style Guide

### Colors

- Theme colors are defined centrally and MUST be accessed via the `useTheme()` hook. 
- Avoid hardcoding hex colors for text/backgrounds to ensure Dark Mode compatibility.
- Example usage: `backgroundColor: theme.surface`, `color: theme.textPrimary`.

### Component Library

Use the shared components from the `components/` directory:
- **Buttons:** Use `PrimaryButton` for main calls-to-action. Do not use raw `TouchableOpacity` with text unless building a custom list item.
- **Cards:** Use `Card` and `CardContent` to wrap visual sections.
- **Inputs:** Use `AmountInput` or custom text inputs that adhere to the visual style.
- **Headers:** Always use `HeaderBar` with `leftContent` representing a back button when deeply navigated.

### Layout & Spacing Rules

- **Safe Areas:** Always wrap main screens in `SafeAreaView` from `react-native-safe-area-context` to avoid notches and status bars.
- **Bottom Navigation Offset [CRITICAL]:** Any main screen with a `ScrollView` that is accessible while the `BottomNavBar` is visible MUST have a `contentContainerStyle` with at least `paddingBottom: 120`. This prevents list items from being permanently hidden behind the floating navbar element.
- **Sticky Footers:** Absolute positioned footers (e.g., Save Buttons) should sit above the bottom edge, using `bottom: 72` or `bottom: 90` depending on the surrounding context.

## 3. React Native Web Specifics

Since this app runs heavily on the web (`npm run web`), special styling care must be taken:

- **Shadows:** React Native's legacy shadow props (`shadowOffset`, `shadowOpacity`, `shadowRadius`) trigger deprecation warnings on the web. Always use the modern CSS-like `boxShadow` string instead (e.g., `boxShadow: '0 8px 16px rgba(0,0,0,0.25)'`) in conjunction with `elevation` for Android.
- **Text Input Outlines:** Desktop browsers automatically draw a harsh focus ring (outline) around focused inputs. If building a custom input UI (like `AmountInput`), you MUST append ` outlineStyle: 'none' ` conditionally for the web platform to prevent this visual artifact:
  ```typescript
  ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {})
  ```

## 4. Code Style and Conventions

- **File Naming:** Use kebab-case for Expo Router screen files (e.g., `user-profile.tsx`, `manage-categories.tsx`).
- **Component Naming:** Use PascalCase for standard React components (e.g., `HeaderBar`, `AmountInput`).
- **Icons:** Always use `lucide-react-native`.

By following these exact guidelines, we ensure that new routes and features integrate seamlessly into the existing Dhukuti ecosystem without breaking layout or styling rules.
