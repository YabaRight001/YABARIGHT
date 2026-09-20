import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  loginTime: string;
}

interface AdminAuthState {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminToken: string | null;
  loginAdmin: (user: AdminUser, token: string) => void;
  logoutAdmin: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminUser: null,
      adminToken: null,
      loginAdmin: (user, token) =>
        set({
          isAdminAuthenticated: true,
          adminUser: user,
          adminToken: token,
        }),
      logoutAdmin: () =>
        set({
          isAdminAuthenticated: false,
          adminUser: null,
          adminToken: null,
        }),
    }),
    {
      name: 'yabaright-admin-auth',
    }
  )
);
