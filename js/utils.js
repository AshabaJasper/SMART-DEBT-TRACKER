// ==================== UTILITY FUNCTIONS ====================

/**
 * Format currency values with proper localization
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'USD') {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return '$0.00';
    }
    
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (error) {
        // Fallback for unsupported currencies
        return `$${amount.toFixed(2)}`;
    }
}

/**
 * Calculate optimal debt payoff strategy using avalanche/snowball method
 * @param {Array} debts - Array of debt objects
 * @param {number} extraPayment - Extra payment amount
 * @param {string} strategy - 'avalanche' or 'snowball'
 * @returns {Object} Strategy analysis with timeline and total interest
 */
function calculatePayoffStrategy(debts, extraPayment = 0, strategy = 'avalanche') {
    if (!Array.isArray(debts) || debts.length === 0) {
        return {
            totalMonths: 0,
            totalInterest: 0,
            totalPaid: 0,
            payoffPlan: [],
            monthlySavings: 0
        };
    }

    // Validate and clean debt data
    const validDebts = debts.filter(debt => 
        debt && 
        typeof debt.balance === 'number' && debt.balance > 0 &&
        typeof debt.rate === 'number' && debt.rate >= 0 &&
        typeof debt.minimumPayment === 'number' && debt.minimumPayment > 0
    );

    if (validDebts.length === 0) {
        return {
            totalMonths: 0,
            totalInterest: 0,
            totalPaid: 0,
            payoffPlan: [],
            monthlySavings: 0
        };
    }

    // Sort debts based on strategy
    const sortedDebts = [...validDebts].sort((a, b) => {
        if (strategy === 'avalanche') {
            return b.rate - a.rate; // Highest interest rate first
        } else {
            return a.balance - b.balance; // Smallest balance first (snowball)
        }
    });

    const totalMinimumPayment = sortedDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const totalAvailablePayment = totalMinimumPayment + extraPayment;
    
    let totalInterest = 0;
    let totalPaid = 0;
    let currentMonth = 0;
    const payoffPlan = [];
    
    // Create working copy of debts
    const workingDebts = sortedDebts.map(debt => ({
        ...debt,
        currentBalance: debt.balance,
        monthsToPayoff: 0,
        totalInterest: 0
    }));

    while (workingDebts.some(debt => debt.currentBalance > 0)) {
        currentMonth++;
        let availableExtraPayment = extraPayment;
        
        // Make minimum payments on all debts
        workingDebts.forEach(debt => {
            if (debt.currentBalance > 0) {
                const monthlyInterest = (debt.currentBalance * debt.rate / 100) / 12;
                const principalPayment = Math.min(debt.minimumPayment - monthlyInterest, debt.currentBalance);
                
                debt.currentBalance -= principalPayment;
                debt.totalInterest += monthlyInterest;
                totalInterest += monthlyInterest;
                totalPaid += debt.minimumPayment;
                
                if (debt.currentBalance <= 0) {
                    debt.currentBalance = 0;
                    debt.monthsToPayoff = currentMonth;
                }
            }
        });

        // Apply extra payment to the first debt with balance
        const targetDebt = workingDebts.find(debt => debt.currentBalance > 0);
        if (targetDebt && availableExtraPayment > 0) {
            const extraPrincipal = Math.min(availableExtraPayment, targetDebt.currentBalance);
            targetDebt.currentBalance -= extraPrincipal;
            totalPaid += extraPrincipal;
            
            if (targetDebt.currentBalance <= 0) {
                targetDebt.currentBalance = 0;
                targetDebt.monthsToPayoff = currentMonth;
            }
        }

        // Safety check to prevent infinite loops
        if (currentMonth > 600) { // 50 years maximum
            break;
        }
    }

    // Calculate comparison with minimum payments only
    const minimumOnlyTotal = validDebts.reduce((total, debt) => {
        const monthlyRate = debt.rate / 100 / 12;
        const months = monthlyRate === 0 ? 
            Math.ceil(debt.balance / debt.minimumPayment) :
            Math.log(1 + (debt.balance * monthlyRate) / debt.minimumPayment) / Math.log(1 + monthlyRate);
        return total + (debt.minimumPayment * months);
    }, 0);

    const monthlySavings = Math.max(0, (minimumOnlyTotal - totalPaid) / Math.max(1, currentMonth));

    return {
        totalMonths: currentMonth,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        payoffPlan: workingDebts.map(debt => ({
            name: debt.name,
            originalBalance: debt.balance,
            monthsToPayoff: debt.monthsToPayoff,
            totalInterest: Math.round(debt.totalInterest * 100) / 100
        })),
        monthlySavings: Math.round(monthlySavings * 100) / 100
    };
}

