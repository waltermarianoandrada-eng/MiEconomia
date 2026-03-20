import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Card, cn } from '../ui';
import { 
  calculateAvailableBalance, 
  calculateTotalByType, 
  isCategoryOverBudget 
} from '../../utils/financeCalculations';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, AlertTriangle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { transactions, categories } = useFinance();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter transactions for current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = parseISO(tx.date);
      return txDate >= monthStart && txDate <= monthEnd;
    });
  }, [transactions, monthStart, monthEnd]);

  const totalIncome = calculateTotalByType(monthlyTransactions, 'income');
  const totalExpense = calculateTotalByType(monthlyTransactions, 'expense');
  const totalSaving = calculateTotalByType(monthlyTransactions, 'saving');
  const availableBalance = calculateAvailableBalance(monthlyTransactions);

  // Prepare Pie Chart Data
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const chartData = useMemo(() => {
    const labels = [];
    const data = [];
    const backgroundColors = [];
    const borderColors = [];

    expenseCategories.forEach(cat => {
      const catTotal = monthlyTransactions
        .filter(t => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      if (catTotal > 0) {
        labels.push(cat.name);
        data.push(catTotal);
        
        // Budget Alert Logic: 30% of income 
        const isOverBudget = isCategoryOverBudget(monthlyTransactions, cat.id);
        
        if (isOverBudget) {
          backgroundColors.push('#EF4444'); // Red alert
          borderColors.push('#B91C1C');
        } else {
          backgroundColors.push(cat.color);
          borderColors.push(cat.color);
        }
      }
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  }, [monthlyTransactions, expenseCategories]);

  // Calendar Days
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 capitalize">{format(currentDate, "MMMM yyyy", { locale: es })}</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            Anterior
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card noPadding className="p-5 flex items-center space-x-4 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0">
          <div className="p-3 bg-white/20 rounded-xl">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-indigo-100 text-sm font-medium">Saldo Disponible</p>
            <h3 className="text-2xl font-bold">${availableBalance.toLocaleString('es-AR', {minimumFractionDigits: 2})}</h3>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4 p-5">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Ingresos</p>
            <h3 className="text-2xl font-bold text-slate-900">${totalIncome.toLocaleString('es-AR', {minimumFractionDigits: 2})}</h3>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 p-5">
          <div className="p-3 bg-rose-50 rounded-xl">
            <TrendingDown className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Gastos</p>
            <h3 className="text-2xl font-bold text-slate-900">${totalExpense.toLocaleString('es-AR', {minimumFractionDigits: 2})}</h3>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 p-5">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <PiggyBank className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Ahorros</p>
            <h3 className="text-2xl font-bold text-slate-900">${totalSaving.toLocaleString('es-AR', {minimumFractionDigits: 2})}</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart Setup */}
        <Card className="lg:col-span-1 flex flex-col items-center">
          <h2 className="text-lg font-semibold w-full mb-6">Gastos por Categoría</h2>
          {chartData.labels.length === 0 ? (
            <div className="flex-1 flex items-center text-slate-400 text-sm">
              No hay gastos registrados este mes.
            </div>
          ) : (
            <>
              <div className="w-full max-w-[240px] aspect-square">
                <Pie 
                  data={chartData} 
                  options={{
                    plugins: {
                      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15 } }
                    },
                    cutout: '40%'
                  }} 
                />
              </div>
              {chartData.datasets[0].backgroundColor.includes('#EF4444') && (
                <div className="mt-6 flex items-start space-x-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-sm w-full">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p><strong>Alerta:</strong> Algunas categorías han superado el 30% de tus ingresos este mes y se muestran en rojo.</p>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Calendario de Movimientos</h2>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
              <div key={d} className="text-xs font-medium text-slate-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots for start of month offset */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 sm:h-14 bg-transparent"></div>
            ))}
            
            {/* Days mapping */}
            {daysInMonth.map(day => {
              const dayTransactions = monthlyTransactions.filter(tx => isSameDay(parseISO(tx.date), day));
              const hasIncome = dayTransactions.some(t => t.type === 'income');
              const hasExpense = dayTransactions.some(t => t.type === 'expense');
              const hasSaving = dayTransactions.some(t => t.type === 'saving');
              
              const isToday = isSameDay(day, new Date());

              return (
                <div 
                  key={day.toISOString()} 
                  className={cn(
                    "h-10 sm:h-14 border border-slate-100 rounded-lg flex flex-col items-center justify-start py-1 relative hover:bg-slate-50 transition-colors",
                    isToday && "bg-indigo-50/50 border-indigo-200"
                  )}
                >
                  <span className={cn(
                    "text-xs sm:text-sm font-medium",
                    isToday ? "text-indigo-600" : "text-slate-600"
                  )}>
                    {format(day, 'd')}
                  </span>
                  <div className="flex space-x-1 mt-auto pb-1 relative z-10">
                    {hasIncome && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                    {hasExpense && <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>}
                    {hasSaving && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end space-x-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></span> Ingreso</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-400 mr-1"></span> Gasto</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-400 mr-1"></span> Ahorro</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
