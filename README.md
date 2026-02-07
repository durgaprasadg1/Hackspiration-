<div align="center">

# 💸 Split-It: Decentralized Campus Expense Splitter

### Settle group expenses instantly with blockchain-powered atomic transactions

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Algorand](https://img.shields.io/badge/Algorand-Blockchain-blue?style=flat&logo=algorand)](https://www.algorand.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Use Cases](USE_CASES.md)

</div>

---

## 🌟 Overview

**Split-It** is a next-generation decentralized application (dApp) built on the Algorand blockchain that revolutionizes how students manage shared expenses. By leveraging **Atomic Transfers**, Split-It ensures secure, transparent, and efficient multi-party payments where either everyone gets paid or no one does—eliminating the awkward "I'll pay you later" conversations.

### Why Split-It?

- **💎 Trustless Transparency**: Math verified by algorithms, not humans
- **⚡ Instant Settlement**: Bundle all debts into one atomic transaction
- **🔄 Smart Debt Optimization**: Graph reduction algorithm minimizes transfers
- **🔐 Cryptographically Secure**: Wallet-based authentication and signing
- **💰 Cost Efficient**: Reduce blockchain gas fees with optimized settlements
- **📱 Mobile-First**: Beautiful glassmorphism UI with QR code support

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔗 Blockchain Integration

- **Pera Wallet Connect**: Seamless integration with Algorand's leading mobile wallet
- **Atomic Transactions**: All-or-nothing payment guarantees for multi-party settlements
- **Testnet Support**: Safe testing environment with faucet-funded accounts

### 👥 Group Management

- **Multi-Member Groups**: Create expense groups with unlimited Algorand addresses
- **QR Code Sharing**: Instant group invites via scannable QR codes
- **Persistent Storage**: MongoDB-backed group and expense tracking

### 💸 Smart Expense Tracking

- **Flexible Splitting**: Choose who pays and who splits each expense
- **Real-Time Calculations**: Automatic debt graph updates
- **Expense History**: Complete audit trail of all transactions

### 🧮 Debt Optimization Engine

- **Graph Reduction Algorithm**: Minimizes transfer count using graph theory
- **Settlement Preview**: Visualize optimized payment flow before execution
- **Cost Savings**: Reduce transaction fees by up to 70%

### 🎨 Modern UI/UX

- **Glassmorphism Design**: Stunning translucent components with backdrop blur
- **Framer Motion Animations**: Smooth, delightful micro-interactions
- **Responsive Layout**: Mobile-first design that works everywhere
- **Dark Mode**: Eye-friendly interface for late-night expense logging

### 🔐 Security & Auth

- **NextAuth Integration**: Secure authentication flow
- **OTP Verification**: Email-based one-time password system
- **Wallet Signature Verification**: Cryptographic proof of identity

---

## 🛠️ Tech Stack

### Frontend

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Beautiful icon set

### Blockchain

- **[Algorand](https://www.algorand.com/)** - Layer-1 blockchain
- **[algosdk](https://github.com/algorand/js-algorand-sdk)** - Algorand JavaScript SDK
- **[@perawallet/connect](https://github.com/perawallet/connect)** - Pera Wallet integration
- **[QRCode.react](https://github.com/zpao/qrcode.react)** - QR code generation

### Backend & Database

- **[MongoDB](https://www.mongodb.com/)** - NoSQL database via Mongoose
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
- **[NextAuth v5](https://authjs.dev/)** - Authentication framework
- **[Nodemailer](https://nodemailer.com/)** - Email service for OTP

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing

---

## 🏗️ Architecture

Split-It follows a modern **Jamstack architecture** with blockchain integration:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│   (Next.js App Router, React Components, Framer Motion) │
└─────────────────┬───────────────────────────────────────┘
                  │
         ┌────────┴─────────┐
         │                  │
┌────────▼────────┐ ┌──────▼────────┐
│   Auth Layer    │ │ Blockchain    │
│   (NextAuth)    │ │ (Pera Wallet) │
│   - OTP via     │ │ - Atomic Txns │
│     Nodemailer  │ │ - algosdk     │
└────────┬────────┘ └──────┬────────┘
         │                  │
┌────────▼──────────────────▼──────┐
│        Database Layer             │
│  MongoDB          Supabase        │
│  (User/Groups)    (Future)        │
└───────────────────────────────────┘
         │
┌────────▼────────┐
│  Algorand       │
│  Testnet        │
└─────────────────┘
```

### Key Algorithms

**Debt Graph Reduction** ([debtGraph.ts](utils/debtGraph.ts))

- Uses graph theory to minimize payment transfers
- Implements a greedy algorithm to settle largest debts first
- Reduces O(n²) transactions to O(n) in optimal cases

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Pera Wallet** mobile app ([iOS](https://apps.apple.com/app/id1459898525) | [Android](https://play.google.com/store/apps/details?id=com.algorand.android))
- **MongoDB** instance (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- **Testnet ALGO** from [Algorand Faucet](https://bank.testnet.algorand.network/)

### Step-by-Step Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/split-it.git
   cd split-it
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory (see [Configuration](#-configuration) section).

4. **Set up MongoDB**

   Ensure your MongoDB connection string is in `.env`:

   ```env
   MONGODB_URI=mongodb://localhost:27017/split-it
   # or MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/split-it
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Algorand Configuration
NEXT_PUBLIC_ALGOD_SERVER=https://testnet-api.algonode.cloud
NEXT_PUBLIC_ALGOD_PORT=
NEXT_PUBLIC_ALGOD_TOKEN=

# Database
MONGODB_URI=mongodb://localhost:27017/split-it

# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Email Service (for OTP)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=noreply@split-it.app
```

### Generating Secrets

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### Wallet Configuration

1. **Install Pera Wallet** on your mobile device
2. **Switch to Testnet**:
   - Open Pera Wallet → Settings → Developer Settings
   - Enable "Testnet Mode"
3. **Fund your account**:
   - Copy your address from Pera Wallet
   - Visit [Algorand Testnet Faucet](https://bank.testnet.algorand.network/)
   - Request testnet ALGO (free)

---

## 🚀 Usage

### Quick Start Guide

1. **Connect Your Wallet**

   Click "Connect Wallet" on the homepage. A QR code will appear—scan it with your Pera Wallet app (ensure Testnet mode is enabled).

2. **Create an Expense Group**
   - Click "New Group" from the dashboard
   - Enter a group name (e.g., "Apartment 402")
   - Add members by pasting their Algorand addresses
   - Click "Deploy Group"

3. **Log an Expense**
   - Select your group
   - Click "Add Expense"
   - Enter expense details:
     - Title (e.g., "Pizza Night")
     - Amount in ALGO (e.g., 50)
     - Who paid (select from group members)
     - Split between (select members who should share the cost)
   - Click "Add to Ledger"

4. **Optimize Debts**

   Click the **Magic Settle** icon to run the debt optimization algorithm. This will show you the minimum number of transactions needed.

5. **Settle Up**
   - Click "Execute Atomic Settlement"
   - Review the transaction group in the preview
   - Sign all transactions in your Pera Wallet
   - ✅ Done! All debts settled atomically.

### Advanced Usage

For detailed workflows, real-world scenarios, and algorithm explanations, see the **[Use Cases & User Guide](USE_CASES.md)**.

---

## 📁 Project Structure

```
split-it/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── auth/             # Authentication endpoints
│   │       ├── [...nextauth]/
│   │       └── send-otp/
│   ├── auth/                 # Auth pages
│   │   ├── register/
│   │   └── signin/
│   ├── dashboard/            # Main dashboard
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── GroupView.tsx         # Group management UI
│   ├── SettlementPreview.tsx # Debt settlement visualization
│   ├── ShareQR.tsx           # QR code generator
│   └── WalletConnect.tsx     # Pera Wallet integration
├── context/
│   └── AppContext.tsx        # Global state management
├── lib/
│   ├── mongodb.ts            # MongoDB connection
│   └── userStore.ts          # User data store
├── models/
│   └── User.ts               # Mongoose user model
├── utils/
│   ├── algorand.ts           # Algorand SDK utilities
│   ├── debtGraph.ts          # Debt optimization algorithm
│   └── supabase.ts           # Supabase client
├── public/                   # Static assets
├── auth.ts                   # NextAuth configuration
├── proxy.ts                  # API proxy utilities
├── .env                      # Environment variables (not committed)
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## 🔌 API Routes

### Authentication

#### `POST /api/auth/send-otp`

Send OTP to user's email for verification.

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### NextAuth Endpoints

NextAuth provides these automatic endpoints under `/api/auth/`:

- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `POST /api/auth/callback/:provider` - OAuth callbacks

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><b>❌ "Failed to connect wallet"</b></summary>

**Solution:**

1. Ensure Pera Wallet is set to **Testnet** mode
2. Check that you're scanning the QR code from the correct device
3. Verify network connectivity on both devices
4. Try refreshing the QR code
</details>

<details>
<summary><b>❌ "Transaction failed" during settlement</b></summary>

**Solution:**

1. Verify you have sufficient ALGO balance (min 0.1 ALGO)
2. Check that all group members have valid testnet addresses
3. Ensure you're connected to Algorand Testnet, not Mainnet
4. Try reducing the number of simultaneous transactions
</details>

<details>
<summary><b>❌ "MongoDB connection error"</b></summary>

**Solution:**

1. Verify `MONGODB_URI` in `.env` is correct
2. Ensure MongoDB service is running (if local)
3. Check firewall rules and network access
4. For Atlas: whitelist your IP address
</details>

<details>
<summary><b>❌ "Module not found" errors</b></summary>

**Solution:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

</details>

### Getting Help

- 📖 Check our [Use Cases Guide](USE_CASES.md)
- 🐛 [Open an issue](https://github.com/yourusername/split-it/issues)
- 💬 Join our Discord community
- 📧 Email: support@split-it.app

---

## 🗺️ Roadmap

### Phase 1: MVP (Current) ✅

- [x] Pera Wallet integration
- [x] Expense tracking
- [x] Debt optimization algorithm
- [x] Atomic settlement execution
- [x] QR code group sharing

### Phase 2: Enhanced Features 🚧

- [ ] Smart contract escrow system
- [ ] Multi-currency support (USDC, USDT)
- [ ] Receipt image uploads
- [ ] Push notifications
- [ ] Group chat integration

### Phase 3: Mainnet Launch 🔮

- [ ] Security audit
- [ ] Mainnet deployment
- [ ] Mobile app (React Native)
- [ ] Web3 social features
- [ ] DAO governance for protocol fees

### Phase 4: Advanced 🌟

- [ ] AI-powered expense categorization
- [ ] Integration with campus payment systems
- [ ] Cross-chain bridges (Ethereum, Polygon)
- [ ] Automatic recurring expenses
- [ ] Tax reporting features

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, improving documentation, or proposing new features, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure ESLint passes: `npm run lint`

### Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to conduct@split-it.app.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Algorand Foundation** for the incredible blockchain infrastructure
- **Pera Wallet** team for seamless wallet integration
- **Next.js** team for the amazing framework
- **Campus community** for testing and feedback

---

## 📞 Contact

- **Website**: [split-it.app](https://split-it.app) (coming soon)
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Twitter**: [@SplitItApp](https://twitter.com/SplitItApp)
- **Discord**: [Join our community](https://discord.gg/split-it)

---

<div align="center">

### ⚠️ Important Notice

**This is a Proof-of-Concept for demonstration purposes.**  
Always use **Testnet** addresses and assets. Never send mainnet ALGO without proper security audits.

---

**Built with ❤️ by students, for students**

⭐ Star us on GitHub if you find this project helpful!

</div>
