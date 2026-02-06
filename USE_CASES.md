# Split-It: User Guide & Use Cases

This guide explains how to effectively use the **Split-It** protocol and highlights the primary use cases that make it a game-changer for student financial coordination.

---

## 🚀 How to Use Split-It (Step-by-Step)

### 1. The Handshake (Connectivity)

Start by clicking **Connect Wallet**. Scan the QR code with your **Pera Wallet** mobile app (ensure it's set to **Testnet**). This connection establishes your cryptographic identity on the network, allowing you to sign transactions securely.

### 2. Initializing a Graph (Creating a Group)

- From the Dashboard, enter a **Protocol Name** (e.g., "Apartment 402").
- Add your friends' Algorand wallet addresses as **Nodes**.
- Click **Deploy Group**. This creates a local ledger synchronized with your group members.

### 3. Populating the Ledger (Adding Expenses)

- When you pay for something (e.g., $50 for Groceries), add a **New Expense**.
- Enter the title and amount in ALGO.
- Select which members should split the cost.
- Click **Add to Ledger**. The app immediately updates the internal debt graph.

### 4. The Magic Wand (Optimizing Debts)

Before paying, click the **Magic Settle** icon.

- Split-It runs a **Debt Simplification Algorithm** that scans the entire group.
- It removes redundant transfers (e.g., if you owe Alice 5 and Alice owes Bob 5, the app simplifies it so you pay Bob 5 directly).
- View the **Settlement Preview** to see the optimized payment paths.

### 5. Atomic Settlement (The "Instant Pay" Button)

Click **Execute Atomic Settlement**.

- The app bundles all your debts into a single **Atomic Transaction Group**.
- Your wallet will prompt you to sign all payments simultaneously.
- **Success:** Either everyone gets paid, or no one does. This ensures total financial transparency.

---

## 🎯 Use Cases

### 1. Smart Dormitory Management

**The Problem:** Roommates often lose track of who paid the electricity, water, or Wi-Fi bill, leading to awkward conversations at the end of the month.
**The Split-It Solution:** One person pays the bill and logs it. Members can "Micro-Settle" instantly without waiting for a monthly tally.

### 2. Club & Society Events

**The Problem:** Campus clubs buying supplies (pizza, posters, rentals) often have multiple people paying out of pocket.
**The Split-It Solution:** Create a "Pizza Night" group. Everyone logs their receipt. Use the **Magic Settle** feature to reduce 20 complex repayments into 3 clean transfers.

### 3. Team Travel & Road Trips

**The Problem:** Splitting gas, tolls, and hotels during a sports team or debate club trip is a nightmare of "I'll Venmo you later."
**The Split-It Solution:** Use the **Invite QR** feature to let everyone join the trip group instantly. Settle the entire trip's finances with one signature at the end.

---

## 💎 Making the Most of Split-It

- **Minimize Gas Fees:** By using the **Magic Settle** algorithm, you reduce the number of transactions sent to the blockchain, saving on Algorand's already low transaction fees.
- **QR Onboarding:** Don't manually type addresses. Use the **Invite** button to show a QR code. Your friends can scan it and join the group in seconds.
- **Trustless Transparency:** Since everything is calculated via code and signed via wallet, there is no "human error." The math is verified by the algorithm.

---

## 🔮 The "Future of Finance" Perspective

In the future, Split-It will transition from a local ledger to a **Smart Contract Auditor**. This will allow groups to lock ALGO or USDC in escrow, where funds are automatically released to the payer once a majority of splitters confirm the receipt — making "Ghosting" on debts physically impossible.
