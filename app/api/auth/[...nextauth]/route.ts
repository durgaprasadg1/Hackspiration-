import { handlers } from "@/auth" // Referring to the auth.ts file created in the root

// Force Node.js runtime for NextAuth and database support
export const runtime = 'nodejs';

export const { GET, POST } = handlers
