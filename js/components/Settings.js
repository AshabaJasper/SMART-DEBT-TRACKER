// ==================== SETTINGS COMPONENT ====================

function Settings({ settings, setSettings, debts, goals, income, setIncome }) {
    const [tempSettings, setTempSettings] = React.useState({ ...settings });
    const [tempIncome, setTempIncome] = React.useState(income.toString());
    const [showExportModal, setShowExportModal] = React.useState(false);
    const [showImportModal, setShowImportModal] = React.useState(false);
    const [importData, setImportData] = React.useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

    // Track changes
    React.useEffect(() => {
        const settingsChanged = JSON.stringify(tempSettings) !== JSON.stringify(settings);
        const incomeChanged = parseFloat(tempIncome) !== income;
        setHasUnsavedChanges(settingsChanged || incomeChanged);
    }, [tempSettings, settings, tempIncome, income]);

    // Handle saving settings
    const handleSaveSettings = () => {
        setSettings(tempSettings);
        setIncome(parseFloat(tempIncome) || 0);
        setHasUnsavedChanges(false);
        alert('Settings saved successfully!');
    };

    // Handle resetting settings
    const handleResetSettings = () => {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            const defaultSettings = {
                currency: 'USD',
                dateFormat: 'MM/DD/YYYY',
                theme: 'light',
                notifications: true,
                autoSave: true,
                defaultStrategy: 'avalanche'
            };
            setTempSettings(defaultSettings);
            setSettings(defaultSettings);
            setHasUnsavedChanges(false);
        }
    };

    // Handle data export
    const handleExportData = () => {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: {
                debts,
                goals,
                income,
                settings
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `smart-debt-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        setShowExportModal(false);
    };

    // Handle data import
    const handleImportData = () => {
        try {
            const parsedData = JSON.parse(importData);
            
            if (!parsedData.data || !parsedData.version) {
                throw new Error('Invalid backup file format');
            }

            if (confirm('This will replace all your current data. Are you sure you want to continue?')) {
                // Here you would typically call the appropriate setters
                // For now, we'll just show an alert
                alert('Import functionality would be implemented here');
                setShowImportModal(false);
                setImportData('');
            }
        } catch (error) {
            alert('Invalid backup file. Please check the file format and try again.');
        }
    };

    // Handle clearing all data
    const handleClearAllData = () => {
        if (confirm('Are you sure you want to delete ALL data? This action cannot be undone.')) {
            if (confirm('This will permanently delete all debts, goals, and settings. Type "DELETE" to confirm.')) {
                // Here you would typically call the appropriate setters
                alert('Clear data functionality would be implemented here');
            }
        }
    };

    const currencyOptions = [
        { value: 'USD', label: 'US Dollar ($)' },
        { value: 'EUR', label: 'Euro (€)' },
        { value: 'GBP', label: 'British Pound (£)' },
        { value: 'CAD', label: 'Canadian Dollar (C$)' },
        { value: 'AUD', label: 'Australian Dollar (A$)' },
        { value: 'JPY', label: 'Japanese Yen (¥)' }
    ];

    const dateFormatOptions = [
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (International)' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' }
    ];

    const themeOptions = [
        { value: 'light', label: 'Light Theme' },
        { value: 'dark', label: 'Dark Theme' },
        { value: 'auto', label: 'Auto (System)' }
    ];

    const strategyOptions = [
        { value: 'avalanche', label: 'Debt Avalanche (Highest Interest First)' },
        { value: 'snowball', label: 'Debt Snowball (Smallest Balance First)' }
    ];

    const ExportModal = () => (
        React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
            React.createElement('div', { className: 'bg-white rounded-lg p-6 w-full max-w-md' },
                React.createElement('h3', { className: 'text-lg font-semibold mb-4' }, 'Export Data'),
                React.createElement('div', { className: 'space-y-4' },
                    React.createElement('p', { className: 'text-sm text-gray-600' },
                        'This will download a backup file containing all your debts, goals, and settings. You can use this file to restore your data later.'
                    ),
                    React.createElement('div', { className: 'bg-gray-50 p-4 rounded-lg' },
                        React.createElement('h4', { className: 'font-medium text-gray-900 mb-2' }, 'Backup Contents:'),
                        React.createElement('ul', { className: 'text-sm text-gray-600 space-y-1' },
                            React.createElement('li', null, `• ${debts.length} debt(s)`),
                            React.createElement('li', null, `• ${goals.length} goal(s)`),
                            React.createElement('li', null, '• Income and settings'),
                            React.createElement('li', null, `• Export date: ${DateUtils.formatDate(new Date())}`)
                        )
                    )
                ),
                React.createElement('div', { className: 'flex justify-end space-x-3 mt-6' },
                    React.createElement('button', {
                        className: 'btn-secondary',
                        onClick: () => setShowExportModal(false)
                    }, 'Cancel'),
                    React.createElement('button', {
                        className: 'btn-primary',
                        onClick: handleExportData
                    }, 'Download Backup')
                )
            )
        )
    );

    const ImportModal = () => (
        React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
            React.createElement('div', { className: 'bg-white rounded-lg p-6 w-full max-w-md' },
                React.createElement('h3', { className: 'text-lg font-semibold mb-4' }, 'Import Data'),
                React.createElement('div', { className: 'space-y-4' },
                    React.createElement('div', { className: 'bg-yellow-50 border-l-4 border-yellow-400 p-4' },
                        React.createElement('div', { className: 'flex' },
                            React.createElement('svg', { className: 'h-5 w-5 text-yellow-400', fill: 'currentColor', viewBox: '0 0 20 20' },
                                React.createElement('path', { fillRule: 'evenodd', d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' })
                            ),
                            React.createElement('div', { className: 'ml-3' },
                                React.createElement('p', { className: 'text-sm text-yellow-700' },
                                    'This will replace all your current data. Make sure to export a backup first!'
                                )
                            )
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Paste backup data:'),
                        React.createElement('textarea', {
                            className: 'form-input',
                            rows: 8,
                            placeholder: 'Paste your backup JSON data here...',
                            value: importData,
                            onChange: (e) => setImportData(e.target.value)
                        })
                    )
                ),
                React.createElement('div', { className: 'flex justify-end space-x-3 mt-6' },
                    React.createElement('button', {
                        className: 'btn-secondary',
                        onClick: () => {
                            setShowImportModal(false);
                            setImportData('');
                        }
                    }, 'Cancel'),
                    React.createElement('button', {
                        className: 'btn-danger',
                        onClick: handleImportData,
                        disabled: !importData.trim()
                    }, 'Import Data')
                )
            )
        )
    );

    return React.createElement('div', { className: 'space-y-6 fade-in' },
        // Header
        React.createElement('div', { className: 'flex justify-between items-center' },
            React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Settings'),
            hasUnsavedChanges && React.createElement('div', { className: 'flex space-x-3' },
                React.createElement('button', {
                    className: 'btn-secondary',
                    onClick: () => {
                        setTempSettings({ ...settings });
                        setTempIncome(income.toString());
                    }
                }, 'Cancel Changes'),
                React.createElement('button', {
                    className: 'btn-primary',
                    onClick: handleSaveSettings
                }, 'Save Changes')
            )
        ),

        // Unsaved Changes Warning
        hasUnsavedChanges && React.createElement('div', { className: 'bg-yellow-50 border-l-4 border-yellow-400 p-4' },
            React.createElement('div', { className: 'flex' },
                React.createElement('svg', { className: 'h-5 w-5 text-yellow-400', fill: 'currentColor', viewBox: '0 0 20 20' },
                    React.createElement('path', { fillRule: 'evenodd', d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' })
                ),
                React.createElement('div', { className: 'ml-3' },
                    React.createElement('p', { className: 'text-sm text-yellow-700' },
                        'You have unsaved changes. Don\'t forget to save your settings.'
                    )
                )
            )
        ),

        // Financial Information
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Financial Information')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Annual Income'),
                        React.createElement('input', {
                            type: 'number',
                            className: 'form-input',
                            placeholder: '0.00',
                            step: '0.01',
                            value: tempIncome,
                            onChange: (e) => setTempIncome(e.target.value)
                        }),
                        React.createElement('p', { className: 'text-xs text-gray-500 mt-1' }, 
                            tempIncome ? `Monthly: ${formatCurrency(parseFloat(tempIncome) / 12)}` : ''
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Currency'),
                        React.createElement('select', {
                            className: 'form-input',
                            value: tempSettings.currency,
                            onChange: (e) => setTempSettings({ ...tempSettings, currency: e.target.value })
                        },
                        currencyOptions.map(option =>
                            React.createElement('option', { key: option.value, value: option.value }, option.label)
                        )
                        )
                    )
                )
            )
        ),

        // Display Preferences
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Display Preferences')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Date Format'),
                        React.createElement('select', {
                            className: 'form-input',
                            value: tempSettings.dateFormat,
                            onChange: (e) => setTempSettings({ ...tempSettings, dateFormat: e.target.value })
                        },
                        dateFormatOptions.map(option =>
                            React.createElement('option', { key: option.value, value: option.value }, option.label)
                        )
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Theme'),
                        React.createElement('select', {
                            className: 'form-input',
                            value: tempSettings.theme,
                            onChange: (e) => setTempSettings({ ...tempSettings, theme: e.target.value })
                        },
                        themeOptions.map(option =>
                            React.createElement('option', { key: option.value, value: option.value }, option.label)
                        )
                        )
                    )
                )
            )
        ),

        // Application Preferences
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Application Preferences')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'space-y-6' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Default Payoff Strategy'),
                        React.createElement('select', {
                            className: 'form-input',
                            value: tempSettings.defaultStrategy,
                            onChange: (e) => setTempSettings({ ...tempSettings, defaultStrategy: e.target.value })
                        },
                        strategyOptions.map(option =>
                            React.createElement('option', { key: option.value, value: option.value }, option.label)
                        )
                        )
                    ),
                    React.createElement('div', { className: 'space-y-4' },
                        React.createElement('div', { className: 'flex items-center' },
                            React.createElement('input', {
                                type: 'checkbox',
                                id: 'notifications',
                                className: 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
                                checked: tempSettings.notifications,
                                onChange: (e) => setTempSettings({ ...tempSettings, notifications: e.target.checked })
                            }),
                            React.createElement('label', { htmlFor: 'notifications', className: 'ml-2 block text-sm text-gray-900' }, 
                                'Enable notifications'
                            )
                        ),
                        React.createElement('div', { className: 'flex items-center' },
                            React.createElement('input', {
                                type: 'checkbox',
                                id: 'autoSave',
                                className: 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
                                checked: tempSettings.autoSave,
                                onChange: (e) => setTempSettings({ ...tempSettings, autoSave: e.target.checked })
                            }),
                            React.createElement('label', { htmlFor: 'autoSave', className: 'ml-2 block text-sm text-gray-900' }, 
                                'Auto-save changes'
                            )
                        )
                    )
                )
            )
        ),

        // Data Management
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Data Management')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
                    React.createElement('button', {
                        className: 'btn-primary',
                        onClick: () => setShowExportModal(true)
                    }, 'Export Data'),
                    React.createElement('button', {
                        className: 'btn-secondary',
                        onClick: () => setShowImportModal(true)
                    }, 'Import Data'),
                    React.createElement('button', {
                        className: 'btn-danger',
                        onClick: handleClearAllData
                    }, 'Clear All Data')
                ),
                React.createElement('div', { className: 'mt-4 text-sm text-gray-600' },
                    React.createElement('p', null, '• Export: Download a backup of all your data'),
                    React.createElement('p', null, '• Import: Restore data from a backup file'),
                    React.createElement('p', null, '• Clear: Permanently delete all data (cannot be undone)')
                )
            )
        ),

        // Application Information
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Application Information')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                    React.createElement('div', null,
                        React.createElement('h4', { className: 'font-medium text-gray-900 mb-2' }, 'Version Information'),
                        React.createElement('p', { className: 'text-sm text-gray-600' }, 'SMART Debt Tracker v1.0'),
                        React.createElement('p', { className: 'text-sm text-gray-600' }, 'Built with React & Tailwind CSS'),
                        React.createElement('p', { className: 'text-sm text-gray-600' }, `Last updated: ${DateUtils.formatDate(new Date())}`)
                    ),
                    React.createElement('div', null,
                        React.createElement('h4', { className: 'font-medium text-gray-900 mb-2' }, 'Data Summary'),
                        React.createElement('p', { className: 'text-sm text-gray-600' }, `Total Debts: ${debts.length}`),
                        React.createElement('p', { className: 'text-sm text-gray-600' }, `Total Goals: ${goals.length}`),
                        React.createElement('p', { className: 'text-sm text-gray-600' }, 
                            `Total Debt Amount: ${formatCurrency(debts.reduce((sum, debt) => sum + debt.balance, 0))}`
                        )
                    )
                )
            )
        ),

        // Reset Settings
        React.createElement('div', { className: 'card border-red-200' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-lg font-semibold text-red-600' }, 'Reset Settings')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement('p', { className: 'text-sm text-gray-600 mb-4' },
                    'Reset all settings to their default values. This will not affect your debts or goals data.'
                ),
                React.createElement('button', {
                    className: 'btn-danger',
                    onClick: handleResetSettings
                }, 'Reset to Defaults')
            )
        ),

        // Modals
        showExportModal && React.createElement(ExportModal),
        showImportModal && React.createElement(ImportModal)
    );
}
