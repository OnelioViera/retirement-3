# Retirement Financial Planner

A comprehensive Next.js application for retirement planning with MongoDB Atlas integration and modern UI components.

## Features

- **Modern UI**: Built with Next.js 14, TypeScript, and shadcn/ui components
- **Database Integration**: MongoDB Atlas for persistent data storage
- **Real-time Calculations**: Automatic financial calculations and health indicators
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **No Authentication**: Simple, direct access for personal use

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB Atlas
- **Icons**: Lucide React
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd retirement-planner-nextjs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retirement-planner?retryWrites=true&w=majority
   ```

4. **Set up MongoDB Atlas**:
   - Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Create a database named `retirement-planner`
   - Get your connection string and replace the placeholder in `.env.local`

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Income Tracking
- Enter Social Security benefits for different family members
- Add pension income
- View total monthly income calculations

### Expense Management
- Track monthly expenses across various categories
- Monitor mortgage, utilities, food, and other costs
- View total monthly expense calculations

### Savings & Investments
- Track 401K contributions and other savings accounts
- Monitor total savings across all accounts
- Calculate annual savings contributions

### Mortgage Planning
- Plan for future home purchases
- Track current mortgage balances
- Calculate new mortgage amounts and interest rates

### Financial Health Dashboard
- Monitor monthly cash flow
- View annual surplus/deficit calculations
- Track how many months of expenses your savings cover

## Data Persistence

The application automatically saves your data to MongoDB Atlas:
- Data is saved when you click the "Save Plan" button
- Your plan persists between sessions
- No user authentication required - perfect for personal use

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── retirement-plan/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── RetirementPlanner.tsx
├── lib/                   # Utility functions
│   ├── mongodb.ts        # Database connection
│   └── utils.ts          # Helper functions
└── models/               # Database models
    └── RetirementPlan.ts
```

## Customization

### Adding New Fields
1. Update the `IRetirementPlan` interface in `src/models/RetirementPlan.ts`
2. Add the field to the MongoDB schema
3. Update the component state and UI in `RetirementPlanner.tsx`

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize shadcn/ui components in `src/components/ui/`

### Calculations
- Financial calculations are in the `RetirementPlanner` component
- Add new calculation logic in the component or create utility functions

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `MONGODB_URI` environment variable in Vercel
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For questions or issues:
1. Check the GitHub issues
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## Roadmap

- [ ] Investment portfolio tracking
- [ ] Retirement goal calculators
- [ ] Data export/import functionality
- [ ] Advanced financial projections
- [ ] Multiple retirement scenarios
- [ ] Tax optimization suggestions


