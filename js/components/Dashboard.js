// ==================== DASHBOARD OVERVIEW COMPONENT ====================

function DashboardOverview({ debts, goals, income, settings }) {
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const monthlyPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
    const totalGoalProgress = goals.length > 0 ? 
        (goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / goals.length) * 100 : 0;

    // Calculate financial health score
    const financialHealth = calculateFinancialHealth({
        income,
        debts,
        savings: goals.find(g => g.category === 'Emergency')?.currentAmount || 0,
        monthlyExpenses: monthlyPayments
    });

    // Prepare chart data for debt visualization
    const debtChartData = debts.length > 0 ? debts.map(debt => ({
        name: debt.name,
        balance: debt.balance,
        rate: debt.rate
    })) : [];

    // Monthly cash flow data (simplified)
    const monthlyIncome = income / 12;
    const cashFlowData = [
        { name: 'Income', amount: monthlyIncome, color: '#10b981' },
        { name: 'Debt Payments', amount: monthlyPayments, color: '#ef4444' },
        { name: 'Available', amount: Math.max(0, monthlyIncome - monthlyPayments), color: '#3b82f6' }
    ];

    return React.createElement('div', { className: 'space-y-6 fade-in' },
        // Header
        React.createElement('div', { className: 'flex justify-between items-center' },
            React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Financial Dashboard'),
            React.createElement('div', { className: 'text-sm text-gray-500' },
                `Last updated: ${DateUtils.formatDate(new Date())}`
            )
        ),

        // Key Metrics Cards
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' },
            // Total Debt Card
            React.createElement('div', { className: 'metric-card card-hover bg-red-50 border-red-200' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                    React.createElement('div', null,
                        React.createElement('p', { className: 'text-sm font-medium text-red-600' }, 'Total Debt'),
                        React.createElement('p', { className: 'text-2xl font-bold text-red-900' }, formatCurrency(totalDebt))
                    ),
                    React.createElement('div', { className: 'p-3 bg-red-100 rounded-full' },
                        React.createElement('svg', { className: 'w-6 h-6 text-red-600', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { fillRule: 'evenodd', d: 'M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' })
                        )
                    )
                )
            ),

            // Monthly Payments Card
            React.createElement('div', { className: 'metric-card card-hover bg-orange-50 border-orange-200' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                    React.createElement('div', null,
                        React.createElement('p', { className: 'text-sm font-medium text-orange-600' }, 'Monthly Payments'),
                        React.createElement('p', { className: 'text-2xl font-bold text-orange-900' }, formatCurrency(monthlyPayments))
                    ),
                    React.createElement('div', { className: 'p-3 bg-orange-100 rounded-full' },
                        React.createElement('svg', { className: 'w-6 h-6 text-orange-600', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { fillRule: 'evenodd', d: 'M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' })
                        )
                    )
                )
            ),

            // Goals Progress Card
            React.createElement('div', { className: 'metric-card card-hover bg-blue-50 border-blue-200' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                    React.createElement('div', null,
                        React.createElement('p', { className: 'text-sm font-medium text-blue-600' }, 'Goals Progress'),
                        React.createElement('p', { className: 'text-2xl font-bold text-blue-900' }, `${Math.round(totalGoalProgress)}%`)
                    ),
                    React.createElement('div', { className: 'p-3 bg-blue-100 rounded-full' },
                        React.createElement('svg', { className: 'w-6 h-6 text-blue-600', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { fillRule: 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' })
                        )
                    )
                )
            ),

            // Financial Health Card
            React.createElement('div', { className: 'metric-card card-hover bg-green-50 border-green-200' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                    React.createElement('div', null,
                        React.createElement('p', { className: 'text-sm font-medium text-green-600' }, 'Financial Health'),
                        React.createElement('p', { className: 'text-2xl font-bold text-green-900' }, `${financialHealth.score}/100`)
                    ),
                    React.createElement('div', { className: 'p-3 bg-green-100 rounded-full' },
                        React.createElement('svg', { className: 'w-6 h-6 text-green-600', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { fillRule: 'evenodd', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
                        )
                    )
                )
            )
        ),

        // Charts Section
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
            // Debt Breakdown Chart
            React.createElement('div', { className: 'card' },
                React.createElement('div', { className: 'card-header' },
                    React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Debt Breakdown')
                ),
                React.createElement('div', { className: 'card-body' },
                    debtChartData.length > 0 ? (
                        typeof Recharts !== 'undefined' ? 
                            React.createElement(Recharts.ResponsiveContainer, { width: '100%', height: 300 },
                                React.createElement(Recharts.PieChart, null,
                                    React.createElement(Recharts.Pie, {
                                        data: debtChartData,
                                        dataKey: 'balance',
                                        nameKey: 'name',
                                        cx: '50%',
                                        cy: '50%',
                                        outerRadius: 80,
                                        fill: '#8884d8'
                                    },
                                    debtChartData.map((entry, index) => 
                                        React.createElement(Recharts.Cell, { 
                                            key: `cell-${index}`, 
                                            fill: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'][index % 5] 
                                        })
                                    )
                                    ),
                                    React.createElement(Recharts.Tooltip, { formatter: (value) => formatCurrency(value) }),
                                    React.createElement(Recharts.Legend)
                                )
                            ) :
                            React.createElement('div', { className: 'text-center py-8' },
                                React.createElement('p', { className: 'text-gray-500' }, 'Chart library not available'),
                                React.createElement('div', { className: 'mt-4 space-y-2' },
                                    debtChartData.map((debt, index) =>
                                        React.createElement('div', { key: index, className: 'flex justify-between items-center p-2 bg-gray-50 rounded' },
                                            React.createElement('span', { className: 'font-medium' }, debt.name),
                                            React.createElement('span', { className: 'text-gray-600' }, formatCurrency(debt.balance))
                                        )
                                    )
                                )
                            )
                    ) : (
                        React.createElement('div', { className: 'text-center py-8 text-gray-500' },
                            React.createElement('p', null, 'No debt data to display'),
                            React.createElement('p', { className: 'text-sm mt-2' }, 'Add some debts to see the breakdown')
                        )
                    )
                )
            ),

            // Cash Flow Chart
            React.createElement('div', { className: 'card' },
                React.createElement('div', { className: 'card-header' },
                    React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Monthly Cash Flow')
                ),
                React.createElement('div', { className: 'card-body' },
                    typeof Recharts !== 'undefined' ? 
                        React.createElement(Recharts.ResponsiveContainer, { width: '100%', height: 300 },
                            React.createElement(Recharts.BarChart, { data: cashFlowData },
                                React.createElement(Recharts.CartesianGrid, { strokeDasharray: '3 3' }),
                                React.createElement(Recharts.XAxis, { dataKey: 'name' }),
                                React.createElement(Recharts.YAxis, { tickFormatter: formatCurrency }),
                                React.createElement(Recharts.Tooltip, { formatter: (value) => formatCurrency(value) }),
                                React.createElement(Recharts.Bar, { dataKey: 'amount', fill: '#3b82f6' },
                                    cashFlowData.map((entry, index) => 
                                        React.createElement(Recharts.Cell, { key: `cell-${index}`, fill: entry.color })
                                    )
                                )
                            )
                        ) :
                        React.createElement('div', { className: 'space-y-4' },
                            cashFlowData.map((item, index) =>
                                React.createElement('div', { key: index, className: 'flex justify-between items-center p-3 rounded-lg', style: { backgroundColor: `${item.color}20` } },
                                    React.createElement('span', { className: 'font-medium' }, item.name),
                                    React.createElement('span', { className: 'font-bold', style: { color: item.color } }, formatCurrency(item.amount))
                                )
                            )
                        )
                )
            )
        ),

        // Quick Actions
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Quick Actions')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
                    React.createElement('button', { 
                        className: 'btn-primary flex items-center justify-center space-x-2',
                        onClick: () => alert('Add Debt functionality')
                    },
                        React.createElement('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { fillRule: 'evenodd', d: 'M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' })
                        ),
                        React.createElement('span', null, 'Add Debt')
                    ),
                    React.createElement('button', { 
                        className: 'btn-success flex items-center justify-center space-x-2',
                        onClick: () => alert('Make Payment functionality')
                    },
                        React.createElement('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { fillRule: 'evenodd', d: 'M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' })
                        ),
                        React.createElement('span', null, 'Make Payment')
                    ),
                    React.createElement('button', { 
                        className: 'btn-secondary flex items-center justify-center space-x-2',
                        onClick: () => alert('View Report functionality')
                    },
                        React.createElement('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { d: 'M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' })
                        ),
                        React.createElement('span', null, 'View Report')
                    )
                )
            )
        ),

        // Financial Health Breakdown
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, `Financial Health: ${financialHealth.level}`)
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'space-y-4' },
                    Object.entries(financialHealth.breakdown).map(([key, value]) =>
                        React.createElement('div', { key: key, className: 'flex items-center justify-between' },
                            React.createElement('div', { className: 'flex items-center space-x-3' },
                                React.createElement('span', { className: 'font-medium capitalize' }, key.replace(/([A-Z])/g, ' $1')),
                                React.createElement('span', { 
                                    className: `px-2 py-1 text-xs rounded-full ${
                                        value.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                                        value.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                                        value.status === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`
                                }, value.status)
                            ),
                            React.createElement('div', { className: 'flex items-center space-x-2' },
                                React.createElement('div', { className: 'w-32 bg-gray-200 rounded-full h-2' },
                                    React.createElement('div', { 
                                        className: `h-2 rounded-full ${
                                            value.status === 'Excellent' ? 'bg-green-500' :
                                            value.status === 'Good' ? 'bg-blue-500' :
                                            value.status === 'Fair' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`,
                                        style: { width: `${(value.score / value.max) * 100}%` }
                                    })
                                ),
                                React.createElement('span', { className: 'text-sm font-medium' }, `${value.score}/${value.max}`)
                            )
                        )
                    )
                )
            )
        )
    );
}
