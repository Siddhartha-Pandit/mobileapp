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
type User = { id: number; name: string; email: string; synced: boolean | null };
type Metric = { id: number; value: number; timestamp: number; synced: boolean | null };

let _users: User[] = [];
let _metrics: Metric[] = [];
let _userId = 1;
let _metricId = 1;

// ---------- initializeDb (no-op on web) ----------
export const initializeDb = () => {
  // Nothing to set up in-memory.
};



export const db = {
  select: () => ({
    from: (table: { tableName?: string; _?: { name?: string } }) => {
      const tableName = (table as any)?._?.name ?? (table as any)?.tableName ?? '';
      const data = tableName === 'users' ? [..._users] : tableName === 'metrics' ? [..._metrics] : [];
      
      const queryResult = {
        data,
        where: (_condition: any) => {
          // Simplified where: for sync logic, we just return the data since eq(synced, false)
          // is effectively what we're simulating.
          return Promise.resolve(data.filter(item => (item as any).synced === false));
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
        values: (row: Omit<User, 'id'>) => {
          _users.push({ id: _userId++, ...row, synced: row.synced ?? false });
          return Promise.resolve();
        },
      };
    }
    if (tableName === 'metrics') {
      return {
        values: (row: Omit<Metric, 'id'>) => {
          _metrics.push({ id: _metricId++, ...row, synced: row.synced ?? false });
          return Promise.resolve();
        },
      };
    }
    return { values: (_row: unknown) => Promise.resolve() };
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
          }
          return Promise.resolve();
        }
      })
    };
  }
};

