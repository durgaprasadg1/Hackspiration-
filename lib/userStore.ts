// Simple in-memory store for demo (will reset on server restart)
// In production, use a real database

interface User {
  email: string;
  password: string;
  verified: boolean;
}

interface OTP {
  email: string;
  code: string;
  password: string;
  expiresAt: number;
}

const users: Map<string, User> = new Map();
const otps: Map<string, OTP> = new Map();

export const userStore = {
  // Create a pending user with OTP
  createPendingUser: (email: string, password: string, otp: string) => {
    otps.set(email, {
      email,
      code: otp,
      password,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });
  },

  verifyAndCreateUser: (email: string, otp: string): boolean => {
    const pending = otps.get(email);
    if (!pending) return false;
    if (pending.expiresAt < Date.now()) {
      otps.delete(email);
      return false;
    }
    if (pending.code !== otp) return false;

    // Create the user
    users.set(email, {
      email,
      password: pending.password,
      verified: true,
    });
    otps.delete(email);
    return true;
  },

  // Get user by email
  getUser: (email: string): User | undefined => {
    return users.get(email);
  },

  // Verify user credentials
  verifyCredentials: (email: string, password: string): boolean => {
    const user = users.get(email);
    if (!user) return false;
    return user.password === password && user.verified;
  },

  // Check if user exists
  userExists: (email: string): boolean => {
    return users.has(email);
  },
};
