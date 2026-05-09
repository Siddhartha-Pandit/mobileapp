/**
 * Web stub for the database module.
 * expo-sqlite does not work reliably on web (SharedArrayBuffer / worker timeout issues).
 * Metro automatically resolves index.native.ts on iOS/Android, so this file
 * is only bundled on web.
 *
 * We mirror the same API surface (db.select, db.insert, initializeDb) using
 * simple in-memory arrays so the rest of the app compiles and runs on web.
 */

// ---------- in-memory store ----------
type User = { id: number; name: string; email: string; accessToken?: string; refreshToken?: string; synced: boolean | null; language?: string };
type Metric = { id: number; value: number; timestamp: number; synced: boolean | null };

let _users: User[] = [];
let _metrics: Metric[] = [];
let _userSettings: any[] = [];
let _accounts: any[] = [];
let _categories: any[] = [];
let _budgets: any[] = [];
let _notifications: any[] = [];

let _userId = 1;
let _metricId = 1;
let _id = 1;

// ---------- initializeDb (no-op on web) ----------
export const initializeDb = () => {
  // Nothing to set up in-memory.
};



export const db = {
  select: () => ({
    from: (table: { tableName?: string; _?: { name?: string } }) => {
      const tableName = (table as any)?._?.name ?? (table as any)?.tableName ?? '';
      let data: any[] = [];
      if (tableName === 'users') data = [..._users];
      else if (tableName === 'metrics') data = [..._metrics];
      else if (tableName === 'user_settings') data = [..._userSettings];
      else if (tableName === 'accounts') data = [..._accounts];
      else if (tableName === 'categories') data = [..._categories];
      else if (tableName === 'budgets') data = [..._budgets];
      else if (tableName === 'notifications') data = [..._notifications];
      
      const queryResult = {
        data,
        where: (condition: any) => {
          // If we are looking for a specific ID, try to find it
          if (condition?.left?.name === 'id' || condition?.left?.columnName === 'id') {
            const targetId = condition?.right;
            return Promise.resolve(data.filter(item => item.id === targetId));
          }
          // Otherwise return all (for UI)
          return Promise.resolve(data);
        },
        limit: (n: number) => {
           return Promise.resolve(data.slice(0, n));
        },
        // Make it thenable so select().from() also works if called without where
        then: (onfulfilled?: (value: any[]) => any) => Promise.resolve(data).then(onfulfilled)
      };
      return queryResult;
    },
  }),

  insert: (table: { _?: { name?: string }; tableName?: string }) => {
    const tableName = (table as any)?._?.name ?? (table as any)?.tableName ?? '';
    if (tableName === 'users') {
      return {
        values: (row: any) => {
          _users.push({ id: _userId++, ...row, synced: row.synced ?? false });
          return Promise.resolve();
        },
      };
    }
    if (tableName === 'metrics') {
      return {
        values: (row: any) => {
          _metrics.push({ id: _metricId++, ...row, synced: row.synced ?? false });
          return Promise.resolve();
        },
      };
    }
    if (tableName === 'user_settings') {
      return {
        values: (row: any) => {
          _userSettings.push({ id: _id++, ...row, synced: row.synced ?? false });
          return Promise.resolve();
        },
      };
    }
    if (tableName === 'accounts') {
      return {
        values: (row: any) => {
          _accounts.push({ id: _id++, ...row, synced: row.synced ?? false });
          return Promise.resolve();
        },
      };
    }
    if (tableName === 'categories') {
      return {
        values: (row: any) => {
          _categories.push({ id: _id++, ...row, synced: row.synced ?? false });
          return Promise.resolve();
        },
      };
    }
    if (tableName === 'budgets') {
      return {
        values: (row: any) => {
          _budgets.push({ id: _id++, ...row, synced: row.synced ?? false });
          return Promise.resolve();
        },
      };
    }
    if (tableName === 'notifications') {
      return {
        values: (row: any) => {
          _notifications.push({ ...row, synced: row.synced ?? true });
          return Promise.resolve();
        },
      };
    }
    return { values: (_row: any) => Promise.resolve() };
  },

  update: (table: { _?: { name?: string }; tableName?: string }) => {
    const tableName = (table as any)?._?.name ?? (table as any)?.tableName ?? '';
    return {
      set: (values: any) => ({
        where: (_condition: any) => {
          if (tableName === 'users') {
            _users = _users.map(u => ({ ...u, ...values }));
          } else if (tableName === 'metrics') {
            _metrics = _metrics.map(m => ({ ...m, ...values }));
          } else if (tableName === 'user_settings') {
            _userSettings = _userSettings.map(s => ({ ...s, ...values }));
          } else if (tableName === 'accounts') {
            _accounts = _accounts.map(a => ({ ...a, ...values }));
          } else if (tableName === 'categories') {
            _categories = _categories.map(c => ({ ...c, ...values }));
          } else if (tableName === 'budgets') {
            _budgets = _budgets.map(b => ({ ...b, ...values }));
          }
          return Promise.resolve();
        }
      })
    };
  },

  delete: (table: { _?: { name?: string }; tableName?: string }) => {
    const tableName = (table as any)?._?.name ?? (table as any)?.tableName ?? '';
    // To support `await db.delete(table)` we return a promise.
    // If you add .where() support later, you'd return an object that is thenable.
    return Promise.resolve().then(() => {
      if (tableName === 'users') {
        _users = [];
      } else if (tableName === 'metrics') {
        _metrics = [];
      } else if (tableName === 'user_settings') {
        _userSettings = [];
      } else if (tableName === 'accounts') {
        _accounts = [];
      } else if (tableName === 'categories') {
        _categories = [];
      } else if (tableName === 'budgets') {
        _budgets = [];
      }
    });
  }
};

