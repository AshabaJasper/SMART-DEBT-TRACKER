// ==================== MAIN APPLICATION COMPONENT ====================

function App() {
    // State management
    const [activeTab, setActiveTab] = React.useState('dashboard');
    const [debts, setDebts] = React.useState([]);
    const [goals, setGoals] = React.useState([]);
    const [income, setIncome] = React.useState(0);
    const [settings, setSettings] = React.useState({
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        theme: 'light',
        notifications: true,
        autoSave: true,
        defaultStrategy: 'avalanche'
    });

    // Load data from localStorage on component mount
    React.useEffect(() => {
        try {
            const savedDebts = StorageUtils.load('debts', []);
            const savedGoals = StorageUtils.load('goals', []);
            const savedIncome = StorageUtils.load('income', 0);
            const savedSettings = StorageUtils.load('settings', settings);

            if (Array.isArray(savedDebts)) {
                setDebts(savedDebts);
            }
            if (Array.isArray(savedGoals)) {
                // Convert date strings back to Date objects
                const goalsWithDates = savedGoals.map(goal => ({
                    ...goal,
                    targetDate: new Date(goal.targetDate),
                    createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date()
                }));
                setGoals(goalsWithDates);
            }
            if (typeof savedIncome === 'number') {
                setIncome(savedIncome);
            }
            if (typeof savedSettings === 'object' && savedSettings !== null) {
                setSettings({ ...settings, ...savedSettings });
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
    }, []);

    // Save data to localStorage whenever state changes
    React.useEffect(() => {
        if (settings.autoSave) {
            StorageUtils.save('debts', debts);
        }
    }, [debts, settings.autoSave]);

    React.useEffect(() => {
        if (settings.autoSave) {
            StorageUtils.save('goals', goals);
        }
    }, [goals, settings.autoSave]);

    React.useEffect(() => {
        if (settings.autoSave) {
            StorageUtils.save('income', income);
        }
    }, [income, settings.autoSave]);

    React.useEffect(() => {
        StorageUtils.save('settings', settings);
    }, [settings]);

    // Tab configuration
    const tabs = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: React.createElement('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' },
                React.createElement('path', { d: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' })
            ),
            component: DashboardOverview
        },
        {
            id: 'debts',
            name: 'Debt Management',
            icon: React.createElement('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' },
                React.createElement('path', { fillRule: 'evenodd', d: 'M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' })
            ),
            component: DebtManagement
        },
        {
            id: 'strategy',
            name: 'Payoff Strategy',
            icon: React.createElement('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' },
                React.createElement('path', { fillRule: 'evenodd', d: 'M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z' })
            ),
            component: PayoffStrategy
        },
        {
            id: 'goals',
            name: 'SMART Goals',
            icon: React.createElement('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' },
                React.createElement('path', { fillRule: 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' })
            ),
            component: SMARTGoals
        },
        {
            id: 'settings',
            name: 'Settings',
            icon: React.createElement('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' },
                React.createElement('path', { fillRule: 'evenodd', d: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z' })
            ),
            component: Settings
        }
    ];

    // Get active tab component
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    const ActiveComponent = activeTabData ? activeTabData.component : DashboardOverview;

    // Handle keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + number keys for tab switching
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                const tabIndex = parseInt(e.key) - 1;
                if (tabs[tabIndex]) {
                    setActiveTab(tabs[tabIndex].id);
                }
            }
            
            // Escape key to close modals (handled by individual components)
            if (e.key === 'Escape') {
                // This could be used to close any global modals
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Apply theme
    React.useEffect(() => {
        const root = document.documentElement;
        if (settings.theme === 'dark') {
            root.classList.add('dark');
        } else if (settings.theme === 'light') {
            root.classList.remove('dark');
        } else {
            // Auto theme - use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [settings.theme]);

    return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
        // Header
        React.createElement('header', { className: 'bg-white shadow-sm border-b' },
            React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
                React.createElement('div', { className: 'flex justify-between items-center h-16' },
                    // Logo and Title
                    React.createElement('div', { className: 'flex items-center space-x-3' },
                        React.createElement('div', { className: 'w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center' },
                            React.createElement('svg', { className: 'w-5 h-5 text-white', fill: 'currentColor', viewBox: '0 0 20 20' },
                                React.createElement('path', { d: 'M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' }),
                                React.createElement('path', { fillRule: 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z' })
                            )
                        ),
                        React.createElement('h1', { className: 'text-xl font-bold text-gray-900' }, 'SMART Debt Tracker')
                    ),
                    
                    // Quick Stats
                    React.createElement('div', { className: 'hidden md:flex items-center space-x-6 text-sm' },
                        React.createElement('div', { className: 'text-center' },
                            React.createElement('p', { className: 'text-gray-500' }, 'Total Debt'),
                            React.createElement('p', { className: 'font-bold text-red-600' }, 
                                formatCurrency(debts.reduce((sum, debt) => sum + debt.balance, 0))
                            )
                        ),
                        React.createElement('div', { className: 'text-center' },
                            React.createElement('p', { className: 'text-gray-500' }, 'Active Goals'),
                            React.createElement('p', { className: 'font-bold text-blue-600' }, goals.length)
                        ),
                        React.createElement('div', { className: 'text-center' },
                            React.createElement('p', { className: 'text-gray-500' }, 'Monthly Income'),
                            React.createElement('p', { className: 'font-bold text-green-600' }, 
                                formatCurrency(income / 12)
                            )
                        )
                    )
                )
            )
        ),

        // Navigation
        React.createElement('nav', { className: 'bg-white border-b' },
            React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
                React.createElement('div', { className: 'flex space-x-8 overflow-x-auto' },
                    tabs.map((tab, index) =>
                        React.createElement('button', {
                            key: tab.id,
                            className: `flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`,
                            onClick: () => setActiveTab(tab.id),
                            title: `${tab.name} (Ctrl+${index + 1})`
                        },
                        tab.icon,
                        React.createElement('span', null, tab.name)
                        )
                    )
                )
            )
        ),

        // Main Content
        React.createElement('main', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
            React.createElement(ActiveComponent, {
                debts,
                setDebts,
                goals,
                setGoals,
                income,
                setIncome,
                settings,
                setSettings
            })
        ),

        // Footer
        React.createElement('footer', { className: 'bg-white border-t mt-12' },
            React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6' },
                React.createElement('div', { className: 'flex justify-between items-center text-sm text-gray-500' },
                    React.createElement('p', null, '© 2024 SMART Debt Tracker. Built with React & Tailwind CSS.'),
                    React.createElement('div', { className: 'flex space-x-4' },
                        React.createElement('span', null, `Last saved: ${DateUtils.formatDate(new Date())}`),
                        React.createElement('span', null, `v1.0`)
                    )
                )
            )
        )
    );
}

// Initialize the React application
document.addEventListener('DOMContentLoaded', function() {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
});