/**
 * Generate SMART financial goals based on user's financial situation
 * @param {Object} financialData - User's income, debts, and goals
 * @returns {Array} Array of SMART goal objects
 */
function generateSMARTGoals(financialData) {
    const goals = [];
    const { income = 0, debts = [], existingGoals = [] } = financialData;
    
    if (typeof income !== 'number' || income <= 0) {
        return goals;
    }

    const monthlyIncome = income / 12;
    const totalDebt = Array.isArray(debts) ? 
        debts.reduce((sum, debt) => sum + (debt.balance || 0), 0) : 0;
    const monthlyDebtPayments = Array.isArray(debts) ? 
        debts.reduce((sum, debt) => sum + (debt.minimumPayment || 0), 0) : 0;

    // Emergency Fund Goal
    const emergencyFundTarget = monthlyIncome * 6; // 6 months of income
    goals.push({
        id: 'emergency-fund',
        title: 'Build Emergency Fund',
        description: `Save ${formatCurrency(emergencyFundTarget)} for 6 months of expenses`,
        category: 'Emergency',
        targetAmount: emergencyFundTarget,
        currentAmount: 0,
        targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        isSpecific: true,
        isMeasurable: true,
        isAchievable: monthlyIncome > monthlyDebtPayments,
        isRelevant: true,
        isTimeBound: true,
        priority: 'High'
    });

    // Debt Payoff Goal (if user has debts)
    if (totalDebt > 0) {
        const strategy = calculatePayoffStrategy(debts, monthlyIncome * 0.1); // 10% extra payment
        goals.push({
            id: 'debt-payoff',
            title: 'Become Debt Free',
            description: `Pay off ${formatCurrency(totalDebt)} in debt using optimized strategy`,
            category: 'Debt',
            targetAmount: totalDebt,
            currentAmount: 0,
            targetDate: new Date(Date.now() + strategy.totalMonths * 30 * 24 * 60 * 60 * 1000),
            isSpecific: true,
            isMeasurable: true,
            isAchievable: strategy.totalMonths > 0 && strategy.totalMonths < 120, // Under 10 years
            isRelevant: true,
            isTimeBound: true,
            priority: 'High'
        });
    }

    // Retirement Savings Goal
    const retirementTarget = income * 10; // 10x annual income
    const yearsToRetirement = 30;
    goals.push({
        id: 'retirement',
        title: 'Retirement Savings',
        description: `Save ${formatCurrency(retirementTarget)} for retirement`,
        category: 'Retirement',
        targetAmount: retirementTarget,
        currentAmount: 0,
        targetDate: new Date(Date.now() + yearsToRetirement * 365 * 24 * 60 * 60 * 1000),
        isSpecific: true,
        isMeasurable: true,
        isAchievable: true,
        isRelevant: true,
        isTimeBound: true,
        priority: 'Medium'
    });

    // Short-term Savings Goal
    const shortTermTarget = monthlyIncome * 3; // 3 months income
    goals.push({
        id: 'short-term-savings',
        title: 'Short-term Savings',
        description: `Save ${formatCurrency(shortTermTarget)} for upcoming expenses`,
        category: 'Savings',
        targetAmount: shortTermTarget,
        currentAmount: 0,
        targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        isSpecific: true,
        isMeasurable: true,
        isAchievable: true,
        isRelevant: true,
        isTimeBound: true,
        priority: 'Medium'
    });

    // Investment Goal (if user has good financial foundation)
    if (totalDebt < monthlyIncome * 6) { // Low debt relative to income
        const investmentTarget = monthlyIncome * 12; // 1 year of income
        goals.push({
            id: 'investment',
            title: 'Investment Portfolio',
            description: `Build investment portfolio worth ${formatCurrency(investmentTarget)}`,
            category: 'Investment',
            targetAmount: investmentTarget,
            currentAmount: 0,
            targetDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000), // 2 years
            isSpecific: true,
            isMeasurable: true,
            isAchievable: true,
            isRelevant: true,
            isTimeBound: true,
            priority: 'Low'
        });
    }

    return goals;
}

/**
 * Calculate financial health score
 * @param {Object} financialData - User's financial information
 * @returns {Object} Health score and breakdown
 */
