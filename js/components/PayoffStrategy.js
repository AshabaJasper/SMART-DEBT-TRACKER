// ==================== PAYOFF STRATEGY COMPONENT ====================

function PayoffStrategy({ debts, income, settings }) {
    const [extraPayment, setExtraPayment] = React.useState(0);
    const [strategy, setStrategy] = React.useState('avalanche');
    const [showComparison, setShowComparison] = React.useState(false);

    // Calculate strategies
    const avalancheStrategy = React.useMemo(() => 
        calculatePayoffStrategy(debts, extraPayment, 'avalanche'), 
        [debts, extraPayment]
    );

    const snowballStrategy = React.useMemo(() => 
        calculatePayoffStrategy(debts, extraPayment, 'snowball'), 
        [debts, extraPayment]
    );

    const currentStrategy = strategy === 'avalanche' ? avalancheStrategy : snowballStrategy;

    // Calculate recommended extra payment based on income
    const monthlyIncome = income / 12;
    const monthlyDebtPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const availableIncome = monthlyIncome - monthlyDebtPayments;
    const recommendedExtraPayment = Math.max(0, availableIncome * 0.2); // 20% of available income

    const StrategyCard = ({ strategyData, strategyName, isSelected, onSelect }) => (
        React.createElement('div', { 
            className: `card card-hover cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`,
            onClick: onSelect
        },
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 
                        strategyName === 'avalanche' ? 'Debt Avalanche' : 'Debt Snowball'
                    ),
                    isSelected && React.createElement('div', { className: 'w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center' },
                        React.createElement('svg', { className: 'w-3 h-3 text-white', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { fillRule: 'evenodd', d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' })
                        )
                    )
                ),
                React.createElement('p', { className: 'text-sm text-gray-600 mb-4' },
                    strategyName === 'avalanche' ? 
                        'Pay minimums on all debts, then focus extra payments on the highest interest rate debt first.' :
                        'Pay minimums on all debts, then focus extra payments on the smallest balance debt first.'
                ),
                React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
                    React.createElement('div', null,
                        React.createElement('p', { className: 'text-sm font-medium text-gray-700' }, 'Payoff Time'),
                        React.createElement('p', { className: 'text-xl font-bold text-blue-600' }, 
                            `${strategyData.totalMonths} months`
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('p', { className: 'text-sm font-medium text-gray-700' }, 'Total Interest'),
                        React.createElement('p', { className: 'text-xl font-bold text-red-600' }, 
                            formatCurrency(strategyData.totalInterest)
                        )
                    )
                ),
                React.createElement('div', { className: 'mt-4' },
                    React.createElement('div', { className: 'flex justify-between text-sm text-gray-600 mb-1' },
                        React.createElement('span', null, 'Progress'),
                        React.createElement('span', null, 'Total Paid: ', formatCurrency(strategyData.totalPaid))
                    ),
                    React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2' },
                        React.createElement('div', { 
                            className: 'bg-blue-500 h-2 rounded-full progress-bar',
                            style: { width: '0%' }
                        })
                    )
                )
            )
        )
    );

    const PayoffTimeline = ({ payoffPlan }) => {
        if (!payoffPlan || payoffPlan.length === 0) {
            return React.createElement('div', { className: 'text-center py-8 text-gray-500' },
                'No payoff plan available'
            );
        }

        return React.createElement('div', { className: 'space-y-4' },
            payoffPlan.map((debt, index) => (
                React.createElement('div', { key: index, className: 'flex items-center space-x-4 p-4 bg-gray-50 rounded-lg' },
                    React.createElement('div', { className: 'flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold' },
                        index + 1
                    ),
                    React.createElement('div', { className: 'flex-grow' },
                        React.createElement('h4', { className: 'font-semibold text-gray-900' }, debt.name),
                        React.createElement('p', { className: 'text-sm text-gray-600' }, 
                            `Original Balance: ${formatCurrency(debt.originalBalance)}`
                        )
                    ),
                    React.createElement('div', { className: 'text-right' },
                        React.createElement('p', { className: 'font-semibold text-blue-600' }, 
                            `${debt.monthsToPayoff} months`
                        ),
                        React.createElement('p', { className: 'text-sm text-gray-600' }, 
                            `Interest: ${formatCurrency(debt.totalInterest)}`
                        )
                    )
                )
            ))
        );
    };

    const ComparisonChart = () => {
        const comparisonData = [
            {
                name: 'Avalanche',
                months: avalancheStrategy.totalMonths,
                interest: avalancheStrategy.totalInterest,
                savings: snowballStrategy.totalInterest - avalancheStrategy.totalInterest
            },
            {
                name: 'Snowball',
                months: snowballStrategy.totalMonths,
                interest: snowballStrategy.totalInterest,
                savings: avalancheStrategy.totalInterest - snowballStrategy.totalInterest
            }
        ];

        return React.createElement('div', { className: 'space-y-4' },
            comparisonData.map((item, index) => (
                React.createElement('div', { key: index, className: 'p-4 bg-gray-50 rounded-lg' },
                    React.createElement('div', { className: 'flex justify-between items-center mb-2' },
                        React.createElement('h4', { className: 'font-semibold text-gray-900' }, item.name),
                        React.createElement('span', { 
                            className: `px-2 py-1 text-xs rounded-full ${
                                item.savings > 0 ? 'bg-green-100 text-green-800' : 
                                item.savings < 0 ? 'bg-red-100 text-red-800' : 
                                'bg-gray-100 text-gray-800'
                            }`
                        }, 
                        item.savings > 0 ? `Saves ${formatCurrency(item.savings)}` :
                        item.savings < 0 ? `Costs ${formatCurrency(Math.abs(item.savings))} more` :
                        'Same cost'
                        )
                    ),
                    React.createElement('div', { className: 'grid grid-cols-2 gap-4 text-sm' },
                        React.createElement('div', null,
                            React.createElement('p', { className: 'text-gray-600' }, 'Payoff Time'),
                            React.createElement('p', { className: 'font-semibold' }, `${item.months} months`)
                        ),
                        React.createElement('div', null,
                            React.createElement('p', { className: 'text-gray-600' }, 'Total Interest'),
                            React.createElement('p', { className: 'font-semibold' }, formatCurrency(item.interest))
                        )
                    )
                )
            ))
        );
    };

    return React.createElement('div', { className: 'space-y-6 fade-in' },
        // Header
        React.createElement('div', { className: 'flex justify-between items-center' },
            React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Payoff Strategy'),
            React.createElement('button', {
                className: 'btn-secondary',
                onClick: () => setShowComparison(!showComparison)
            }, showComparison ? 'Hide Comparison' : 'Compare Strategies')
        ),

        // Extra Payment Configuration
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Extra Payment Configuration')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Extra Monthly Payment'),
                        React.createElement('input', {
                            type: 'number',
                            className: 'form-input',
                            placeholder: '0.00',
                            step: '0.01',
                            value: extraPayment,
                            onChange: (e) => setExtraPayment(parseFloat(e.target.value) || 0)
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Recommended Extra Payment'),
                        React.createElement('div', { className: 'p-3 bg-green-50 rounded-lg' },
                            React.createElement('p', { className: 'text-lg font-bold text-green-700' }, formatCurrency(recommendedExtraPayment)),
                            React.createElement('p', { className: 'text-xs text-green-600' }, '20% of available income')
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Quick Actions'),
                        React.createElement('div', { className: 'space-y-2' },
                            React.createElement('button', {
                                className: 'btn-secondary w-full text-sm',
                                onClick: () => setExtraPayment(recommendedExtraPayment)
                            }, 'Use Recommended'),
                            React.createElement('button', {
                                className: 'btn-secondary w-full text-sm',
                                onClick: () => setExtraPayment(0)
                            }, 'Clear Extra Payment')
                        )
                    )
                )
            )
        ),

        // Strategy Selection
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
            React.createElement(StrategyCard, {
                strategyData: avalancheStrategy,
                strategyName: 'avalanche',
                isSelected: strategy === 'avalanche',
                onSelect: () => setStrategy('avalanche')
            }),
            React.createElement(StrategyCard, {
                strategyData: snowballStrategy,
                strategyName: 'snowball',
                isSelected: strategy === 'snowball',
                onSelect: () => setStrategy('snowball')
            })
        ),

        // Strategy Comparison
        showComparison && React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Strategy Comparison')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement(ComparisonChart)
            )
        ),

        // Current Strategy Details
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 
                    `${strategy === 'avalanche' ? 'Debt Avalanche' : 'Debt Snowball'} Strategy Details`
                )
            ),
            React.createElement('div', { className: 'card-body' },
                currentStrategy.totalMonths > 0 ? (
                    React.createElement('div', { className: 'space-y-6' },
                        // Summary Stats
                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-4' },
                            React.createElement('div', { className: 'text-center p-4 bg-blue-50 rounded-lg' },
                                React.createElement('p', { className: 'text-sm font-medium text-blue-600' }, 'Payoff Time'),
                                React.createElement('p', { className: 'text-2xl font-bold text-blue-900' }, `${currentStrategy.totalMonths} months`),
                                React.createElement('p', { className: 'text-xs text-blue-600' }, `${Math.floor(currentStrategy.totalMonths / 12)} years, ${currentStrategy.totalMonths % 12} months`)
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-red-50 rounded-lg' },
                                React.createElement('p', { className: 'text-sm font-medium text-red-600' }, 'Total Interest'),
                                React.createElement('p', { className: 'text-2xl font-bold text-red-900' }, formatCurrency(currentStrategy.totalInterest))
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-green-50 rounded-lg' },
                                React.createElement('p', { className: 'text-sm font-medium text-green-600' }, 'Total Paid'),
                                React.createElement('p', { className: 'text-2xl font-bold text-green-900' }, formatCurrency(currentStrategy.totalPaid))
                            ),
                            React.createElement('div', { className: 'text-center p-4 bg-purple-50 rounded-lg' },
                                React.createElement('p', { className: 'text-sm font-medium text-purple-600' }, 'Monthly Savings'),
                                React.createElement('p', { className: 'text-2xl font-bold text-purple-900' }, formatCurrency(currentStrategy.monthlySavings))
                            )
                        ),

                        // Payoff Timeline
                        React.createElement('div', null,
                            React.createElement('h4', { className: 'text-lg font-semibold text-gray-900 mb-4' }, 'Payoff Timeline'),
                            React.createElement(PayoffTimeline, { payoffPlan: currentStrategy.payoffPlan })
                        ),

                        // Tips and Recommendations
                        React.createElement('div', { className: 'bg-blue-50 border-l-4 border-blue-400 p-4' },
                            React.createElement('div', { className: 'flex' },
                                React.createElement('div', { className: 'flex-shrink-0' },
                                    React.createElement('svg', { className: 'h-5 w-5 text-blue-400', fill: 'currentColor', viewBox: '0 0 20 20' },
                                        React.createElement('path', { fillRule: 'evenodd', d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' })
                                    )
                                ),
                                React.createElement('div', { className: 'ml-3' },
                                    React.createElement('h4', { className: 'text-sm font-medium text-blue-800' }, 'Strategy Tips'),
                                    React.createElement('div', { className: 'mt-2 text-sm text-blue-700' },
                                        React.createElement('ul', { className: 'list-disc list-inside space-y-1' },
                                            strategy === 'avalanche' ? (
                                                React.createElement(React.Fragment, null,
                                                    React.createElement('li', null, 'Focus extra payments on highest interest rate debts first'),
                                                    React.createElement('li', null, 'This strategy typically saves the most money in interest'),
                                                    React.createElement('li', null, 'May take longer to see individual debts paid off')
                                                )
                                            ) : (
                                                React.createElement(React.Fragment, null,
                                                    React.createElement('li', null, 'Focus extra payments on smallest balance debts first'),
                                                    React.createElement('li', null, 'This strategy provides psychological wins with quick payoffs'),
                                                    React.createElement('li', null, 'May cost more in total interest but builds momentum')
                                                )
                                            ),
                                            React.createElement('li', null, 'Always make minimum payments on all debts'),
                                            React.createElement('li', null, 'Consider increasing extra payments when your income grows')
                                        )
                                    )
                                )
                            )
                        )
                    )
                ) : (
                    React.createElement('div', { className: 'text-center py-8' },
                        React.createElement('svg', { className: 'w-12 h-12 text-gray-400 mx-auto mb-4', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { fillRule: 'evenodd', d: 'M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' })
                        ),
                        React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' }, 'No Debts to Analyze'),
                        React.createElement('p', { className: 'text-gray-500' }, 'Add some debts to see payoff strategies and analysis.')
                    )
                )
            )
        )
    );
}
