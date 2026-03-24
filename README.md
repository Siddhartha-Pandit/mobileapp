# Dhukuti - Personal Finance App

Dhukuti is a premium, mobile-first personal finance application designed for simplicity, comprehensive tracking, and a seamless user experience. It provides a complete suite of tools for budgeting, expense tracking, portfolio management, and financial planning.

## ✨ Key Features

- **Comprehensive Account Management:** Track diverse financial sources including Bank Accounts, Cash, Credit Cards, and Investments.
- **Goal & Budget Tracking:** Implement the 50/30/20 budgeting rule, set custom category limits, and track your progress in real time.
- **Investment Portfolios:** Monitor your external investments, securely tracking assets like Gold and Securities.
- **Split Bills & IOUs:** Easily manage shared expenses with contacts and keep track of who owes whom.
- **Recurring Transactions:** Automate and track your subscriptions, rent, and recurring bills.
- **Advanced Analytics:** Visualize your wealth distribution and growth with built-in Donut and Line charts.
- **Customizable Categories:** Categorize your spending with system-wide defaults or create your own custom categories with personalized icons and colors.
- **Admin Scripts & Cron Jobs:** Secure, administrative UI to manually trigger background data workers (e.g. Stock and Gold scrapers).
- **Premium Themed Interface:** Built-in Light and Dark mode using a centralized, stylish design system.
- **Cross-Platform:** Built with React Native and Expo, Dhukuti runs beautifully on Android, iOS, and the Web.

## 🚀 Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Routing:** Expo Router (File-based routing)
- **Icons:** `lucide-react-native`
- **UI Architecture:** Custom-built React Native components (`Card`, `PrimaryButton`, `AmountInput`) with Web-compatibility support.

## 🏁 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js installed on your system.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd dhukuti/mobileapp
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npx expo start
    ```

This will open the Expo DevTools in your browser. You can then run the app on:

-   An Android emulator or physical device
-   An iOS simulator or physical device
-   In your web browser (using `npm run web`)

## 🤝 Contributing

Contributions are welcome! Please thoroughly review the `CONSISTENCY_GUIDE.md` for design principles, component usage, and React Native Web styling conventions before submitting a pull request.
