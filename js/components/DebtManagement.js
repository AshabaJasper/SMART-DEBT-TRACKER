// ==================== DEBT MANAGEMENT COMPONENT ====================

function DebtManagement({ debts, setDebts, settings }) {
    const [isAddingDebt, setIsAddingDebt] = React.useState(false);
    const [editingDebt, setEditingDebt] = React.useState(null);
    const [sortBy, setSortBy] = React.useState('balance');
    const [sortOrder, setSortOrder] = React.useState('desc');
    const [filter, setFilter] = React.useState('all');

    const [newDebt, setNewDebt] = React.useState({
        name: '',
        balance: '',
        rate: '',
        minimumPayment: '',
        type: 'credit_card'
    });

    // Handle adding new debt
    const handleAddDebt = () => {
        if (!newDebt.name || !newDebt.balance || !newDebt.rate || !newDebt.minimumPayment) {
            alert('Please fill in all fields');
            return;
        }

        const debt = {
            id: Date.now().toString(),
            name: newDebt.name,
            balance: parseFloat(newDebt.balance),
            rate: parseFloat(newDebt.rate),
            minimumPayment: parseFloat(newDebt.minimumPayment),
            type: newDebt.type,
            createdAt: new Date().toISOString()
        };

        setDebts([...debts, debt]);
        setNewDebt({ name: '', balance: '', rate: '', minimumPayment: '', type: 'credit_card' });
        setIsAddingDebt(false);
    };

    // Handle editing debt
    const handleEditDebt = (debt) => {
        setEditingDebt({ ...debt });
    };

    const handleUpdateDebt = () => {
        if (!editingDebt.name || !editingDebt.balance || !editingDebt.rate || !editingDebt.minimumPayment) {
            alert('Please fill in all fields');
            return;
        }

        setDebts(debts.map(debt => 
            debt.id === editingDebt.id ? {
                ...editingDebt,
                balance: parseFloat(editingDebt.balance),
                rate: parseFloat(editingDebt.rate),
                minimumPayment: parseFloat(editingDebt.minimumPayment)
            } : debt
        ));
        setEditingDebt(null);
    };

    // Handle deleting debt
    const handleDeleteDebt = (debtId) => {
        if (confirm('Are you sure you want to delete this debt?')) {
            setDebts(debts.filter(debt => debt.id !== debtId));
        }
    };

    // Handle making payment
    const handleMakePayment = (debtId, paymentAmount) => {
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid payment amount');
            return;
        }

        setDebts(debts.map(debt => {
            if (debt.id === debtId) {
                const newBalance = Math.max(0, debt.balance - amount);
                return { ...debt, balance: newBalance };
            }
            return debt;
        }));
    };

    // Filter and sort debts
    const filteredAndSortedDebts = React.useMemo(() => {
        let filtered = [...debts];

        // Apply filter
        if (filter !== 'all') {
            filtered = filtered.filter(debt => debt.type === filter);
        }

        // Apply sort
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [debts, sortBy, sortOrder, filter]);

    const debtTypes = [
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'personal_loan', label: 'Personal Loan' },
        { value: 'student_loan', label: 'Student Loan' },
        { value: 'mortgage', label: 'Mortgage' },
        { value: 'auto_loan', label: 'Auto Loan' },
        { value: 'other', label: 'Other' }
    ];

    const DebtForm = ({ debt, onSave, onCancel, isEditing = false }) => (
        React.createElement('div', { className: 'bg-gray-50 p-6 rounded-lg' },
            React.createElement('h4', { className: 'text-lg font-medium mb-4' }, 
                isEditing ? 'Edit Debt' : 'Add New Debt'
            ),
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Debt Name'),
                    React.createElement('input', {
                        type: 'text',
                        className: 'form-input',
                        placeholder: 'e.g., Chase Credit Card',
                        value: debt.name,
                        onChange: (e) => isEditing ? 
                            setEditingDebt({ ...debt, name: e.target.value }) :
                            setNewDebt({ ...debt, name: e.target.value })
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Debt Type'),
                    React.createElement('select', {
                        className: 'form-input',
                        value: debt.type,
                        onChange: (e) => isEditing ? 
                            setEditingDebt({ ...debt, type: e.target.value }) :
                            setNewDebt({ ...debt, type: e.target.value })
                    },
                    debtTypes.map(type =>
                        React.createElement('option', { key: type.value, value: type.value }, type.label)
                    )
                    )
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Current Balance'),
                    React.createElement('input', {
                        type: 'number',
                        className: 'form-input',
                        placeholder: '0.00',
                        step: '0.01',
                        value: debt.balance,
                        onChange: (e) => isEditing ? 
                            setEditingDebt({ ...debt, balance: e.target.value }) :
                            setNewDebt({ ...debt, balance: e.target.value })
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Interest Rate (%)'),
                    React.createElement('input', {
                        type: 'number',
                        className: 'form-input',
                        placeholder: '0.00',
                        step: '0.01',
                        value: debt.rate,
                        onChange: (e) => isEditing ? 
                            setEditingDebt({ ...debt, rate: e.target.value }) :
                            setNewDebt({ ...debt, rate: e.target.value })
                    })
                ),
                React.createElement('div', { className: 'md:col-span-2' },
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Minimum Monthly Payment'),
                    React.createElement('input', {
                        type: 'number',
                        className: 'form-input',
                        placeholder: '0.00',
                        step: '0.01',
                        value: debt.minimumPayment,
                        onChange: (e) => isEditing ? 
                            setEditingDebt({ ...debt, minimumPayment: e.target.value }) :
                            setNewDebt({ ...debt, minimumPayment: e.target.value })
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
                }, isEditing ? 'Update Debt' : 'Add Debt')
            )
        )
    );

    const PaymentModal = ({ debt, onClose, onPayment }) => {
        const [paymentAmount, setPaymentAmount] = React.useState('');
        
        return React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
            React.createElement('div', { className: 'bg-white rounded-lg p-6 w-full max-w-md' },
                React.createElement('h3', { className: 'text-lg font-semibold mb-4' }, `Make Payment: ${debt.name}`),
                React.createElement('div', { className: 'space-y-4' },
                    React.createElement('div', null,
                        React.createElement('p', { className: 'text-sm text-gray-600 mb-2' }, 
                            `Current Balance: ${formatCurrency(debt.balance)}`
                        ),
                        React.createElement('p', { className: 'text-sm text-gray-600 mb-4' }, 
                            `Minimum Payment: ${formatCurrency(debt.minimumPayment)}`
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Payment Amount'),
                        React.createElement('input', {
                            type: 'number',
                            className: 'form-input',
                            placeholder: debt.minimumPayment.toString(),
                            step: '0.01',
                            value: paymentAmount,
                            onChange: (e) => setPaymentAmount(e.target.value)
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
                            onPayment(debt.id, paymentAmount);
                            onClose();
                        }
                    }, 'Make Payment')
                )
            )
        );
    };

    const [paymentModal, setPaymentModal] = React.useState(null);

    return React.createElement('div', { className: 'space-y-6 fade-in' },
        // Header
        React.createElement('div', { className: 'flex justify-between items-center' },
            React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Debt Management'),
            React.createElement('button', {
                className: 'btn-primary',
                onClick: () => setIsAddingDebt(true)
            }, '+ Add Debt')
        ),

        // Summary Cards
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
            React.createElement('div', { className: 'metric-card card-hover bg-blue-50 border-blue-200' },
                React.createElement('h4', { className: 'text-sm font-medium text-blue-600 mb-2' }, 'Total Debts'),
                React.createElement('p', { className: 'text-2xl font-bold text-blue-900' }, debts.length)
            ),
            React.createElement('div', { className: 'metric-card card-hover bg-red-50 border-red-200' },
                React.createElement('h4', { className: 'text-sm font-medium text-red-600 mb-2' }, 'Total Balance'),
                React.createElement('p', { className: 'text-2xl font-bold text-red-900' }, 
                    formatCurrency(debts.reduce((sum, debt) => sum + debt.balance, 0))
                )
            ),
            React.createElement('div', { className: 'metric-card card-hover bg-green-50 border-green-200' },
                React.createElement('h4', { className: 'text-sm font-medium text-green-600 mb-2' }, 'Monthly Payments'),
                React.createElement('p', { className: 'text-2xl font-bold text-green-900' }, 
                    formatCurrency(debts.reduce((sum, debt) => sum + debt.minimumPayment, 0))
                )
            )
        ),

        // Add/Edit Debt Form
        isAddingDebt && React.createElement(DebtForm, {
            debt: newDebt,
            onSave: handleAddDebt,
            onCancel: () => setIsAddingDebt(false)
        }),

        editingDebt && React.createElement(DebtForm, {
            debt: editingDebt,
            onSave: handleUpdateDebt,
            onCancel: () => setEditingDebt(null),
            isEditing: true
        }),

        // Filters and Sorting
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'flex flex-wrap gap-4 items-center' },
                    React.createElement('div', { className: 'flex items-center space-x-2' },
                        React.createElement('label', { className: 'text-sm font-medium' }, 'Filter:'),
                        React.createElement('select', {
                            className: 'form-input w-auto',
                            value: filter,
                            onChange: (e) => setFilter(e.target.value)
                        },
                        React.createElement('option', { value: 'all' }, 'All Types'),
                        debtTypes.map(type =>
                            React.createElement('option', { key: type.value, value: type.value }, type.label)
                        )
                        )
                    ),
                    React.createElement('div', { className: 'flex items-center space-x-2' },
                        React.createElement('label', { className: 'text-sm font-medium' }, 'Sort by:'),
                        React.createElement('select', {
                            className: 'form-input w-auto',
                            value: sortBy,
                            onChange: (e) => setSortBy(e.target.value)
                        },
                        React.createElement('option', { value: 'balance' }, 'Balance'),
                        React.createElement('option', { value: 'rate' }, 'Interest Rate'),
                        React.createElement('option', { value: 'minimumPayment' }, 'Min Payment'),
                        React.createElement('option', { value: 'name' }, 'Name')
                        )
                    ),
                    React.createElement('button', {
                        className: 'btn-secondary',
                        onClick: () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    }, sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending')
                )
            )
        ),

        // Debts List
        React.createElement('div', { className: 'space-y-4' },
            filteredAndSortedDebts.length === 0 ? (
                React.createElement('div', { className: 'card' },
                    React.createElement('div', { className: 'card-body text-center py-12' },
                        React.createElement('svg', { className: 'w-12 h-12 text-gray-400 mx-auto mb-4', fill: 'currentColor', viewBox: '0 0 20 20' },
                            React.createElement('path', { fillRule: 'evenodd', d: 'M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' })
                        ),
                        React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' }, 'No debts found'),
                        React.createElement('p', { className: 'text-gray-500 mb-6' }, 
                            filter === 'all' ? 
                                'Start by adding your first debt to track and manage it.' :
                                `No debts found for the selected filter: ${debtTypes.find(t => t.value === filter)?.label}`
                        ),
                        React.createElement('button', {
                            className: 'btn-primary',
                            onClick: () => setIsAddingDebt(true)
                        }, 'Add Your First Debt')
                    )
                )
            ) : (
                filteredAndSortedDebts.map(debt => {
                    const typeLabel = debtTypes.find(type => type.value === debt.type)?.label || debt.type;
                    const payoffTime = debt.minimumPayment > 0 ? 
                        Math.ceil(debt.balance / debt.minimumPayment) : 0;
                    
                    return React.createElement('div', { key: debt.id, className: 'card card-hover' },
                        React.createElement('div', { className: 'card-body' },
                            React.createElement('div', { className: 'flex justify-between items-start mb-4' },
                                React.createElement('div', null,
                                    React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, debt.name),
                                    React.createElement('p', { className: 'text-sm text-gray-500' }, typeLabel)
                                ),
                                React.createElement('div', { className: 'flex space-x-2' },
                                    React.createElement('button', {
                                        className: 'btn-success text-sm',
                                        onClick: () => setPaymentModal(debt)
                                    }, 'Pay'),
                                    React.createElement('button', {
                                        className: 'btn-secondary text-sm',
                                        onClick: () => handleEditDebt(debt)
                                    }, 'Edit'),
                                    React.createElement('button', {
                                        className: 'btn-danger text-sm',
                                        onClick: () => handleDeleteDebt(debt.id)
                                    }, 'Delete')
                                )
                            ),
                            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-4' },
                                React.createElement('div', null,
                                    React.createElement('p', { className: 'text-sm font-medium text-gray-700' }, 'Balance'),
                                    React.createElement('p', { className: 'text-lg font-bold text-red-600' }, formatCurrency(debt.balance))
                                ),
                                React.createElement('div', null,
                                    React.createElement('p', { className: 'text-sm font-medium text-gray-700' }, 'Interest Rate'),
                                    React.createElement('p', { className: 'text-lg font-bold text-orange-600' }, `${debt.rate}%`)
                                ),
                                React.createElement('div', null,
                                    React.createElement('p', { className: 'text-sm font-medium text-gray-700' }, 'Min Payment'),
                                    React.createElement('p', { className: 'text-lg font-bold text-blue-600' }, formatCurrency(debt.minimumPayment))
                                ),
                                React.createElement('div', null,
                                    React.createElement('p', { className: 'text-sm font-medium text-gray-700' }, 'Payoff Time'),
                                    React.createElement('p', { className: 'text-lg font-bold text-green-600' }, 
                                        payoffTime > 0 ? `${payoffTime} months` : 'N/A'
                                    )
                                )
                            )
                        )
                    );
                })
            )
        ),

        // Payment Modal
        paymentModal && React.createElement(PaymentModal, {
            debt: paymentModal,
            onClose: () => setPaymentModal(null),
            onPayment: handleMakePayment
        })
    );
}
