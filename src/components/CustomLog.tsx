import React, { useState } from 'react';
import { BillEntry } from '../types';
import { formatCurrency } from '../utils';
import { Trash2, Edit2, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  logId: string;
  title: string;
  entries: BillEntry[];
  onAddEntry: (logId: string, entry: BillEntry) => void;
  onDeleteEntry: (logId: string, entryId: string) => void;
  onUpdateTitle: (logId: string, newTitle: string) => void;
  onDeleteLog: (logId: string) => void;
  index: number;
}

export function CustomLog({ logId, title, entries, onAddEntry, onDeleteEntry, onUpdateTitle, onDeleteLog, index }: Props) {
  const [billName, setBillName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    onAddEntry(logId, {
      id: crypto.randomUUID(),
      billName: billName || 'Unnamed Expense',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      amount: parseFloat(amount) || 0,
      amountPaid: parseFloat(amountPaid) || 0,
    });

    setBillName('');
    setDueDate('');
    setAmount('');
    setAmountPaid('');
  };

  const handleSaveTitle = () => {
    onUpdateTitle(logId, editTitle || 'Custom Log');
    setIsEditingTitle(false);
  };

  const currentAmount = parseFloat(amount) || 0;
  const currentAmountPaid = parseFloat(amountPaid) || 0;
  const currentRemaining = currentAmount - currentAmountPaid;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex flex-col overflow-hidden h-full relative group/log shadow-2xl"
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover/log:opacity-100 transition-opacity z-10 flex gap-2">
        <button
          onClick={() => onDeleteLog(logId)}
          className="p-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-xl transition-colors border border-red-500/30 backdrop-blur-md"
          title="Delete entire log"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2 flex-1 max-w-[80%]">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-300">{index + 3}.</span>
          {isEditingTitle ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-white/10 border border-white/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/50 w-full uppercase tracking-[0.1em] backdrop-blur-md shadow-inner"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              />
              <button onClick={handleSaveTitle} className="text-emerald-400 hover:text-emerald-300 bg-emerald-400/10 p-1.5 rounded-lg border border-emerald-400/20">
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group/title cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200">{title}</h3>
              <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover/title:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
        <span className="text-[10px] bg-slate-500/20 text-slate-300 px-2 py-0.5 rounded-full border border-slate-500/30 mr-10">Customizable</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-white/5 text-slate-300 border-b border-white/10">
            <tr>
              <th className="p-4 font-medium">Expense Name</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium text-right">Amount</th>
              <th className="p-4 font-medium text-right">Amount Paid</th>
              <th className="p-4 font-medium text-right">Remaining Bal</th>
              <th className="p-4 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-mono text-[11px]">
            {entries.map((entry) => {
              const remaining = entry.amount - entry.amountPaid;
              return (
              <tr key={entry.id} className="hover:bg-white/10 transition-colors group">
                <td className="p-4 text-slate-200">{entry.billName}</td>
                <td className="p-4 text-slate-300">{entry.dueDate}</td>
                <td className="p-4 text-right">{formatCurrency(entry.amount)}</td>
                <td className="p-4 text-right text-white font-semibold drop-shadow-sm">{formatCurrency(entry.amountPaid)}</td>
                <td className="p-4 text-right text-slate-300 font-semibold">{formatCurrency(remaining)}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => onDeleteEntry(logId, entry.id)}
                    className="text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )})}
            {/* Add New Entry Row */}
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 align-top">
                <input
                  type="text"
                  placeholder="e.g. Internet, Groceries"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  required
                />
              </td>
              <td className="p-3 align-top">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  required
                />
              </td>
              <td className="p-3 align-top">
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white text-right focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  step="0.01"
                  required
                />
              </td>
              <td className="p-3 align-top">
                <input
                  type="number"
                  placeholder="Total Paid"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white text-right focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  step="0.01"
                  required
                />
              </td>
              <td className="p-3 align-top text-right">
                <div className="flex gap-2 justify-end">
                  <div className="w-full p-2.5 text-slate-300 font-semibold text-xs border border-transparent text-right drop-shadow-sm">
                    {formatCurrency(currentRemaining)}
                  </div>
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-medium transition-all whitespace-nowrap shadow-md backdrop-blur-md border border-white/30"
                  >
                    Add
                  </button>
                </div>
              </td>
              <td className="p-3"></td>
            </tr>
            <tr className="bg-white/10 font-semibold text-white drop-shadow-sm">
              <td className="p-4 text-right" colSpan={2}>Totals:</td>
              <td className="p-4 text-right">{formatCurrency(entries.reduce((sum, e) => sum + e.amount, 0))}</td>
              <td className="p-4 text-right">{formatCurrency(entries.reduce((sum, e) => sum + e.amountPaid, 0))}</td>
              <td className="p-4 text-right">{formatCurrency(entries.reduce((sum, e) => sum + (e.amount - e.amountPaid), 0))}</td>
              <td className="p-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