function calculateFinancialHealth(financialData) {
    const { income = 0, debts = [], savings = 0, monthlyExpenses = 0 } = financialData;
    
    let score = 0;
    const breakdown = {};

    // Income stability (20 points)
    if (income > 0) {
        score += 20;
        breakdown.income = { score: 20, max: 20, status: 'Good' };
    } else {
        breakdown.income = { score: 0, max: 20, status: 'Poor' };
    }

    // Debt-to-income ratio (25 points)
    const monthlyIncome = income / 12;
    const monthlyDebtPayments = Array.isArray(debts) ? 
        debts.reduce((sum, debt) => sum + (debt.minimumPayment || 0), 0) : 0;
    const debtRatio = monthlyIncome > 0 ? monthlyDebtPayments / monthlyIncome : 1;
    
    if (debtRatio <= 0.2) {
        score += 25;
        breakdown.debt = { score: 25, max: 25, status: 'Excellent' };
    } else if (debtRatio <= 0.36) {
        score += 20;
        breakdown.debt = { score: 20, max: 25, status: 'Good' };
    } else if (debtRatio <= 0.5) {
        score += 10;
        breakdown.debt = { score: 10, max: 25, status: 'Fair' };
    } else {
        breakdown.debt = { score: 0, max: 25, status: 'Poor' };
    }

    // Emergency fund (20 points)
    const emergencyFundRatio = monthlyIncome > 0 ? savings / (monthlyIncome * 3) : 0;
    if (emergencyFundRatio >= 2) {
        score += 20;
        breakdown.emergency = { score: 20, max: 20, status: 'Excellent' };
    } else if (emergencyFundRatio >= 1) {
        score += 15;
        breakdown.emergency = { score: 15, max: 20, status: 'Good' };
    } else if (emergencyFundRatio >= 0.5) {
        score += 10;
        breakdown.emergency = { score: 10, max: 20, status: 'Fair' };
    } else if (emergencyFundRatio > 0) {
        score += 5;
        breakdown.emergency = { score: 5, max: 20, status: 'Poor' };
    } else {
        breakdown.emergency = { score: 0, max: 20, status: 'Poor' };
    }

    // Savings rate (20 points)
    const savingsRate = monthlyIncome > 0 ? 
        (monthlyIncome - monthlyExpenses - monthlyDebtPayments) / monthlyIncome : 0;
    if (savingsRate >= 0.2) {
        score += 20;
        breakdown.savings = { score: 20, max: 20, status: 'Excellent' };
    } else if (savingsRate >= 0.15) {
        score += 15;
        breakdown.savings = { score: 15, max: 20, status: 'Good' };
    } else if (savingsRate >= 0.1) {
        score += 10;
        breakdown.savings = { score: 10, max: 20, status: 'Fair' };
    } else if (savingsRate > 0) {
        score += 5;
        breakdown.savings = { score: 5, max: 20, status: 'Poor' };
    } else {
        breakdown.savings = { score: 0, max: 20, status: 'Poor' };
    }

    // Diversification (15 points) - simplified for now
    const hasMultipleAccounts = Array.isArray(debts) && debts.length > 0 && savings > 0;
    if (hasMultipleAccounts) {
        score += 10;
        breakdown.diversification = { score: 10, max: 15, status: 'Fair' };
    } else {
        breakdown.diversification = { score: 0, max: 15, status: 'Poor' };
    }

    let healthLevel = 'Poor';
    if (score >= 80) healthLevel = 'Excellent';
    else if (score >= 65) healthLevel = 'Good';
    else if (score >= 50) healthLevel = 'Fair';

    return {
        score: Math.round(score),
        maxScore: 100,
        level: healthLevel,
        breakdown
    };
}

/**
 * Storage utilities for localStorage management
 */
const StorageUtils = {
    /**
     * Save data to localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     * @returns {boolean} Success status
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },

    /**
     * Load data from localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key not found
     * @returns {any} Stored data or default value
     */
    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage load error:', error);
            return defaultValue;
        }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage data
     * @returns {boolean} Success status
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

/**
 * Date utilities
 */
const DateUtils = {
    /**
     * Format date for display
     * @param {Date|string} date - Date to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        try {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    },

    /**
     * Calculate months between dates
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {number} Number of months
     */
    monthsBetween(startDate, endDate) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + 
                           (end.getMonth() - start.getMonth()));
        } catch (error) {
            return 0;
        }
    },

    /**
     * Add months to a date
     * @param {Date} date - Base date
     * @param {number} months - Months to add
     * @returns {Date} New date
     */
    addMonths(date, months) {
        try {
            const result = new Date(date);
            result.setMonth(result.getMonth() + months);
            return result;
        } catch (error) {
            return new Date();
        }
    }
};

// Export utilities for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        calculatePayoffStrategy,
        generateSMARTGoals,
        calculateFinancialHealth,
        StorageUtils,
        DateUtils
    };
}
