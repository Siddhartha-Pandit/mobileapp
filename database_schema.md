# Database Design (MongoDB)

This document outlines the MongoDB multi-user database schema tailored for this personal finance application based on an analysis of its existing pages.

## 1. Users Collection (`users`)
Stores both `user` and `admin` accounts. The application has one Admin by default or designated via the DB.

```typescript
{
  _id: ObjectId,
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  avatarUrl: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  occupation: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Secret'] },
  
  // App Preferences
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    currency: { type: String, default: 'INR' },
    notificationsEnabled: { type: Boolean, default: true },
    twoFactorAuth: { type: Boolean, default: false }
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

## 2. Accounts Collection (`accounts`)
Represents the user's various sources of funds (Bank, Cash, Investment, Loan accounts).

```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'users', required: true }, // The owner
  name: { type: String, required: true }, // e.g., "HDFC Savings", "Emergency Fund"
  type: { type: String, enum: ['bank', 'savings', 'investment', 'cash', 'credit'] },
  balance: { type: Number, default: 0 },
  icon: { type: String }, // name of Lucide icon
  color: { type: String }, // hex color string
  isArchived: { type: Boolean, default: false },
  createdAt: Date
}
```

## 3. Categories Collection (`categories`)
Supports both system-wide default categories (managed by admin) and custom user-defined categories.

```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'users', default: null }, // Null means Admin/System created
  name: { type: String, required: true }, // e.g. "Food", "Entertainment"
  type: { type: String, enum: ['income', 'expense'] },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}
```

## 4. Transactions Collection (`transactions`)
The core logging table for any movement of money (Income, Expense, Transfer).

```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'users', required: true },
  accountId: { type: ObjectId, ref: 'accounts', required: true },
  
  // Optional: Only for transfers from one account to another
  toAccountId: { type: ObjectId, ref: 'accounts' }, 
  
  categoryId: { type: ObjectId, ref: 'categories' },
  type: { type: String, enum: ['income', 'expense', 'transfer'] },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  payeeOrPayer: { type: String },
  note: { type: String },
  
  // Optional details for splits, bills, or loans
  personId: { type: ObjectId, ref: 'persons' }, 
  
  // Link back to a recurring job if auto-created
  recurringTransactionId: { type: ObjectId, ref: 'recurring_transactions' },
  
  receiptImage: { type: String }, // URL
  createdAt: Date
}
```

## 5. Recurring Transactions / Subscriptions (`recurring_transactions`)
Automatic recurring bills or income like Netflix, Salary, Rent.

```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'users', required: true },
  accountId: { type: ObjectId, ref: 'accounts', required: true },
  categoryId: { type: ObjectId, ref: 'categories' },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
  nextDueDate: { type: Date },
  lastPaidDate: { type: Date },
  
  autoPay: { type: Boolean, default: false }, // Whether system auto-creates Trans at NextDueDate
  isActive: { type: Boolean, default: true },
  createdAt: Date
}
```

## 6. Budget & Goals (`budgets`)
Tracks Monthly Income settings and the 50/30/20 Goal rule, plus Custom Category specific Goals.

```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'users', required: true, unique: true },
  
  // Monthly income used as the baseline for the 50/30/20 rule
  estimatedMonthlyIncome: { type: Number, required: true },
  
  // Strategy
  strategy: {
    needsPercentage: { type: Number, default: 50 },
    wantsPercentage: { type: Number, default: 30 },
    savingsPercentage: { type: Number, default: 20 },
  },
  
  // Specific Category Limits (Overrides strategy for specific things)
  categoryLimits: [{
    categoryId: { type: ObjectId, ref: 'categories' },
    limitAmount: { type: Number }
  }],
  
  smartReminders: { type: Boolean, default: true }
}
```

## 7. Portfolio (Securities & Gold) (`portfolios`)
Manages Assets purchased/sold.

```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'users', required: true },
  type: { type: String, enum: ['gold', 'securities', 'crypto', 'real_estate'] },
  symbol: { type: String }, // e.g. "AAPL", "24K Gold"
  quantity: { type: Number },
  averageBuyPrice: { type: Number },
  lastKnownPrice: { type: Number }, // Synced via a market API worker
  isArchived: { type: Boolean, default: false },
  createdAt: Date
}
```

## 8. Persons (Contacts) (`persons`)
A contact list tailored for the IOU / Split Bill features.

```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'users', required: true },
  name: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String },
  
  // Computed balance summary: (+) Means they owe you, (-) Means you owe them
  netBalance: { type: Number, default: 0 },
  createdAt: Date
}
```

## 9. Split Bills & Loans (`debts`)
Maintains the record of an IOU or a settled loan.

```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'users', required: true },
  personId: { type: ObjectId, ref: 'persons', required: true },
  
  type: { type: String, enum: ['i_owe', 'they_owe', 'loan_given', 'loan_taken'] },
  originalAmount: { type: Number, required: true },
  remainingAmount: { type: Number, required: true },
  
  interestRate: { type: Number, default: 0 }, // If loan
  emiAmount: { type: Number, default: 0 }, // If loan
  
  purpose: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ['active', 'settled'] },
  createdAt: Date
}
```

## 10. Notifications (`notifications`)
In-app notifications for users. Admin can publish global notifications.

```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'users' }, // If null, means it's a global notification to ALL users
  title: { type: String, required: true },
  message: { type: String },
  type: { type: String, enum: ['alert', 'reminder', 'transaction', 'system'] },
  isRead: { type: Boolean, default: false },
  actionUrl: { type: String }, // e.g., '/loan-detail'
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Auto cleanup old notifications
}
```
