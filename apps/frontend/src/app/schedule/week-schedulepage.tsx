"use client";
import React from 'react';

//1. Mock data for teachers (the columns)
const TEACHERS = ['Sasha', 'Josef', 'Tania', 'Kirill', 'Nika', 'Eva', 'Yulia', 'Ron', 'Alona', 'Tamir'];

//2. Generate time slots in 15 minute increments (the rows)
const generateTimeSlots = () => {
  const slots = [];
  let current = new Date();
  current.setHours(8, 0, 0, 0); //workday starts at 8am

  const end = new Date();
  end.setHours(24, 0, 0, 0); //workday ends at midnight

  while (current <= end) {
    const hours = current.getHours();
    const minutes = current.getMinutes();

    slots.push({
      label: current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hours,
      minutes
    });

    current.setMinutes(current.getMinutes() + 15);
  }
  return slots;
};

export default function WeeklySchedulePage() {
  const timeSlots = generateTimeSlots();
  const totalColumns = TEACHERS.length + 2; // Teachers + Left Time Column + Right Time Column

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 text-slate-100 p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Daily Dance Studio Schedule</h1>
        <p className="text-slate-400 text-sm">Open from 8AM to Midnight</p>
      </header>

      {/* main spreadsheet container */}
      <div className="flex-1 overflow-auto border border-slate-700 rounded-lg shadow-2xl bg-slate-950">
        <div 
          className="grid min-w-[1000px]" 
          style={{ 
            gridTemplateColumns: `80px repeat(${TEACHERS.length}, minmax(150px, 1fr)) 80px` 
          }}
        >
          {/* HEADER ROW */}
          <div className="sticky top-0 bg-slate-800 p-3 font-semibold text-xs border-b border-r border-slate-700 flex items-center justify-center text-slate-400 z-20">Time</div>
          {TEACHERS.map((teacher) => (
            <div key={teacher} className="sticky top-0 bg-slate-800 p-3 font-semibold text-sm border-b border-r border-slate-700 text-center z-20 shadow-sm">
              {teacher}
            </div>
          ))}
          <div className="sticky top-0 bg-slate-800 p-3 font-semibold text-xs border-b border-slate-700 flex items-center justify-center text-slate-400 z-20">Time</div>

          {/* GRID BODY */}
          {timeSlots.map((slot) => (
            <React.Fragment key={slot.label}>
              {/* left time label */}
              <div className="bg-slate-900/50 p-2 text-xs font-mono text-slate-400 border-b border-r border-slate-800 flex items-center justify-center sticky left-0 z-10">
                {slot.label}
              </div>

              {/* teacher columns for a specific time row */}
              {TEACHERS.map((teacher) => (
                <div 
                  key={`${slot.label}-${teacher}`} 
                  className="bg-slate-950 p-2 border-b border-r border-slate-800 min-h-[40px] transition-colors hover:bg-slate-900/40 cursor-pointer group flex flex-col justify-between"
                  onClick={() => alert(`Clicked ${slot.label} slot for ${teacher}`)}
                >
                  {/* visual cell indicator mimicking spreadsheet selection */}
                  <div className="hidden group-hover:block text-[10px] text-emerald-400 font-medium">
                    + Book Slot
                  </div>
                </div>
              ))}

              {/* right time label */}
              <div className="bg-slate-900/50 p-2 text-xs font-mono text-slate-400 border-b border-slate-800 flex items-center justify-center sticky right-0 z-10">
                {slot.label}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}