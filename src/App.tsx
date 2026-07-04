import React, { useState } from 'react';
import { PropertyDetails } from './types';
import { PropertyOverview } from './components/PropertyOverview';
import { RentLog } from './components/RentLog';
import { UtilityLog } from './components/UtilityLog';
import { CustomLog } from './components/CustomLog';
import { exportToCSV } from './utils';
import { Download, Plus, LogOut, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useFirestoreData } from './useFirestoreData';
import { loginWithGoogle, logout } from './firebase';

export default function App() {
  const [propertyDetails] = useState<PropertyDetails>({
    tenantName: "Joshua Magbanua",
    propertyAddress: "Yoro Boarding House",
    rentDueDate: "Jul 30, 2026",
  });

  const {
    user,
    loading,
    rentEntries,
    utilityEntries,
    customLogs,
    addRentEntry,
    deleteRentEntry,
    addUtilityEntry,
    deleteUtilityEntry,
    addCustomLog,
    deleteCustomLog,
    updateCustomLogTitle,
    addCustomEntry,
    deleteCustomEntry
  } = useFirestoreData();

  const handleExport = () => {
    exportToCSV(rentEntries, utilityEntries, customLogs);
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen relative flex items-center justify-center overflow-x-hidden text-slate-200 font-sans">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/40 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-neutral-800/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-zinc-900/50 rounded-full blur-[120px]" />
        </div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-white/10 border-t-white/80 rounded-full z-10"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-black min-h-screen relative flex items-center justify-center overflow-x-hidden text-slate-200 font-sans">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/40 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-neutral-800/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-zinc-900/50 rounded-full blur-[120px]" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center"
        >
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg border border-white/20">
            JM
          </div>
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-white drop-shadow-sm mb-2">Budget & Finance</h1>
            <p className="text-sm text-slate-300">Sign in to sync your expenses online.</p>
          </div>
          <button 
            onClick={loginWithGoogle}
            className="w-full px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 rounded-xl text-sm font-medium transition-all text-white flex items-center justify-center gap-2 shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen relative overflow-x-hidden text-slate-200 font-sans">
      {/* iOS Liquid Glass Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/40 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-neutral-800/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-zinc-900/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-4 sm:p-8 w-full max-w-[1600px] mx-auto flex flex-col h-full">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-white shadow-lg border border-white/20">
              {propertyDetails.tenantName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight text-white drop-shadow-sm">
                Budget and Finance
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Interactive Expense Management</p>
            </div>
          </div>
          <div className="flex gap-4 sm:gap-8 items-center">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Next Rent Due</p>
              <p className="text-sm font-medium text-white drop-shadow-sm">{propertyDetails.rentDueDate}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs hover:bg-white/20 transition-all uppercase tracking-widest text-white flex items-center gap-2 shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={logout}
                title="Sign out"
                className="px-4 py-2 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl text-xs hover:bg-red-500/20 transition-all uppercase tracking-widest text-red-300 flex items-center gap-2 shadow-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </motion.header>

        <PropertyOverview details={propertyDetails} />
        
        <div className="flex flex-col gap-10 flex-1 mt-8">
          <RentLog entries={rentEntries} onAddEntry={(entry) => addRentEntry(entry)} onDeleteEntry={deleteRentEntry} />
          
          <UtilityLog entries={utilityEntries} onAddEntry={(entry) => addUtilityEntry(entry)} onDeleteEntry={deleteUtilityEntry} />
          
          <div className="flex flex-col gap-6 mt-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex items-center justify-between border-b border-white/10 pb-2"
            >
              <h2 className="text-sm font-medium tracking-wide text-white drop-shadow-sm">Custom Logs</h2>
              <button
                onClick={addCustomLog}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-xl text-xs transition-all border border-white/20 shadow-lg"
              >
                <Plus className="w-3 h-3" />
                Add Log
              </button>
            </motion.div>
            {customLogs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-slate-400 text-sm shadow-xl"
              >
                No custom expense logs. Click "Add Log" to create one.
              </motion.div>
            ) : (
              <div className="flex flex-col gap-8">
                {customLogs.map((log, index) => (
                  <CustomLog 
                    key={log.id}
                    logId={log.id}
                    title={log.title}
                    entries={log.entries}
                    onAddEntry={addCustomEntry}
                    onDeleteEntry={deleteCustomEntry}
                    onUpdateTitle={updateCustomLogTitle}
                    onDeleteLog={deleteCustomLog}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
