'use client';

import React, { useState, useEffect } from 'react';
import {
  Video, Calendar, Clock, Star, Stethoscope, CheckCircle2,
  X, ChevronRight, MapPin, Phone, ShieldCheck, ArrowRight,
  CalendarDays, PlusCircle, VideoIcon, CircleDot
} from 'lucide-react';
import type { Appointment } from '@/types/aarogya';
import { getMockDoctors } from '@/data/aiSimulator';

interface AppointmentBookingProps {
  appointments: Appointment[];
  setAppointments: (a: Appointment[]) => void;
}

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
];

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ appointments, setAppointments }) => {
  const [doctors] = useState(() => getMockDoctors());
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('All');

  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))];
  const filteredDoctors = filterSpecialty === 'All' ? doctors : doctors.filter(d => d.specialty === filterSpecialty);

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled' || a.status === 'in-progress');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  const handleBook = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      doctorImage: selectedDoctor.imageUrl,
      date: selectedDate,
      time: selectedTime,
      status: 'scheduled',
      roomUrl: `https://meet.aarogya.ai/room/${Date.now()}`,
    };
    setAppointments([newAppt, ...appointments]);
    setShowBooking(false);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  const cancelAppointment = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const completeAppointment = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'completed' } : a));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-300 opacity-10 rounded-full blur-2xl -ml-12 -mb-12" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Telehealth Consultations</h1>
              <p className="text-emerald-50/90 text-sm mt-1">Book video consults with India's top specialists</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><ShieldCheck className="w-3 h-3" /> Encrypted</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><VideoIcon className="w-3 h-3" /> HD Video</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowBooking(true)}
            className="bg-white text-emerald-700 font-bold px-6 py-3 rounded-2xl text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Upcoming', value: upcomingAppointments.length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Doctors', value: doctors.length, icon: Stethoscope, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'Specialties', value: specialties.length - 1, icon: CircleDot, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-xl ${s.bg}`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" /> Upcoming Consultations
          </h2>
          <div className="space-y-3">
            {upcomingAppointments.map(appt => (
              <div key={appt.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <img src={appt.doctorImage} alt={appt.doctorName} className="w-14 h-14 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">{appt.doctorName}</h3>
                  <p className="text-sm text-emerald-600 font-semibold">{appt.doctorSpecialty}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {appt.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full uppercase">{appt.status}</span>
                  <button className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-emerald-700 transition-colors">
                    <Video className="w-3.5 h-3.5" /> Join
                  </button>
                  <button onClick={() => cancelAppointment(appt.id)} className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Directory */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-600" /> Find a Doctor
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {specialties.map(s => (
              <button
                key={s}
                onClick={() => setFilterSpecialty(s)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${filterSpecialty === s ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map(doc => (
            <div key={doc.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all card-hover">
              <div className="flex items-start gap-3 mb-3">
                <img src={doc.imageUrl} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{doc.name}</h3>
                  <p className="text-sm text-emerald-600 font-semibold">{doc.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-700">{doc.rating}</span>
                    <span className="text-[10px] text-slate-400">({doc.reviews})</span>
                    <span className="text-slate-300 mx-1">·</span>
                    <span className="text-[10px] text-slate-500">{doc.experience}y exp</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{doc.bio}</p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-slate-900">₹{doc.fee}<span className="text-xs font-normal text-slate-400">/visit</span></div>
                <button
                  onClick={() => { setSelectedDoctor(doc); setShowBooking(true); }}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 hover:scale-105 transition-transform"
                >
                  Book Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 mb-3">History</h2>
          <div className="space-y-2">
            {pastAppointments.map(appt => (
              <div key={appt.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
                <img src={appt.doctorImage} alt={appt.doctorName} className="w-10 h-10 rounded-xl object-cover opacity-70" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold text-slate-700">{appt.doctorName}</span>
                  <span className="text-xs text-slate-400 ml-2">{appt.date} · {appt.time}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${appt.status === 'completed' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'}`}>{appt.status}</span>
                {appt.status === 'scheduled' && (
                  <button onClick={() => completeAppointment(appt.id)} className="text-xs text-emerald-600 font-bold hover:underline">Mark Done</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && selectedDoctor && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowBooking(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-slim animate-fadeInScale">
            <button onClick={() => setShowBooking(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <img src={selectedDoctor.imageUrl} alt={selectedDoctor.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <h3 className="font-extrabold text-slate-900">{selectedDoctor.name}</h3>
                <p className="text-sm text-emerald-600 font-semibold">{selectedDoctor.specialty}</p>
                <p className="text-xs text-slate-400">₹{selectedDoctor.fee} per visit</p>
              </div>
            </div>

            <label className="block text-sm font-bold text-slate-700 mb-2">Select Date</label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
            />

            <label className="block text-sm font-bold text-slate-700 mb-2">Select Time Slot</label>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {TIME_SLOTS.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`text-xs font-bold py-2.5 rounded-xl transition-colors ${selectedTime === t ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleBook}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-600/20"
            >
              <Calendar className="w-4 h-4" /> Confirm Booking
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Free cancellation up to 2 hours before
            </p>
          </div>
        </div>
      )}

      {upcomingAppointments.length === 0 && pastAppointments.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No appointments yet</p>
          <p className="text-xs text-slate-400 mt-1">Book your first consultation to get started</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
