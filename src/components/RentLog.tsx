import React, { useState } from 'react';
import { RentEntry } from '../types';
import { formatCurrency } from '../utils';
import { Calendar, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  entries: RentEntry[];
  onAddEntry: (entry: RentEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export function RentLog({ entries, onAddEntry, onDeleteEntry }: Props) {
  const [datePaid, setDatePaid] = useState('');
  const [periodCovered, setPeriodCovered] = useState('');
  const [rentAmount, setRentAmount] = useState('4000');
  const [totalPaid, setTotalPaid] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    onAddEntry({
      id: crypto.randomUUID(),
      datePaid: datePaid || new Date().toISOString().split('T')[0],
      periodCovered: periodCovered || 'Not specified',
      rentAmount: parseFloat(rentAmount) || 0,
      totalPaid: parseFloat(totalPaid) || 0,
    });

    setDatePaid('');
    setPeriodCovered('');
    setRentAmount('4000');
    setTotalPaid('');
  };

  const currentRentAmount = parseFloat(rentAmount) || 0;
  const currentTotalPaid = parseFloat(totalPaid) || 0;
  const currentRemaining = currentRentAmount - currentTotalPaid;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex flex-col overflow-hidden shadow-2xl"
    >
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200">1. Rent Payment Log</h3>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Up to Date</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-white/5 text-slate-300 border-b border-white/10">
            <tr>
              <th className="p-4 font-medium min-w-[140px]">Date Paid</th>
              <th className="p-4 font-medium min-w-[140px]">Period Covered</th>
              <th className="p-4 font-medium text-right min-w-[120px]">Rent Amount</th>
              <th className="p-4 font-medium text-right min-w-[120px]">Total Paid</th>
              <th className="p-4 font-medium text-right min-w-[150px]">Remaining Bal</th>
              <th className="p-4 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-mono text-[11px]">
            {entries.map((entry) => {
              const remaining = entry.rentAmount - entry.totalPaid;
              return (
              <tr key={entry.id} className="hover:bg-white/10 transition-colors group">
                <td className="p-4 text-slate-300">{entry.datePaid}</td>
                <td className="p-4 text-slate-200">{entry.periodCovered}</td>
                <td className="p-4 text-right">{formatCurrency(entry.rentAmount)}</td>
                <td className="p-4 text-right text-white font-semibold drop-shadow-sm">{formatCurrency(entry.totalPaid)}</td>
                <td className="p-4 text-right text-slate-300 font-semibold">{formatCurrency(remaining)}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => onDeleteEntry(entry.id)}
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
                  type="date"
                  value={datePaid}
                  onChange={(e) => setDatePaid(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  required
                />
              </td>
              <td className="p-3 align-top">
                <input
                  type="month"
                  value={periodCovered}
                  onChange={(e) => setPeriodCovered(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  required
                />
              </td>
              <td className="p-3 align-top">
                <input
                  type="number"
                  placeholder="Amount"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white text-right focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  step="0.01"
                  required
                />
              </td>
              <td className="p-3 align-top">
                <input
                  type="number"
                  placeholder="Total Paid"
                  value={totalPaid}
                  onChange={(e) => setTotalPaid(e.target.value)}
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
              <td className="p-4 text-right">{formatCurrency(entries.reduce((sum, e) => sum + e.rentAmount, 0))}</td>
              <td className="p-4 text-right">{formatCurrency(entries.reduce((sum, e) => sum + e.totalPaid, 0))}</td>
              <td className="p-4 text-right">{formatCurrency(entries.reduce((sum, e) => sum + (e.rentAmount - e.totalPaid), 0))}</td>
              <td className="p-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
