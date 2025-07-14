// ==================== SMART GOALS COMPONENT ====================

function SMARTGoals({ goals, setGoals, income, debts, settings }) {
    const [isAddingGoal, setIsAddingGoal] = React.useState(false);
    const [editingGoal, setEditingGoal] = React.useState(null);
    const [filter, setFilter] = React.useState('all');
    const [showSuggestions, setShowSuggestions] = React.useState(false);

    const [newGoal, setNewGoal] = React.useState({
        title: '',
        description: '',
        category: 'Savings',
        targetAmount: '',
        currentAmount: '',
        targetDate: '',
        priority: 'Medium'
    });

    // Generate suggested goals based on financial situation
    const suggestedGoals = React.useMemo(() => 
        generateSMARTGoals({ income, debts, existingGoals: goals }), 
        [income, debts, goals]
    );

    const goalCategories = [
        'Emergency',
        'Debt',
        'Savings',
        'Investment',
        'Retirement',
        'Education',
        'Housing',
        'Travel',
        'Other'
    ];

    const priorityLevels = ['High', 'Medium', 'Low'];

    // Handle adding new goal
    const handleAddGoal = () => {
        if (!newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) {
            alert('Please fill in all required fields');
            return;
        }

        const goal = {
            id: Date.now().toString(),
            title: newGoal.title,
            description: newGoal.description,
            category: newGoal.category,
            targetAmount: parseFloat(newGoal.targetAmount),
            currentAmount: parseFloat(newGoal.currentAmount) || 0,
            targetDate: new Date(newGoal.targetDate),
            priority: newGoal.priority,
            createdAt: new Date().toISOString(),
            isSpecific: true,
            isMeasurable: true,
            isAchievable: true,
            isRelevant: true,
            isTimeBound: true
        };

        setGoals([...goals, goal]);
        setNewGoal({
            title: '',
            description: '',
            category: 'Savings',
            targetAmount: '',
            currentAmount: '',
            targetDate: '',
            priority: 'Medium'
        });
        setIsAddingGoal(false);
    };

    // Handle editing goal
    const handleEditGoal = (goal) => {
        setEditingGoal({
            ...goal,
            targetDate: goal.targetDate instanceof Date ? 
                goal.targetDate.toISOString().split('T')[0] : 
                new Date(goal.targetDate).toISOString().split('T')[0]
        });
    };

    const handleUpdateGoal = () => {
        if (!editingGoal.title || !editingGoal.targetAmount || !editingGoal.targetDate) {
            alert('Please fill in all required fields');
            return;
        }

        setGoals(goals.map(goal => 
            goal.id === editingGoal.id ? {
                ...editingGoal,
                targetAmount: parseFloat(editingGoal.targetAmount),
                currentAmount: parseFloat(editingGoal.currentAmount) || 0,
                targetDate: new Date(editingGoal.targetDate)
            } : goal
        ));
        setEditingGoal(null);
    };

    // Handle deleting goal
    const handleDeleteGoal = (goalId) => {
        if (confirm('Are you sure you want to delete this goal?')) {
            setGoals(goals.filter(goal => goal.id !== goalId));
        }
    };

    // Handle updating goal progress
    const handleUpdateProgress = (goalId, newAmount) => {
        const amount = parseFloat(newAmount);
        if (isNaN(amount) || amount < 0) {
            alert('Please enter a valid amount');
            return;
        }

        setGoals(goals.map(goal => 
            goal.id === goalId ? { ...goal, currentAmount: amount } : goal
        ));
    };

    // Add suggested goal
    const handleAddSuggestedGoal = (suggestedGoal) => {
        const goal = {
            ...suggestedGoal,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        setGoals([...goals, goal]);
    };

    // Filter goals
    const filteredGoals = React.useMemo(() => {
        if (filter === 'all') return goals;
        return goals.filter(goal => goal.category === filter);
    }, [goals, filter]);

    // Calculate goal statistics
    const goalStats = React.useMemo(() => {
        const total = goals.length;
        const completed = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
        const inProgress = goals.filter(goal => goal.currentAmount > 0 && goal.currentAmount < goal.targetAmount).length;
        const notStarted = total - completed - inProgress;
        const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
        const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
        const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

        return { total, completed, inProgress, notStarted, totalTarget, totalCurrent, overallProgress };
    }, [goals]);

    const GoalForm = ({ goal, onSave, onCancel, isEditing = false }) => (
        React.createElement('div', { className: 'bg-gray-50 p-6 rounded-lg' },
            React.createElement('h4', { className: 'text-lg font-medium mb-4' }, 
                isEditing ? 'Edit Goal' : 'Add New Goal'
            ),
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                React.createElement('div', { className: 'md:col-span-2' },
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Goal Title *'),
                    React.createElement('input', {
                        type: 'text',
                        className: 'form-input',
                        placeholder: 'e.g., Emergency Fund',
                        value: goal.title,
                        onChange: (e) => isEditing ? 
                            setEditingGoal({ ...goal, title: e.target.value }) :
                            setNewGoal({ ...goal, title: e.target.value })
                    })
                ),
                React.createElement('div', { className: 'md:col-span-2' },
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Description'),
                    React.createElement('textarea', {
                        className: 'form-input',
                        rows: 3,
                        placeholder: 'Describe your goal...',
                        value: goal.description,
                        onChange: (e) => isEditing ? 
                            setEditingGoal({ ...goal, description: e.target.value }) :
                            setNewGoal({ ...goal, description: e.target.value })
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Category'),
                    React.createElement('select', {
                        className: 'form-input',
                        value: goal.category,
                        onChange: (e) => isEditing ? 
                            setEditingGoal({ ...goal, category: e.target.value }) :
                            setNewGoal({ ...goal, category: e.target.value })
                    },
                    goalCategories.map(category =>
                        React.createElement('option', { key: category, value: category }, category)
                    )
                    )
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Priority'),
                    React.createElement('select', {
                        className: 'form-input',
                        value: goal.priority,
                        onChange: (e) => isEditing ? 
                            setEditingGoal({ ...goal, priority: e.target.value }) :
                            setNewGoal({ ...goal, priority: e.target.value })
                    },
                    priorityLevels.map(priority =>
                        React.createElement('option', { key: priority, value: priority }, priority)
                    )
                    )
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Target Amount *'),
                    React.createElement('input', {
                        type: 'number',
                        className: 'form-input',
                        placeholder: '0.00',
                        step: '0.01',
                        value: goal.targetAmount,
                        onChange: (e) => isEditing ? 
                            setEditingGoal({ ...goal, targetAmount: e.target.value }) :
                            setNewGoal({ ...goal, targetAmount: e.target.value })
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Current Amount'),
                    React.createElement('input', {
                        type: 'number',
                        className: 'form-input',
                        placeholder: '0.00',
                        step: '0.01',
                        value: goal.currentAmount,
                        onChange: (e) => isEditing ? 
                            setEditingGoal({ ...goal, currentAmount: e.target.value }) :
                            setNewGoal({ ...goal, currentAmount: e.target.value })
                    })
                ),
                React.createElement('div', { className: 'md:col-span-2' },
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Target Date *'),
                    React.createElement('input', {
                        type: 'date',
                        className: 'form-input',
                        value: goal.targetDate,
                        onChange: (e) => isEditing ? 
                            setEditingGoal({ ...goal, targetDate: e.target.value }) :
                            setNewGoal({ ...goal, targetDate: e.target.value })
                    })
                )
            ),
            React.createElement('div', { className: 'flex justify-end space-x-3 mt-6' },
                React.createElement('button', {
                    className: 'btn-secondary',
                    onClick: onCancel
                }, 'Cancel'),
                React.createElement('button', {
                    className: 'btn-primary',
                    onClick: onSave
                }, isEditing ? 'Update Goal' : 'Add Goal')
            )
        )
    );

    const ProgressModal = ({ goal, onClose, onUpdate }) => {
        const [progressAmount, setProgressAmount] = React.useState(goal.currentAmount.toString());
        
        return React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
            React.createElement('div', { className: 'bg-white rounded-lg p-6 w-full max-w-md' },
                React.createElement('h3', { className: 'text-lg font-semibold mb-4' }, `Update Progress: ${goal.title}`),
                React.createElement('div', { className: 'space-y-4' },
                    React.createElement('div', null,
                        React.createElement('p', { className: 'text-sm text-gray-600 mb-2' }, 
                            `Target: ${formatCurrency(goal.targetAmount)}`
                        ),
                        React.createElement('p', { className: 'text-sm text-gray-600 mb-4' }, 
                            `Current Progress: ${Math.round((goal.currentAmount / goal.targetAmount) * 100)}%`
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Current Amount'),
                        React.createElement('input', {
                            type: 'number',
                            className: 'form-input',
                            step: '0.01',
                            value: progressAmount,
                            onChange: (e) => setProgressAmount(e.target.value)
                        })
                    )
                ),
                React.createElement('div', { className: 'flex justify-end space-x-3 mt-6' },
                    React.createElement('button', {
                        className: 'btn-secondary',
                        onClick: onClose
                    }, 'Cancel'),
                    React.createElement('button', {
                        className: 'btn-primary',
                        onClick: () => {
                            onUpdate(goal.id, progressAmount);
                            onClose();
                        }
                    }, 'Update Progress')
                )
            )
        );
    };

    const [progressModal, setProgressModal] = React.useState(null);

    return React.createElement('div', { className: 'space-y-6 fade-in' },
        // Header
        React.createElement('div', { className: 'flex justify-between items-center' },
            React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'SMART Goals'),
            React.createElement('div', { className: 'space-x-3' },
                React.createElement('button', {
                    className: 'btn-secondary',
                    onClick: () => setShowSuggestions(!showSuggestions)
                }, showSuggestions ? 'Hide Suggestions' : 'Get Suggestions'),
                React.createElement('button', {
                    className: 'btn-primary',
                    onClick: () => setIsAddingGoal(true)
                }, '+ Add Goal')
            )
        ),

        // Goal Statistics
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-6' },
            React.createElement('div', { className: 'metric-card card-hover bg-blue-50 border-blue-200' },
                React.createElement('h4', { className: 'text-sm font-medium text-blue-600 mb-2' }, 'Total Goals'),
                React.createElement('p', { className: 'text-2xl font-bold text-blue-900' }, goalStats.total)
            ),
            React.createElement('div', { className: 'metric-card card-hover bg-green-50 border-green-200' },
                React.createElement('h4', { className: 'text-sm font-medium text-green-600 mb-2' }, 'Completed'),
                React.createElement('p', { className: 'text-2xl font-bold text-green-900' }, goalStats.completed)
            ),
            React.createElement('div', { className: 'metric-card card-hover bg-yellow-50 border-yellow-200' },
                React.createElement('h4', { className: 'text-sm font-medium text-yellow-600 mb-2' }, 'In Progress'),
                React.createElement('p', { className: 'text-2xl font-bold text-yellow-900' }, goalStats.inProgress)
            ),
            React.createElement('div', { className: 'metric-card card-hover bg-purple-50 border-purple-200' },
                React.createElement('h4', { className: 'text-sm font-medium text-purple-600 mb-2' }, 'Overall Progress'),
                React.createElement('p', { className: 'text-2xl font-bold text-purple-900' }, `${Math.round(goalStats.overallProgress)}%`)
            )
        ),

        // Suggested Goals
        showSuggestions && suggestedGoals.length > 0 && React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Suggested Goals')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                    suggestedGoals.slice(0, 4).map((suggestion, index) => (
                        React.createElement('div', { key: index, className: 'p-4 border rounded-lg bg-gray-50' },
                            React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                                React.createElement('h4', { className: 'font-semibold text-gray-900' }, suggestion.title),
                                React.createElement('span', { 
                                    className: `px-2 py-1 text-xs rounded-full ${
                                        suggestion.priority === 'High' ? 'bg-red-100 text-red-800' :
                                        suggestion.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                    }`
                                }, suggestion.priority)
                            ),
                            React.createElement('p', { className: 'text-sm text-gray-600 mb-3' }, suggestion.description),
                            React.createElement('div', { className: 'flex justify-between items-center' },
                                React.createElement('span', { className: 'text-sm font-medium' }, 
                                    formatCurrency(suggestion.targetAmount)
                                ),
                                React.createElement('button', {
                                    className: 'btn-primary text-sm',
                                    onClick: () => handleAddSuggestedGoal(suggestion)
                                }, 'Add Goal')
                            )
                        )
                    ))
                )
            )
        ),

        // Add/Edit Goal Form
        isAddingGoal && React.createElement(GoalForm, {
            goal: newGoal,
            onSave: handleAddGoal,
            onCancel: () => setIsAddingGoal(false)
        }),

        editingGoal && React.createElement(GoalForm, {
            goal: editingGoal,
            onSave: handleUpdateGoal,
            onCancel: () => setEditingGoal(null),
            isEditing: true
        }),

        // Filter
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'flex items-center space-x-4' },
                    React.createElement('label', { className: 'text-sm font-medium' }, 'Filter by Category:'),
                    React.createElement('select', {
                        className: 'form-input w-auto',
                        value: filter,
                        onChange: (e) => setFilter(e.target.value)
                    },
                    React.createElement('option', { value: 'all' }, 'All Categories'),
                    goalCategories.map(category =>
                        React.createElement('option', { key: category, value: category }, category)
                    )
                    )
                )
            )
        ),

        // Goals List
        React.createElement('div', { className: 'space-y-4' },
            filteredGoals.length === 0 ? (
                React.createElement('div', { className: 'card' },
                    React.createElement('div', { className: 'card-body text-center py-12' },
                        React.createElement('svg', { className: 'w-12 h-12 text-gray-400 mx-auto mb-4', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { fillRule: 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' })
                        ),
                        React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' }, 'No goals found'),
                        React.createElement('p', { className: 'text-gray-500 mb-6' }, 
                            filter === 'all' ? 
                                'Create your first SMART goal to start tracking your financial progress.' :
                                `No goals found for the selected category: ${filter}`
                        ),
                        React.createElement('button', {
                            className: 'btn-primary',
                            onClick: () => setIsAddingGoal(true)
                        }, 'Create Your First Goal')
                    )
                )
            ) : (
                filteredGoals.map(goal => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    const isCompleted = goal.currentAmount >= goal.targetAmount;
                    const daysUntilTarget = DateUtils.monthsBetween(new Date(), goal.targetDate) * 30;
                    const isOverdue = new Date() > new Date(goal.targetDate) && !isCompleted;
                    
                    return React.createElement('div', { 
                        key: goal.id, 
                        className: `card card-hover ${isCompleted ? 'border-green-300 bg-green-50' : isOverdue ? 'border-red-300 bg-red-50' : ''}`
                    },
                        React.createElement('div', { className: 'card-body' },
                            React.createElement('div', { className: 'flex justify-between items-start mb-4' },
                                React.createElement('div', null,
                                    React.createElement('div', { className: 'flex items-center space-x-2 mb-1' },
                                        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, goal.title),
                                        React.createElement('span', { 
                                            className: `px-2 py-1 text-xs rounded-full ${
                                                goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                                                goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`
                                        }, goal.priority),
                                        React.createElement('span', { className: 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800' }, 
                                            goal.category
                                        ),
                                        isCompleted && React.createElement('span', { className: 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800' }, 
                                            '✓ Completed'
                                        ),
                                        isOverdue && React.createElement('span', { className: 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800' }, 
                                            'Overdue'
                                        )
                                    ),
                                    goal.description && React.createElement('p', { className: 'text-sm text-gray-600' }, goal.description)
                                ),
                                React.createElement('div', { className: 'flex space-x-2' },
                                    React.createElement('button', {
                                        className: 'btn-success text-sm',
                                        onClick: () => setProgressModal(goal)
                                    }, 'Update'),
                                    React.createElement('button', {
                                        className: 'btn-secondary text-sm',
                                        onClick: () => handleEditGoal(goal)
                                    }, 'Edit'),
                                    React.createElement('button', {
                                        className: 'btn-danger text-sm',
                                        onClick: () => handleDeleteGoal(goal.id)
                                    }, 'Delete')
                                )
                            ),
                            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4' },
                                React.createElement('div', null,
                                    React.createElement('p', { className: 'text-sm font-medium text-gray-700' }, 'Progress'),
                                    React.createElement('p', { className: 'text-lg font-bold text-blue-600' }, 
                                        `${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.targetAmount)}`
                                    )
                                ),
                                React.createElement('div', null,
                                    React.createElement('p', { className: 'text-sm font-medium text-gray-700' }, 'Target Date'),
                                    React.createElement('p', { className: 'text-lg font-bold text-gray-900' }, 
                                        DateUtils.formatDate(goal.targetDate)
                                    )
                                ),
                                React.createElement('div', null,
                                    React.createElement('p', { className: 'text-sm font-medium text-gray-700' }, 'Time Remaining'),
                                    React.createElement('p', { 
                                        className: `text-lg font-bold ${isOverdue ? 'text-red-600' : 'text-green-600'}`
                                    }, 
                                    daysUntilTarget > 0 ? `${Math.ceil(daysUntilTarget)} days` : 
                                    isCompleted ? 'Completed!' : 'Overdue'
                                    )
                                )
                            ),
                            React.createElement('div', null,
                                React.createElement('div', { className: 'flex justify-between text-sm text-gray-600 mb-1' },
                                    React.createElement('span', null, 'Progress'),
                                    React.createElement('span', null, `${Math.round(progress)}%`)
                                ),
                                React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-3' },
                                    React.createElement('div', { 
                                        className: `h-3 rounded-full progress-bar ${
                                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                        }`,
                                        style: { width: `${Math.min(progress, 100)}%` }
                                    })
                                )
                            )
                        )
                    );
                })
            )
        ),

        // Progress Modal
        progressModal && React.createElement(ProgressModal, {
            goal: progressModal,
            onClose: () => setProgressModal(null),
            onUpdate: handleUpdateProgress
        })
    );
}
