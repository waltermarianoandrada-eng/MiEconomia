import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Card, Button, Input, Select, Badge } from '../ui';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const TYPE_LABELS = {
  income: 'Ingreso',
  expense: 'Gasto',
  saving: 'Ahorro'
};

const Categories = () => {
  const { categories, addCategory, deleteCategory, updateCategory } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', type: 'expense', color: '#3B82F6' });

  const handleEdit = (category) => {
    setFormData(category);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ id: '', name: '', type: 'expense', color: '#3B82F6' });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (isEditing) {
      updateCategory(formData.id, { name: formData.name, type: formData.type, color: formData.color });
    } else {
      addCategory({ name: formData.name, type: formData.type, color: formData.color });
    }
    handleCancel();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar categoría? Las transacciones asociadas podrían perder su categoría visual.')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categorías</h1>
          <p className="text-slate-500 mt-1">Administra la clasificación de tus movimientos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Nombre" 
              placeholder="Ej: Entretenimiento"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <Select 
              label="Tipo"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
              <option value="saving">Ahorro</option>
            </Select>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Color Representativo</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="color" 
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="h-10 w-14 p-1 rounded border border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-500 font-mono">{formData.color}</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <Button type="submit" className="flex-1 text-sm bg-indigo-600">
                {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
              </Button>
              {isEditing && (
                <Button type="button" variant="secondary" onClick={handleCancel} className="text-sm">
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Listado</h2>
          {categories.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No hay categorías creadas.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat.id} className="py-4 flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                    <div>
                      <h3 className="font-medium text-slate-900">{cat.name}</h3>
                      <Badge color={cat.type === 'income' ? '#10B981' : cat.type === 'expense' ? '#EF4444' : '#8B5CF6'}>
                        {TYPE_LABELS[cat.type]}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(cat)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Categories;
