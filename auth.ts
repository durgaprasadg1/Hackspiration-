import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text", optional: true },
      },
      authorize: async (credentials) => {
        try {
          await connectDB();
          
          const email = credentials.email as string;
          const password = credentials.password as string;
          const otp = credentials.otp as string | undefined;

          // Registration flow: verify OTP and create user
          if (otp) {
            const user = await User.findOne({ email });
            
            if (!user || !user.otp || !user.otpExpiry) {
              return null;
            }
            
            // Check if OTP expired
            if (user.otpExpiry < new Date()) {
              return null;
            }
            
            // Verify OTP
            if (user.otp !== otp) {
              return null;
            }
            
            // Mark user as verified and clear OTP
            user.verified = true;
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.email.split("@")[0],
            };
          }

          // Login flow: verify credentials
          const user = await User.findOne({ email });
          
          if (!user) {
            return null;
          }
          
          if (!user.verified) {
            return null;
          }
          
          const isValid = await user.comparePassword(password);
          
          if (!isValid) {
            return null;
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.email.split("@")[0],
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
});
