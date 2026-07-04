import React from 'react';
import { PropertyDetails } from '../types';
import { MapPin, User, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  details: PropertyDetails;
}

export function PropertyOverview({ details }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl">
        <span className="text-[10px] uppercase tracking-widest text-slate-300">Tenant</span>
        <h2 className="text-lg font-serif italic text-white mt-1 drop-shadow-sm">{details.tenantName}</h2>
      </div>
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl lg:col-span-3 flex items-start gap-4 shadow-xl">
        <MapPin className="w-5 h-5 text-white/70 mt-1 flex-shrink-0 hidden sm:block" />
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-300">Property Address</span>
          <h2 className="text-lg font-light text-white mt-1 drop-shadow-sm">{details.propertyAddress}</h2>
        </div>
      </div>
    </motion.div>
  );
}
