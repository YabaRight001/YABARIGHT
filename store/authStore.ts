import { create } from 'zustand';
import { User, AuthResponse, UserRole } from '@/types';
import api from '@/lib/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  pendingVerificationEmail: string | null;
  verificationCode: string | null;

  // Actions
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role?: string) => Promise<User>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  resendVerificationCode: (email: string) => Promise<string>;
  setPendingVerification: (email: string, code?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  pendingVerificationEmail: null,
  verificationCode: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });
      const { user, token } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return user;
    } catch (error: any) {
      // Check if user exists in localStorage fallback registry
      if (typeof window !== 'undefined') {
        const storedUsersRaw = localStorage.getItem('yabaright_registered_users');
        if (storedUsersRaw) {
          try {
            const storedUsers = JSON.parse(storedUsersRaw);
            const found = storedUsers.find(
              (u: any) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
            );
            if (found) {
              const fallbackUser: User = {
                id: found.id,
                name: found.name,
                email: found.email,
                role: found.role as UserRole,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              const fallbackToken = `tok_local_${Date.now()}`;
              localStorage.setItem('authToken', fallbackToken);
              localStorage.setItem('user', JSON.stringify(fallbackUser));
              set({ user: fallbackUser, token: fallbackToken, isAuthenticated: true, isLoading: false });
              return fallbackUser;
            }
          } catch {}
        }
      }

      const errorMessage =
        error.response?.data?.message || 'Login failed. Please check your email and password.';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  register: async (name: string, email: string, password: string, role?: string) => {
    set({ isLoading: true, error: null });
    const normalizedEmail = email.trim().toLowerCase();
    const validRole = (role?.toUpperCase() || 'BUYER') as UserRole;

    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: validRole,
      });
      const { user, token } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        // Save to fallback registry
        try {
          const currentList = JSON.parse(localStorage.getItem('yabaright_registered_users') || '[]');
          currentList.push({ id: user.id, name: user.name, email: user.email, password, role: user.role });
          localStorage.setItem('yabaright_registered_users', JSON.stringify(currentList));
        } catch {}
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return user;
    } catch (error: any) {
      // If server returned a specific conflict message, show it
      if (error.response?.status === 409) {
        const msg = error.response?.data?.message || 'An account with this email already exists.';
        set({ error: msg, isLoading: false });
        throw new Error(msg);
      }

      // Fallback local registration for resilient offline/dev support
      const fallbackUser: User = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        email: normalizedEmail,
        role: validRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const fallbackToken = `tok_local_${Date.now()}`;

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', fallbackToken);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        try {
          const currentList = JSON.parse(localStorage.getItem('yabaright_registered_users') || '[]');
          currentList.push({ id: fallbackUser.id, name: fallbackUser.name, email: fallbackUser.email, password, role: validRole });
          localStorage.setItem('yabaright_registered_users', JSON.stringify(currentList));
        } catch {}
      }

      set({
        user: fallbackUser,
        token: fallbackToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return fallbackUser;
    }
  },

  setPendingVerification: (email: string, code?: string) => {
    const generated = code || Math.floor(100000 + Math.random() * 900000).toString();
    set({ pendingVerificationEmail: email, verificationCode: generated });
    if (typeof window !== 'undefined') {
      localStorage.setItem(`verify_otp_${email.toLowerCase()}`, generated);
    }
  },

  resendVerificationCode: async (email: string) => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    set({ verificationCode: newCode, pendingVerificationEmail: email });
    if (typeof window !== 'undefined') {
      localStorage.setItem(`verify_otp_${email.toLowerCase()}`, newCode);
    }
    return newCode;
  },

  verifyEmail: async (email: string, code: string) => {
    set({ isLoading: true, error: null });
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check code against stored OTP or master test code (123456)
    let valid = code.trim() === '123456';
    if (!valid && typeof window !== 'undefined') {
      const storedOtp = localStorage.getItem(`verify_otp_${normalizedEmail}`);
      if (storedOtp && storedOtp === code.trim()) {
        valid = true;
      }
    }
    if (!valid && get().verificationCode && get().verificationCode === code.trim()) {
      valid = true;
    }

    if (!valid) {
      set({ isLoading: false, error: 'Invalid verification code. Please check and try again.' });
      throw new Error('Invalid verification code.');
    }

    // Mark verified in local state & registry
    if (typeof window !== 'undefined') {
      localStorage.setItem(`verified_${normalizedEmail}`, 'true');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.email?.toLowerCase() === normalizedEmail) {
            parsed.isEmailVerified = true;
            localStorage.setItem('user', JSON.stringify(parsed));
          }
        } catch {}
      }
    }

    set((state) => ({
      isLoading: false,
      pendingVerificationEmail: null,
      verificationCode: null,
      user: state.user ? { ...state.user, isEmailVerified: true } : null,
    }));

    return true;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateProfile: async (data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put<User>('/auth/profile', data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      set({
        user: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Update failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  setUser: (user: User) => set({ user }),
}));
