import fs from 'fs';
import path from 'path';
import { hashPassword, comparePassword } from './auth';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  plainPassword?: string; // fallback
  role: 'BUYER' | 'SELLER' | 'ADMIN' | 'AFFILIATE';
  phone?: string;
  createdAt: string;
}

// Pre-seeded system users for immediate testing
const defaultUsers: StoredUser[] = [
  {
    id: 'usr-admin-01',
    name: 'YabaRight Administrator',
    email: 'yabarightofficial@gmail.com',
    plainPassword: 'admin1234',
    role: 'ADMIN',
    phone: '0806 308 1972',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-admin-02',
    name: 'Chief Admin',
    email: 'admin@yabaright.ng',
    plainPassword: 'admin123',
    role: 'ADMIN',
    phone: '0801 000 0001',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-seller-01',
    name: 'Lagos Fashion Hub',
    email: 'seller@yabaright.ng',
    plainPassword: 'seller123',
    role: 'SELLER',
    phone: '0802 000 0002',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-buyer-01',
    name: 'Chidi Okafor',
    email: 'buyer@yabaright.ng',
    plainPassword: 'buyer123',
    role: 'BUYER',
    phone: '0803 000 0003',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-affiliate-01',
    name: 'Tunde Afolabi',
    email: 'affiliate@yabaright.ng',
    plainPassword: 'affiliate123',
    role: 'AFFILIATE',
    phone: '0804 000 0004',
    createdAt: new Date().toISOString(),
  },
];

const dataFilePath = path.join(process.cwd(), 'data', 'users.json');
const tmpFilePath = path.join('/tmp', 'yabaright_users.json');

// Persistent in-process memory store
let registeredUsers: StoredUser[] = [...defaultUsers];

function loadPersistedUsers(): StoredUser[] {
  // 1. Try reading from /tmp/yabaright_users.json (writable in Vercel/AWS Lambda)
  try {
    if (fs.existsSync(tmpFilePath)) {
      const content = fs.readFileSync(tmpFilePath, 'utf8');
      if (content.trim()) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          registeredUsers = parsed;
          return registeredUsers;
        }
      }
    }
  } catch (err) {
    // Continue to next fallback
  }

  // 2. Try reading from data/users.json
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf8');
      if (content.trim()) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          registeredUsers = parsed;
          return registeredUsers;
        }
      }
    }
  } catch (err) {
    // Continue to in-memory fallback
  }

  return registeredUsers;
}

function savePersistedUsers(users: StoredUser[]): void {
  registeredUsers = users;

  // 1. Save to /tmp (reliably writable in serverless)
  try {
    fs.writeFileSync(tmpFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    // Ignore tmp write errors
  }

  // 2. Save to data/users.json (works in local dev and environments with persistent disk)
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    // In serverless, filesystem is read-only outside /tmp
  }
}

// Initial load
loadPersistedUsers();

export function getAllUsers(): StoredUser[] {
  return loadPersistedUsers();
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  const currentUsers = loadPersistedUsers();
  return currentUsers.find((u) => u.email.trim().toLowerCase() === normalized);
}

export async function createNewUser(
  name: string,
  email: string,
  password: string,
  role: 'BUYER' | 'SELLER' | 'ADMIN' | 'AFFILIATE' = 'BUYER',
  phone?: string
): Promise<StoredUser> {
  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const hashedPassword = await hashPassword(password);
  const newUser: StoredUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashedPassword,
    plainPassword: password,
    role,
    phone: phone || '',
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...loadPersistedUsers(), newUser];
  savePersistedUsers(updatedUsers);
  return newUser;
}

export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<StoredUser | null> {
  const user = findUserByEmail(email);
  if (!user) return null;

  // Direct plain password match or bcrypt hash comparison
  if (user.plainPassword && user.plainPassword === password) {
    return user;
  }

  if (user.passwordHash) {
    const isMatch = await comparePassword(password, user.passwordHash);
    if (isMatch) return user;
  }

  return null;
}
