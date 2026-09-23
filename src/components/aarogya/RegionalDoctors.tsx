'use client';

import React, { useState, useMemo } from 'react';
import {
  Building2, MapPin, Star, Search, Phone, Navigation,
  Stethoscope, Users, Clock, Filter, Globe, ChevronRight,
  Hospital, Cross
} from 'lucide-react';

interface RegionalDoctor {
  id: string;
  name: string;
  specialty: string;
  region: string;
  state: string;
  city: string;
  type: 'hospital' | 'clinic' | 'phc';
  experience: number;
  rating: number;
  phone: string;
  address: string;
  availability: string;
}

const DOCTORS: RegionalDoctor[] = [
  { id: 'd1', name: 'AIIMS Delhi', specialty: 'Multi-Specialty', region: 'North', state: 'Delhi', city: 'New Delhi', type: 'hospital', experience: 65, rating: 4.8, phone: '+91-11-26588500', address: 'Ansari Nagar, New Delhi', availability: '24/7 Emergency' },
  { id: 'd2', name: 'Apollo Hospitals', specialty: 'Cardiology', region: 'South', state: 'Tamil Nadu', city: 'Chennai', type: 'hospital', experience: 40, rating: 4.7, phone: '+91-44-28293333', address: 'Greams Road, Chennai', availability: '24/7' },
  { id: 'd3', name: 'Fortis Hospital', specialty: 'Cardiac Sciences', region: 'North', state: 'Delhi', city: 'New Delhi', type: 'hospital', experience: 28, rating: 4.6, phone: '+91-11-47331800', address: 'Vasant Kunj, New Delhi', availability: 'OPD 9am-6pm' },
  { id: 'd4', name: 'Tata Memorial Hospital', specialty: 'Oncology', region: 'West', state: 'Maharashtra', city: 'Mumbai', type: 'hospital', experience: 80, rating: 4.9, phone: '+91-22-24177000', address: 'Parel, Mumbai', availability: '24/7' },
  { id: 'd5', name: 'NIMHANS', specialty: 'Mental Health', region: 'South', state: 'Karnataka', city: 'Bengaluru', type: 'hospital', experience: 70, rating: 4.8, phone: '+91-80-26995000', address: 'Hosur Road, Bengaluru', availability: '24/7' },
  { id: 'd6', name: 'CMC Vellore', specialty: 'Multi-Specialty', region: 'South', state: 'Tamil Nadu', city: 'Vellore', type: 'hospital', experience: 120, rating: 4.9, phone: '+91-416-2281000', address: 'Ida Scudder Road, Vellore', availability: '24/7' },
  { id: 'd7', name: 'PGIMER', specialty: 'Multi-Specialty', region: 'North', state: 'Chandigarh', city: 'Chandigarh', type: 'hospital', experience: 60, rating: 4.7, phone: '+91-172-2747585', address: 'Sector 12, Chandigarh', availability: '24/7' },
  { id: 'd8', name: 'KEM Hospital', specialty: 'General Medicine', region: 'West', state: 'Maharashtra', city: 'Mumbai', type: 'hospital', experience: 95, rating: 4.5, phone: '+91-22-24107200', address: 'Parel, Mumbai', availability: '24/7' },
  { id: 'd9', name: 'PHC Sector 22', specialty: 'General Physician', region: 'North', state: 'Chandigarh', city: 'Chandigarh', type: 'phc', experience: 25, rating: 4.2, phone: '+91-172-2651234', address: 'Sector 22, Chandigarh', availability: '8am-8pm' },
  { id: 'd10', name: 'ESIC Hospital', specialty: 'General Medicine', region: 'East', state: 'West Bengal', city: 'Kolkata', type: 'hospital', experience: 35, rating: 4.3, phone: '+91-33-23641234', address: 'Sealdah, Kolkata', availability: '24/7' },
  { id: 'd11', name: 'Nizam\'s Institute', specialty: 'Neurology', region: 'South', state: 'Telangana', city: 'Hyderabad', type: 'hospital', experience: 45, rating: 4.6, phone: '+91-40-23489000', address: 'Punjagutta, Hyderabad', availability: '24/7' },
  { id: 'd12', name: 'PHC rural Bengaluru', specialty: 'General Physician', region: 'South', state: 'Karnataka', city: 'Bengaluru', type: 'phc', experience: 15, rating: 4.0, phone: '+91-80-26712345', address: 'Anekal, Bengaluru Rural', availability: '9am-5pm' },
  { id: 'd13', name: 'SGPGIMS', specialty: 'Multi-Specialty', region: 'North', state: 'Uttar Pradesh', city: 'Lucknow', type: 'hospital', experience: 35, rating: 4.7, phone: '+91-522-2668004', address: 'Raebareli Road, Lucknow', availability: '24/7' },
  { id: 'd14', name: 'JIPMER', specialty: 'Multi-Specialty', region: 'South', state: 'Puducherry', city: 'Puducherry', type: 'hospital', experience: 65, rating: 4.8, phone: '+91-413-2296000', address: 'Dhanvantari Nagar, Puducherry', availability: '24/7' },
  { id: 'd15', name: 'PHC Mumbai Suburban', specialty: 'General Physician', region: 'West', state: 'Maharashtra', city: 'Mumbai', type: 'phc', experience: 20, rating: 4.1, phone: '+91-22-26547890', address: 'Andheri East, Mumbai', availability: '8am-8pm' },
  { id: 'd16', name: 'AIIMS Bhubaneswar', specialty: 'Multi-Specialty', region: 'East', state: 'Odisha', city: 'Bhubaneswar', type: 'hospital', experience: 12, rating: 4.5, phone: '+91-674-2476001', address: 'Sijua, Bhubaneswar', availability: '24/7' },
  { id: 'd17', name: 'RML Hospital', specialty: 'General Medicine', region: 'North', state: 'Delhi', city: 'New Delhi', type: 'hospital', experience: 70, rating: 4.4, phone: '+91-11-23404404', address: 'Baba Kharak Singh Marg, New Delhi', availability: '24/7' },
  { id: 'd18', name: 'Safdarjung Hospital', specialty: 'Multi-Specialty', region: 'North', state: 'Delhi', city: 'New Delhi', type: 'hospital', experience: 75, rating: 4.3, phone: '+91-11-26165060', address: 'Safdarjung Campus, New Delhi', availability: '24/7' },
];

