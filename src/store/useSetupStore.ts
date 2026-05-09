import { create } from 'zustand';
import { setupService } from '../services/setupService';

export interface CustomCategory {
  id: string;
  name: string;
  iconName: string;
  themeColor: string;
}

export interface SetupBudget {
  id: string;
  name: string;
  type: 'percent' | 'amount';
  value: number;
  color: string;
  icon: string;
  smartReminder: boolean;
  description?: string;
}

interface SetupState {
  selectedCategoryValues: string[];
  customCategories: CustomCategory[];
  budgets: SetupBudget[];
  currencySymbol: string;
  
  // Actions
  toggleCategory: (value: string) => void;
  setSelectedCategories: (values: string[]) => void;
  addCustomCategory: (category: Omit<CustomCategory, 'id'>) => void;
  
  updateBudget: (id: string, updates: Partial<SetupBudget>) => void;
  addCustomBudget: (budget: Omit<SetupBudget, 'id'>) => void;
  removeBudget: (id: string) => void;
  
  setCurrencySymbol: (symbol: string) => void;
  hydrateStore: (userId: string) => Promise<void>;
  resetSetup: () => void;
}

export const useSetupStore = create<SetupState>((set) => ({
  selectedCategoryValues: [],
  customCategories: [],
  budgets: [
    { id: 'needs', name: 'Needs', type: 'percent', value: 50, color: '#0AA971', icon: 'home', smartReminder: true, description: 'Rent, food, and utilities' },
    { id: 'wants', name: 'Wants', type: 'percent', value: 30, color: '#3B82F6', icon: 'shopping-cart', smartReminder: true, description: 'Entertainment and hobbies' },
    { id: 'savings', name: 'Savings', type: 'percent', value: 20, color: '#10B981', icon: 'trending-up', smartReminder: true, description: 'Emergency and investments' },
  ],
  currencySymbol: 'Rs',

  toggleCategory: (value) => set((state) => ({
    selectedCategoryValues: state.selectedCategoryValues.includes(value)
      ? state.selectedCategoryValues.filter((v) => v !== value)
      : [...state.selectedCategoryValues, value],
  })),

  setSelectedCategories: (values) => set({ selectedCategoryValues: values }),

  addCustomCategory: (category) => set((state) => {
    const id = `custom-cat-${Date.now()}`;
    return {
      customCategories: [...state.customCategories, { ...category, id }],
      selectedCategoryValues: [...state.selectedCategoryValues, id],
    };
  }),

  updateBudget: (id, updates) => set((state) => ({
    budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
  })),

  addCustomBudget: (budget) => set((state) => ({
    budgets: [...state.budgets, { ...budget, id: `custom-budget-${Date.now()}` }],
  })),

  removeBudget: (id) => set((state) => ({
    budgets: state.budgets.filter((b) => b.id !== id),
  })),

  setCurrencySymbol: (symbol) => set({ currencySymbol: symbol }),

  hydrateStore: async (userId) => {
    const settings = await setupService.getUserSettings(userId);
    if (settings) {
      const symbols: Record<string, string> = { NPR: 'Rs', USD: '$', INR: '₹', EUR: '€' };
      set({ 
        currencySymbol: symbols[settings.preferredCurrency] || 'Rs' 
      });
    }
  },

  resetSetup: () => set({
    selectedCategoryValues: [],
    customCategories: [],
    budgets: [
      { id: 'needs', name: 'Needs', type: 'percent', value: 50, color: '#0AA971', icon: 'home', smartReminder: true, description: 'Rent, food, and utilities' },
      { id: 'wants', name: 'Wants', type: 'percent', value: 30, color: '#3B82F6', icon: 'shopping-cart', smartReminder: true, description: 'Entertainment and hobbies' },
      { id: 'savings', name: 'Savings', type: 'percent', value: 20, color: '#10B981', icon: 'trending-up', smartReminder: true, description: 'Emergency and investments' },
    ],
    currencySymbol: 'Rs',
  }),
}));
