# 💰 SMART Debt Tracker

**Take Control of Your Financial Future**

A comprehensive, privacy-first debt management and financial planning application built with React and Tailwind CSS. Track debts, optimize payoff strategies, set SMART goals, and monitor your financial health - all in your browser with no data sharing.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/user/smart-debt-tracker)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Privacy](https://img.shields.io/badge/privacy-local%20only-brightgreen.svg)](#privacy--security)

## 🚀 Features

### 📊 Dashboard Overview
- Real-time financial health score calculation
- Interactive debt breakdown charts
- Monthly cash flow visualization
- Key financial metrics at a glance
- Quick action buttons for common tasks

### 💳 Debt Management
- Add, edit, and track multiple debts
- Support for various debt types (credit cards, loans, mortgages, etc.)
- Payment tracking and balance updates
- Sorting and filtering capabilities
- Visual debt categorization

### 📈 Payoff Strategy
- **Debt Avalanche**: Highest interest rate first (saves most money)
- **Debt Snowball**: Smallest balance first (builds momentum)
- Interactive strategy comparison
- Customizable extra payment scenarios
- Detailed payoff timeline with projections
- Total interest and time savings calculations

### 🎯 SMART Goals
- Create and track financial goals using SMART criteria
- Goal categories: Emergency Fund, Debt Payoff, Savings, Investment, etc.
- Progress tracking with visual indicators
- Automated goal suggestions based on financial situation
- Priority-based goal organization

### ⚙️ Settings & Data Management
- Customizable currency and date formats
- Theme selection (Light/Dark/Auto)
- Data export/import functionality
- Financial information management
- Application preferences

## 🛠️ Technical Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom components
- **Charts**: Recharts library for data visualization
- **Build**: Babel Standalone for JSX transpilation
- **Storage**: localStorage for data persistence
- **Architecture**: Modular component-based structure

## 📁 Project Structure

```
SMART DEBT TRACKER/
├── index.html              # Main HTML entry point
├── styles/
│   └── main.css            # Custom CSS styles and animations
├── js/
│   ├── utils.js            # Utility functions and helpers
│   ├── app.js              # Main React application component
│   └── components/
│       ├── Dashboard.js        # Dashboard overview component
│       ├── DebtManagement.js   # Debt CRUD operations
│       ├── PayoffStrategy.js   # Strategy analysis and comparison
│       ├── SMARTGoals.js       # Goal management and tracking
│       └── Settings.js         # Application settings and preferences
└── README.md               # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Local web server (recommended for file loading)

### Installation & Setup

1. **Clone or download** the project files to your local machine

2. **Start a local web server** (choose one method):
   
   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js**
   ```bash
   npx http-server
   ```
   
   **Option C: Using VS Code Live Server**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Open your browser** and navigate to `http://localhost:8000` (or the port shown by your server)

### First Time Setup

1. **Add Your Income**: Go to Settings → Financial Information to set your annual income
2. **Add Your Debts**: Use Debt Management to add your credit cards, loans, and other debts
3. **Set Goals**: Create SMART financial goals or use the suggested goals feature
4. **Choose Strategy**: Compare debt payoff strategies and select your preferred approach

## 💡 Usage Guide

### Adding Debts
1. Navigate to "Debt Management"
2. Click "Add Debt"
3. Fill in the debt details:
   - Name (e.g., "Chase Credit Card")
   - Type (Credit Card, Personal Loan, etc.)
   - Current Balance
   - Interest Rate (APR)
   - Minimum Monthly Payment

### Setting Up Payoff Strategy
1. Go to "Payoff Strategy"
2. Enter your available extra payment amount
3. Compare Avalanche vs Snowball strategies
4. Review the detailed payoff timeline
5. Choose your preferred strategy

### Creating SMART Goals
1. Visit "SMART Goals"
2. Click "Add Goal" or use "Get Suggestions"
3. Define your goal using SMART criteria:
   - **Specific**: Clear and well-defined
   - **Measurable**: Quantifiable target amount
   - **Achievable**: Realistic given your financial situation
   - **Relevant**: Aligned with your financial priorities
   - **Time-bound**: Set a target date

### Managing Your Data
- **Export**: Create backups of all your financial data
- **Import**: Restore data from previous backups
- **Auto-save**: Automatically saves changes (enabled by default)

## 🎯 Key Calculations

### Financial Health Score
Calculated based on:
- **Income Stability** (20 points)
- **Debt-to-Income Ratio** (25 points)
- **Emergency Fund** (20 points)
- **Savings Rate** (20 points)
- **Financial Diversification** (15 points)

### Debt Avalanche Strategy
Prioritizes debts by highest interest rate, minimizing total interest paid over time.

### Debt Snowball Strategy
Prioritizes debts by smallest balance, providing psychological wins to build momentum.

## 🔧 Customization

### Adding New Debt Types
Edit the `debtTypes` array in `DebtManagement.js`:
```javascript
const debtTypes = [
    { value: 'your_new_type', label: 'Your New Type' },
    // ... existing types
];
```

### Modifying Goal Categories
Update the `goalCategories` array in `SMARTGoals.js`:
```javascript
const goalCategories = [
    'Your Custom Category',
    // ... existing categories
];
```

### Customizing Themes
Modify the CSS variables in `styles/main.css` or add new theme options in `Settings.js`.

## 📱 Browser Compatibility

- **Chrome**: 88+ ✅
- **Firefox**: 85+ ✅
- **Safari**: 14+ ✅
- **Edge**: 88+ ✅

## 🔒 Privacy & Security

- **Local Storage Only**: All data is stored locally in your browser
- **No External Servers**: No data is transmitted to external servers
- **Privacy First**: Your financial information never leaves your device
- **Secure**: No account creation or personal information required

## 🎨 Features Highlights

### Visual Design
- Modern, clean interface with intuitive navigation
- Responsive design for desktop and mobile devices
- Interactive charts and graphs for data visualization
- Color-coded indicators for different debt types and priorities
- Smooth animations and transitions

### User Experience
- Keyboard shortcuts for quick navigation (Ctrl+1-5)
- Auto-save functionality to prevent data loss
- Contextual help and guidance throughout the application
- Smart suggestions based on your financial situation
- Export/import for data portability

### Financial Intelligence
- Automated financial health scoring
- Strategy comparison with detailed analysis
- SMART goal generation based on your financial profile
- Real-time calculations and projections
- Comprehensive progress tracking

## 🤝 Contributing

This is an open-source project. Feel free to:
- Report bugs or issues
- Suggest new features
- Submit improvements
- Fork the project for your own use

## 📄 License

This project is released under the MIT License. You are free to use, modify, and distribute it as needed.

## 🆘 Support

For questions, issues, or feature requests:
1. Check the browser console for any error messages
2. Ensure you're using a supported browser
3. Try refreshing the page or clearing browser cache
4. Verify that JavaScript is enabled in your browser

## 🔮 Future Enhancements

Potential features for future versions:
- Multiple currency support with exchange rates
- Advanced investment tracking
- Bill reminder notifications
- PDF report generation
- Cloud synchronization options
- Mobile app version
- Advanced analytics and insights

---

**Built with ❤️ for better financial health and debt freedom!**
