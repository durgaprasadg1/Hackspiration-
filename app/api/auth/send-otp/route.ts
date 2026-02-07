import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Force Node.js runtime for crypto/bcrypt support
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.verified) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user or update existing unverified user
    if (existingUser) {
      existingUser.password = password;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      const newUser = new User({
        email,
        password,
        otp,
        otpExpiry,
        verified: false,
      });
      await newUser.save();
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Split-It" <${process.env.EMAIL_SERVER_USER}>`,
        to: email,
        subject: "Your Verification Code for Split-It",
        text: `Your verification code is: ${otp}. Valid for 10 minutes.`,
        html: `<div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #fff; border-radius: 10px;"><h2 style="color: #10b981;">Split-It Registration</h2><p>Use the code below to verify your account:</p><h1 style="letter-spacing: 5px; color: #10b981; font-size: 36px;">${otp}</h1><p style="font-size: 12px; color: #64748b;">This code will expire in 10 minutes.</p></div>`,
      });
    } catch (e) {
      console.error("Mail failed to send:", e);
      console.log("=== DEMO MODE: Your OTP is:", otp, "===");
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