const REGION_INFO = [
  { name: 'North', states: ['Delhi', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Rajasthan'], color: 'from-rose-500 to-orange-500', icon: '🏔️' },
  { name: 'South', states: ['Tamil Nadu', 'Karnataka', 'Telangana', 'Kerala', 'Andhra Pradesh'], color: 'from-emerald-500 to-teal-500', icon: '🌴' },
  { name: 'East', states: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand', 'Assam'], color: 'from-amber-500 to-yellow-500', icon: '🌅' },
  { name: 'West', states: ['Maharashtra', 'Gujarat', 'Goa'], color: 'from-cyan-500 to-blue-500', icon: '🌊' },
];

export const RegionalDoctors: React.FC = () => {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = useMemo(() => {
    return DOCTORS.filter(d => {
      const matchSearch = !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialty.toLowerCase().includes(search.toLowerCase()) ||
        d.city.toLowerCase().includes(search.toLowerCase()) ||
        d.state.toLowerCase().includes(search.toLowerCase());
      const matchRegion = regionFilter === 'All' || d.region === regionFilter;
      const matchType = typeFilter === 'All' || d.type === typeFilter;
      return matchSearch && matchRegion && matchType;
    });
  }, [search, regionFilter, typeFilter]);

  const typeIcon = (type: string) => {
    if (type === 'hospital') return <Hospital className="w-4 h-4" />;
    if (type === 'phc') return <Cross className="w-4 h-4" />;
    return <Stethoscope className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Regional Doctors & PHCs</h1>
            <p className="text-cyan-50/90 text-sm mt-1">Healthcare network across India · 2011 Census PHC data</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Globe className="w-3 h-3" /> Pan-India</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Hospital className="w-3 h-3" /> {DOCTORS.length} Facilities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Region Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {REGION_INFO.map(r => {
          const count = DOCTORS.filter(d => d.region === r.name).length;
          return (
            <button
              key={r.name}
              onClick={() => setRegionFilter(regionFilter === r.name ? 'All' : r.name)}
              className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all ${regionFilter === r.name ? 'ring-2 ring-emerald-500 shadow-lg' : 'hover:shadow-md'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${r.color} opacity-90`} />
              <div className="relative z-10 text-white">
                <div className="text-2xl mb-1">{r.icon}</div>
                <div className="font-extrabold text-lg">{r.name} India</div>
                <div className="text-xs opacity-90">{count} facilities</div>
                <div className="text-[10px] opacity-75 mt-1">{r.states.slice(0, 3).join(', ')}...</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, specialty, city, or state..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Type:</span>
          {['All', 'hospital', 'clinic', 'phc'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors capitalize ${typeFilter === t ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {t === 'phc' ? 'PHC' : t}
            </button>
          ))}
          {regionFilter !== 'All' && (
            <button onClick={() => setRegionFilter('All')} className="text-xs font-bold text-red-500 hover:text-red-600 ml-auto flex items-center gap-1">
              Clear region ✕
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">{filtered.length} facilit{filtered.length === 1 ? 'y' : 'ies'} found</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(doc => (
          <div key={doc.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-2xl ${doc.type === 'hospital' ? 'bg-emerald-50 text-emerald-600' : doc.type === 'phc' ? 'bg-amber-50 text-amber-600' : 'bg-cyan-50 text-cyan-600'}`}>
                {typeIcon(doc.type)}
              </div>
              <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase">{doc.type}</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{doc.name}</h3>
            <p className="text-sm text-emerald-600 font-semibold mb-2">{doc.specialty}</p>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-700">{doc.rating}</span>
              <span className="text-slate-300 mx-1">·</span>
              <span className="text-[10px] text-slate-500">{doc.experience}y exp</span>
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3 h-3 flex-shrink-0" /> {doc.address}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3 h-3 flex-shrink-0" /> {doc.availability}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <a href={`tel:${doc.phone}`} className="flex-1 bg-emerald-50 text-emerald-700 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-emerald-100 transition-colors">
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(doc.name + ' ' + doc.address)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-slate-50 text-slate-600 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-slate-100 transition-colors">
                <Navigation className="w-3.5 h-3.5" /> Directions
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No facilities found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Data source */}
      <div className="text-center text-[10px] text-slate-400 font-medium pt-4 border-t border-slate-100">
        <Users className="w-3 h-3 inline mr-1" /> Data: PHC Manpower 2011 (MoHFW/IndiaAI) · Open Government License
      </div>
    </div>
  );
};

export default RegionalDoctors;
