/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Card = ({ className, children, noPadding = false }) => (
  <div className={cn("bg-white rounded-2xl shadow-sm border border-slate-100", noPadding ? "" : "p-6", className)}>
    {children}
  </div>
);

export const Button = ({ className, variant = 'primary', ...props }) => {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500",
  };
  return <button className={cn(base, variants[variant], className)} {...props} />;
};

export const Input = ({ className, label, error, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <input 
      className={cn("w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow", className, error && "border-rose-500 focus:ring-rose-500")}
      {...props} 
    />
    {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
  </div>
);

export const Select = ({ className, label, error, children, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <select 
      className={cn("w-full rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow", className, error && "border-rose-500 focus:ring-rose-500")}
      {...props} 
    >
      {children}
    </select>
    {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
  </div>
);

export const Badge = ({ className, color = '#64748b', children }) => (
  <span 
    className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", className)}
    style={{ backgroundColor: `${color}20`, color: color }}
  >
    {children}
  </span>
);
