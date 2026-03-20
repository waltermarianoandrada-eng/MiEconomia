/**
 * Pure functions for financial calculations.
 */

/**
 * Calculates the total from an array of transactions for a specific type.
 * @param {Array} transactions 
 * @param {string} type 'income', 'expense', or 'saving'
 * @returns {number}
 */
export const calculateTotalByType = (transactions, type) => {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
};

/**
 * Calculates current available balance.
 * Available = Income - Expenses - Savings
 * @param {Array} transactions 
 * @returns {number}
 */
export const calculateAvailableBalance = (transactions) => {
  const incomes = calculateTotalByType(transactions, 'income');
  const expenses = calculateTotalByType(transactions, 'expense');
  const savings = calculateTotalByType(transactions, 'saving');
  return incomes - expenses - savings;
};

/**
 * Savings First logic: Suggests a percentage (e.g., 20%) to save 
 * whenever a new income is registered.
 * @param {number} incomeAmount 
 * @param {number} percentage Default 20%
 * @returns {number}
 */
export const suggestSavingAmount = (incomeAmount, percentage = 20) => {
  return parseFloat(((incomeAmount * percentage) / 100).toFixed(2));
};

/**
 * Budget Alert Logic: 
 * Returns true if the expenses for a specific category exceed 30% of total income.
 * @param {Array} transactions 
 * @param {string} categoryId 
 * @returns {boolean}
 */
export const isCategoryOverBudget = (transactions, categoryId) => {
  const totalIncome = calculateTotalByType(transactions, 'income');
  if (totalIncome === 0) return false;

  const categoryExpenses = transactions
    .filter(t => t.type === 'expense' && t.categoryId === categoryId)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const percentage = (categoryExpenses / totalIncome) * 100;
  return percentage > 30;
};
