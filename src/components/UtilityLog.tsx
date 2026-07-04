import React, { useState } from 'react';
import { UtilityEntry } from '../types';
import { formatCurrency } from '../utils';
import { Calendar, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  entries: UtilityEntry[];
  onAddEntry: (entry: UtilityEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export function UtilityLog({ entries, onAddEntry, onDeleteEntry }: Props) {
  const [month, setMonth] = useState('');
  const [prevReading, setPrevReading] = useState('');
  const [presReading, setPresReading] = useState('');
  const [costPerKwh, setCostPerKwh] = useState('');
  const [amountPaid, setAmountPaid] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    const prev = parseFloat(prevReading) || 0;
    const pres = parseFloat(presReading) || 0;
    const cost = parseFloat(costPerKwh) || 0;
    const paid = parseFloat(amountPaid) || 0;

    const kwhUsed = Math.max(0, pres - prev);
    const totalCost = kwhUsed * cost;

    onAddEntry({
      id: crypto.randomUUID(),
      month: month || new Date().toISOString().slice(0, 7),
      previousReading: prev,
      presentReading: pres,
      kwhUsed,
      costPerKwh: cost,
      totalCost,
      amountPaid: paid,
    });

    setMonth('');
    setPrevReading('');
    setPresReading('');
    setCostPerKwh('');
    setAmountPaid('');
  };

  const parsedPrev = parseFloat(prevReading) || 0;
  const parsedPres = parseFloat(presReading) || 0;
  const parsedCost = parseFloat(costPerKwh) || 0;
  const currentKwhUsed = Math.max(0, parsedPres - parsedPrev);
  const currentTotalCost = currentKwhUsed * parsedCost;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex flex-col overflow-hidden shadow-2xl"
    >
      <div className="p-4 border-b border-white/10 bg-white/5">
        <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200">2. Utility Consumption Log</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-white/5 text-slate-300 border-b border-white/10">
            <tr>
              <th className="p-4 font-medium min-w-[140px]">Month</th>
              <th className="p-4 font-medium min-w-[160px]">Readings (Pres/Prev)</th>
              <th className="p-4 font-medium text-right min-w-[90px]">KWH Used</th>
              <th className="p-4 font-medium text-right min-w-[110px]">Cost/KWH</th>
              <th className="p-4 font-medium text-right min-w-[120px]">Total Cost</th>
              <th className="p-4 font-medium text-right min-w-[120px]">Amount Paid</th>
              <th className="p-4 font-medium text-right min-w-[150px]">Remaining Bal</th>
              <th className="p-4 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-mono text-[11px]">
            {entries.map((entry) => {
              const remaining = entry.totalCost - (entry.amountPaid || 0);
              return (
              <tr key={entry.id} className="hover:bg-white/10 transition-colors group">
                <td className="p-4 text-slate-200">{entry.month}</td>
                <td className="p-4 text-slate-300">
                  {entry.presentReading} / {entry.previousReading}
                </td>
                <td className="p-4 text-right">{entry.kwhUsed.toFixed(1)}</td>
                <td className="p-4 text-right">{formatCurrency(entry.costPerKwh)}</td>
                <td className="p-4 text-right text-white font-semibold drop-shadow-sm">{formatCurrency(entry.totalCost)}</td>
                <td className="p-4 text-right text-white font-semibold drop-shadow-sm">{formatCurrency(entry.amountPaid || 0)}</td>
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
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  required
                />
              </td>
              <td className="p-3 align-top">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Pres"
                    value={presReading}
                    onChange={(e) => setPresReading(e.target.value)}
                    className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                    step="0.1"
                    required
                  />
                  <span className="text-slate-400">/</span>
                  <input
                    type="number"
                    placeholder="Prev"
                    value={prevReading}
                    onChange={(e) => setPrevReading(e.target.value)}
                    className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                    step="0.1"
                    required
                  />
                </div>
              </td>
              <td className="p-3 align-middle text-right">
                <div className="w-full p-2.5 text-slate-300 font-semibold text-xs border border-transparent text-right drop-shadow-sm">
                  {currentKwhUsed.toFixed(1)}
                </div>
              </td>
              <td className="p-3 align-top">
                 <input
                  type="number"
                  placeholder="Cost"
                  value={costPerKwh}
                  onChange={(e) => setCostPerKwh(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white text-right focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  step="0.01"
                  required
                />
              </td>
              <td className="p-3 align-top">
                <div className="flex gap-2">
                  <div className="w-full p-2.5 text-slate-300 font-semibold text-xs border border-transparent text-right drop-shadow-sm">
                    {formatCurrency(currentTotalCost)}
                  </div>
                </div>
              </td>
              <td className="p-3 align-top">
                <input
                  type="number"
                  placeholder="Paid"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white text-right focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  step="0.01"
                />
              </td>
              <td className="p-3 align-top text-right">
                <div className="flex gap-2 justify-end">
                  <div className="w-full p-2.5 text-slate-300 font-semibold text-xs border border-transparent text-right drop-shadow-sm">
                    {formatCurrency(currentTotalCost - (parseFloat(amountPaid) || 0))}
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
              <td className="p-4 text-right" colSpan={4}>Totals:</td>
              <td className="p-4 text-right">{formatCurrency(entries.reduce((sum, e) => sum + e.totalCost, 0))}</td>
              <td className="p-4 text-right">{formatCurrency(entries.reduce((sum, e) => sum + (e.amountPaid || 0), 0))}</td>
              <td className="p-4 text-right">{formatCurrency(entries.reduce((sum, e) => sum + (e.totalCost - (e.amountPaid || 0)), 0))}</td>
              <td className="p-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
