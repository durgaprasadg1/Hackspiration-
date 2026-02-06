# Split-It: Decentralized Campus Expense Splitter

Split-It is a Proof-of-Concept decentralized application (dApp) built on the Algorand blockchain. It allows students to manage group expenses and settle debts using Atomic Transfers for secure, transparent, and multi-party payments.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Blockchain**: Algorand (algosdk)
- **Wallet**: Pera Wallet Connect
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Key Features

- **Wallet Integration**: Connect with Pera Wallet on Algorand Testnet.
- **Group Management**: Create expense groups with multiple members (Algorand addresses).
- **Expense Logging**: Add expenses with specific payers and splitters.
- **Atomic Settlement**: Bundle all your outstanding debts into a single, grouped transaction for secure settlement.
- **Debt Optimization**: Automatic algorithm to minimize the number of transfers using graph reduction.
- **Glassmorphism UI**: High-fidelity, animated interface designed for modern campus users.

## 📖 Deep Dive

For a detailed guide on how to use the app, real-world scenarios, and how the "Magic Settle" algorithm works, check out the **[Use Cases & User Guide](USE_CASES.md)**.

## Getting Started

### Prerequisites

- Node.js installed.
- Pera Wallet app installed on your mobile device (set to **Testnet**).
- Testnet ALGO from the [Algorand Faucet](https://bank.testnet.algorand.network/).

### Installation

1. Clone the repository.
2. Install dependencies:
   `ash
npm install
`
3. Set up environment variables by creating a .env file (see [section below](#environment-variables)).

### Running the App

`ash
npm run dev
`
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a .env file in the root directory:
`env
NEXT_PUBLIC_ALGOD_SERVER=https://testnet-api.algonode.cloud
NEXT_PUBLIC_ALGOD_PORT=
NEXT_PUBLIC_ALGOD_TOKEN=
`

## How to Work with It

1. **Connect Wallet**: Click "Connect Wallet" and scan the QR code with your Pera Wallet (Testnet).
2. **Create Group**: Enter a group name and add the Algorand addresses of your group members.
3. **Add Expense**: Log an expense, enter the amount in ALGO, and select who it should be split among.
4. **Settle Up**: Click "Settle My Debts". The app calculates your net debt to all creditors in the group and constructs an **Atomic Transaction Group**. You will be prompted to sign all payment transactions at once in your wallet.

## Safety Note

This is a Proof-of-Concept for demonstration purposes. Ensure you are using **Testnet** addresses and assets.
