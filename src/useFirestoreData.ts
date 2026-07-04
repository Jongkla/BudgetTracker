import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { RentEntry, UtilityEntry, BillEntry, CustomLogData } from './types';

export function useFirestoreData() {
  const [user, loading] = useAuthState(auth);
  
  const [rentEntries, setRentEntries] = useState<RentEntry[]>([]);
  const [utilityEntries, setUtilityEntries] = useState<UtilityEntry[]>([]);
  const [customLogs, setCustomLogs] = useState<CustomLogData[]>([]);
  
  useEffect(() => {
    if (!user) {
      setRentEntries([]);
      setUtilityEntries([]);
      setCustomLogs([]);
      return;
    }
    
    const rentRef = collection(db, `users/${user.uid}/rentEntries`);
    const rentUnsub = onSnapshot(query(rentRef), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RentEntry));
      setRentEntries(data);
    });

    const utilRef = collection(db, `users/${user.uid}/utilityEntries`);
    const utilUnsub = onSnapshot(query(utilRef), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as UtilityEntry));
      setUtilityEntries(data);
    });

    const logsRef = collection(db, `users/${user.uid}/customLogs`);
    const logsUnsub = onSnapshot(query(logsRef), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CustomLogData));
      setCustomLogs(data);
    });

    return () => {
      rentUnsub();
      utilUnsub();
      logsUnsub();
    };
  }, [user]);

  const addRentEntry = async (entry: Omit<RentEntry, 'id'>) => {
    if (!user) return;
    await addDoc(collection(db, `users/${user.uid}/rentEntries`), entry);
  };

  const deleteRentEntry = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/rentEntries/${id}`));
  };

  const updateRentEntry = async (id: string, updates: Partial<RentEntry>) => {
    if (!user) return;
    await updateDoc(doc(db, `users/${user.uid}/rentEntries/${id}`), updates);
  };

  const addUtilityEntry = async (entry: Omit<UtilityEntry, 'id'>) => {
    if (!user) return;
    await addDoc(collection(db, `users/${user.uid}/utilityEntries`), entry);
  };

  const deleteUtilityEntry = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/utilityEntries/${id}`));
  };

  const updateUtilityEntry = async (id: string, updates: Partial<UtilityEntry>) => {
    if (!user) return;
    await updateDoc(doc(db, `users/${user.uid}/utilityEntries/${id}`), updates);
  };

  const addCustomLog = async () => {
    if (!user) return;
    await addDoc(collection(db, `users/${user.uid}/customLogs`), {
      title: 'New Expense Log',
      entries: []
    });
  };

  const deleteCustomLog = async (logId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/customLogs/${logId}`));
  };

  const updateCustomLogTitle = async (logId: string, newTitle: string) => {
    if (!user) return;
    await updateDoc(doc(db, `users/${user.uid}/customLogs/${logId}`), {
      title: newTitle
    });
  };

  const addCustomEntry = async (logId: string, entry: Omit<BillEntry, 'id'>) => {
    if (!user) return;
    const log = customLogs.find(l => l.id === logId);
    if (log) {
      const newEntry = { ...entry, id: crypto.randomUUID() };
      await updateDoc(doc(db, `users/${user.uid}/customLogs/${logId}`), {
        entries: [...log.entries, newEntry]
      });
    }
  };

  const updateCustomEntry = async (logId: string, entryId: string, updates: Partial<BillEntry>) => {
    if (!user) return;
    const log = customLogs.find(l => l.id === logId);
    if (log) {
      await updateDoc(doc(db, `users/${user.uid}/customLogs/${logId}`), {
        entries: log.entries.map(e => e.id === entryId ? { ...e, ...updates } : e)
      });
    }
  };

  const deleteCustomEntry = async (logId: string, entryId: string) => {
    if (!user) return;
    const log = customLogs.find(l => l.id === logId);
    if (log) {
      await updateDoc(doc(db, `users/${user.uid}/customLogs/${logId}`), {
        entries: log.entries.filter(e => e.id !== entryId)
      });
    }
  };

  return {
    user,
    loading,
    rentEntries,
    utilityEntries,
    customLogs,
    addRentEntry,
    deleteRentEntry,
    updateRentEntry,
    addUtilityEntry,
    deleteUtilityEntry,
    updateUtilityEntry,
    addCustomLog,
    deleteCustomLog,
    updateCustomLogTitle,
    addCustomEntry,
    updateCustomEntry,
    deleteCustomEntry
  };
}
