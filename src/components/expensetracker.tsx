import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './expensetracker.css';

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface ReportData {
  totalAmount: number;
  expenseCount: number;
  categoryBreakdown: { [category: string]: number };
}

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({});
  const [editingExpense, setEditingExpense] = useState<Partial<Expense> | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/expenses')
      .then(response => {
        console.log('Fetched Expenses:', response.data);
        setExpenses(response.data);
      })
      .catch(error => console.error('Error fetching expenses:', error));
  }, []);

  const handleAddExpense = () => {
    const { description, amount, date, category } = newExpense;

    if (!description?.trim() || !amount || !date?.trim() || !category?.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    const formattedDate = new Date(date!).toISOString().split('T')[0];

    axios.post('http://localhost:5000/api/expenses', { ...newExpense, date: formattedDate })
      .then(response => {
        console.log('Added Expense:', response.data);
        setExpenses([...expenses, response.data]);
        setNewExpense({});
        setIsAdding(false);
      })
      .catch(error => console.error('Error adding expense:', error));
  };

  const handleDeleteExpense = (id: number) => {
    axios.delete(`http://localhost:5000/api/expenses/${id}`)
      .then(() => {
        console.log('Deleted Expense ID:', id);
        setExpenses(expenses.filter(exp => exp.id !== id));
      })
      .catch(error => console.error('Error deleting expense:', error));
  };

  const handleEditExpense = (id: number, updatedExpense: Partial<Expense>) => {
    axios.put(`http://localhost:5000/api/expenses/${id}`, updatedExpense)
      .then(response => {
        console.log('Updated Expense:', response.data);
        setExpenses(expenses.map(exp => exp.id === id ? response.data : exp));
        setEditingExpense(null);
      })
      .catch(error => console.error('Error updating expense:', error));
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (editingExpense && editingExpense.id) {
      const formattedDate = new Date(editingExpense.date!).toISOString().split('T')[0];
      handleEditExpense(editingExpense.id, { ...editingExpense, date: formattedDate });
    }
  };

  const generateReport = () => {
    const totalAmount = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const expenseCount = expenses.length;
    const categoryBreakdown = expenses.reduce((acc, exp) => {
      if (acc[exp.category]) {
        acc[exp.category] += exp.amount;
      } else {
        acc[exp.category] = exp.amount;
      }
      return acc;
    }, {} as { [category: string]: number });

    setReportData({
      totalAmount,
      expenseCount,
      categoryBreakdown,
    });
  };

  const filteredExpenses = expenses.filter(exp =>
    exp.description.toLowerCase().includes(search.toLowerCase()) &&
    (filter === '' || exp.category === filter)
  );

  return (
    <div className="expense-tracker">
      <h1>Personal Expense Manager</h1>
      <div className="controls">
        <div className="button-group">
          <button onClick={() => {
            setEditingExpense(null);
            setIsAdding(true);
          }}>
            Add Expense
          </button>
          <button onClick={generateReport}>
            Generate Expense Report
          </button>
        </div>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            {/* Add more categories as needed */}
          </select>
        </div>
      </div>
      {(isAdding || editingExpense !== null) && (
        <div className="edit-form">
          <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
          <input
            type="text"
            placeholder="Description"
            value={(editingExpense?.description || newExpense.description) || ''}
            onChange={e => editingExpense ? setEditingExpense({ ...editingExpense, description: e.target.value }) : setNewExpense({ ...newExpense, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            value={(editingExpense?.amount || newExpense.amount) || ''}
            onChange={e => editingExpense ? setEditingExpense({ ...editingExpense, amount: parseFloat(e.target.value) }) : setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
          />
          <input
            type="date"
            value={(editingExpense?.date || newExpense.date) || ''}
            onChange={e => editingExpense ? setEditingExpense({ ...editingExpense, date: e.target.value }) : setNewExpense({ ...newExpense, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            value={(editingExpense?.category || newExpense.category) || ''}
            onChange={e => editingExpense ? setEditingExpense({ ...editingExpense, category: e.target.value }) : setNewExpense({ ...newExpense, category: e.target.value })}
          />
          <button onClick={editingExpense ? handleSaveEdit : handleAddExpense}>
            {editingExpense ? 'Save Changes' : 'Add Expense'}
          </button>
          <button onClick={() => { setEditingExpense(null); setIsAdding(false); }}>Cancel</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Description</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map(exp => (
            <tr key={exp.id}>
              <td>{exp.id}</td>
              <td>{exp.description}</td>
              <td>{exp.date}</td>
              <td>${exp.amount}</td>
              <td>{exp.category}</td>
              <td>
                <button onClick={() => handleEditClick(exp)}>Edit</button>
                <button onClick={() => handleDeleteExpense(exp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reportData && (
        <div className="report">
          <h2>Expense Report</h2>
          <p>Total Amount Spent: ${reportData.totalAmount}</p>
          <p>Total Number of Expenses: {reportData.expenseCount}</p>
          <h3>Breakdown by Category:</h3>
          <ul>
            {Object.keys(reportData.categoryBreakdown).map(category => (
              <li key={category}>
                {category}: ${reportData.categoryBreakdown[category]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
