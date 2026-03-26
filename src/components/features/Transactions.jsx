import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Card, Button, Input, Select, Badge, cn } from '../ui';
import { suggestSavingAmount } from '../../utils/financeCalculations';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle, TrendingDown, TrendingUp, PiggyBank, Trash2 } from 'lucide-react';

const TYPE_LABELS = {
  income: 'Ingreso',
  expense: 'Gasto',
  saving: 'Ahorro'
};

const Transactions = () => {
  const { transactions, categories, addTransaction, deleteTransaction } = useFinance();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    concept: '',
    amount: '',
    categoryId: ''
  });
  const [savingsPrompt, setSavingsPrompt] = useState(null);

  const handleCategoryChange = (catId) => {
    setFormData(prev => ({ ...prev, categoryId: catId }));
  };

  const currentCategory = categories.find(c => c.id === formData.categoryId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount || !formData.date || !formData.concept) return;

    const amountNum = parseFloat(formData.amount);
    
    addTransaction({
      date: formData.date,
      concept: formData.concept,
      amount: amountNum,
      categoryId: formData.categoryId,
      type: currentCategory?.type || 'expense'
    });

    // Savings First Logic: Suggest saving 20% of income
    if (currentCategory?.type === 'income') {
      const suggestedAmount = suggestSavingAmount(amountNum);
      setSavingsPrompt({ incomeAmount: amountNum, suggestedAmount });
    } else {
      setSavingsPrompt(null);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      concept: '',
      amount: '',
      categoryId: ''
    });
  };

  const handleCreateSaving = () => {
    const savingCategory = categories.find(c => c.type === 'saving');
    if (savingCategory && savingsPrompt) {
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        concept: 'Ahorro sugerido',
        amount: savingsPrompt.suggestedAmount,
        categoryId: savingCategory.id,
        type: 'saving'
      });
    } else if (!savingCategory) {
      alert("Por favor, crea primero una categoría de tipo 'Ahorro'.");
    }
    setSavingsPrompt(null);
  };

  const groupedTx = [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Movimientos</h1>
        <p className="text-slate-500 mt-1">Registra tus ingresos, gastos y ahorros diarios</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Nuevo Registro</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                type="date"
                label="Fecha" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
              <Input 
                label="Concepto" 
                placeholder="Ej: Compra de supermercado"
                value={formData.concept}
                onChange={(e) => setFormData({...formData, concept: e.target.value})}
                required
              />
              <Input 
                type="number"
                step="0.01"
                min="0.01"
                label="Monto ($)" 
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
              <Select 
                label="Categoría"
                value={formData.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
              >
                <option value="">Selecciona una categoría...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({TYPE_LABELS[c.type]})</option>
                ))}
              </Select>

              <Button type="submit" className="w-full bg-indigo-600">
                Registrar Movimiento
              </Button>
            </form>
          </Card>

          {savingsPrompt && (
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 border-2 border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start space-x-3 text-indigo-900">
                <AlertCircle className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-indigo-800 text-lg">Modo "Ahorro Primero"</h3>
                  <p className="text-sm mt-1 mb-3 text-indigo-700/80 leading-relaxed">
                    Has registrado un ingreso de <strong className="font-bold">${savingsPrompt.incomeAmount}</strong>. Antes de pensar en gastos, te sugerimos ahorrar el 20% para asegurar tu futuro.
                  </p>
                  <div className="bg-white/60 rounded-lg p-3 mb-4 border border-indigo-50 text-center">
                    <span className="text-sm text-indigo-600 font-medium block mb-1">Monto sugerido</span>
                    <span className="font-bold text-2xl text-indigo-700">${savingsPrompt.suggestedAmount}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateSaving} className="bg-indigo-600 flex-1 text-sm py-2 shadow-sm hover:shadow">
                      Ahorrar Ahora
                    </Button>
                    <Button onClick={() => setSavingsPrompt(null)} variant="ghost" className="text-indigo-600 hover:bg-indigo-100/50 text-sm py-2">
                      Omitir
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Card className="lg:col-span-2 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Últimos Movimientos</h2>
          {groupedTx.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <PiggyBank className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>No hay movimientos registrados.</p>
              <p className="text-sm mt-1">Registra tu primer ingreso y empieza a ahorrar.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {groupedTx.map((tx) => {
                const cat = categories.find(c => c.id === tx.categoryId);
                return (
                  <div key={tx.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/50 px-2 rounded-lg transition-colors -mx-2">
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0">
                        {tx.type === 'income' ? <TrendingUp className="text-emerald-500 w-5 h-5" /> : tx.type === 'expense' ? <TrendingDown className="text-rose-500 w-5 h-5" /> : <PiggyBank className="text-indigo-500 w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-slate-900 truncate">{tx.concept}</h3>
                        <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm text-slate-500 mt-0.5">
                          <span>{format(new Date(tx.date + 'T12:00:00'), "d 'de' MMM, yy", { locale: es })}</span>
                          <span className="text-slate-300 hidden sm:inline">•</span>
                          <span className="flex items-center font-medium" style={{ color: cat?.color || '#94a3b8' }}>
                            <span className="w-2 h-2 rounded-full mr-1.5 shrink-0" style={{ backgroundColor: cat?.color || '#94a3b8' }}></span>
                            <span className="truncate max-w-[120px] sm:max-w-none">{cat?.name || 'Categoría eliminada'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto pl-14 sm:pl-0">
                      <span className={cn(
                        "font-semibold text-left sm:text-right sm:w-24",
                        tx.type === 'income' ? 'text-emerald-600' : tx.type === 'expense' ? 'text-slate-900' : 'text-indigo-600'
                      )}>
                        {tx.type === 'expense' ? '-' : '+'}${parseFloat(tx.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                      <button 
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 ml-4"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Transactions;
