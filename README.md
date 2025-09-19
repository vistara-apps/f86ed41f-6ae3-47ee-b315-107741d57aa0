# TripSplitter - Base Mini App

Effortlessly manage shared trip expenses and settle up with friends.

## Features

- **Real-time Activity Cost Allocation**: Input shared expenses and assign costs to individuals or groups
- **Automated Settlement Reminders & Tools**: Direct payment integration with Base Wallet
- **Shared Budget Projection**: Create estimated budgets per person before trips
- **Group Contribution Tracker**: Track initial deposits and shared contributions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via MiniKit and OnchainKit)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Add your OnchainKit API key to `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx           # Home page with trip list
├── providers.tsx      # MiniKit and OnchainKit providers
├── group/[id]/        # Individual trip pages
└── create-trip/       # Trip creation flow

components/
├── AppShell.tsx       # Main app layout
├── GroupListItem.tsx  # Trip list items
├── ExpenseInputForm.tsx # Add expense modal
├── MemberBalanceCard.tsx # Balance display
├── PaymentButton.tsx  # Base Wallet integration
└── BudgetBar.tsx      # Budget progress bars

lib/
├── types.ts           # TypeScript interfaces
├── utils.ts           # Utility functions
└── constants.ts       # App constants and sample data
```

## Base Mini App Integration

This app integrates with Base through:

- **MiniKitProvider**: Handles Base chain connection and wallet integration
- **OnchainKit**: Provides identity and wallet components
- **Base Wallet**: Direct payment settlement functionality
- **Farcaster Identity**: Social context and user profiles

## Development

The app uses sample data for demonstration. In production, you would:

1. Connect to a backend API for data persistence
2. Implement real Base Wallet payment flows
3. Add Farcaster identity verification
4. Set up push notifications for expense updates

## License

MIT License
