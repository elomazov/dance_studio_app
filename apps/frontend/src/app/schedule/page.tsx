"use client";
import React, { useState } from 'react';

//1. Configuration constants for both views (teachers + 1 day, days of the week)
const TEACHERS = ['Sasha', 'Josef', 'Tania', 'Kirill', 'Nika', 'Eva', 'Yulia', 'Ron', 'Alona', 'Tamir'];
const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

//2. Generate time slots in 15 minute increments (the rows)
const generateTimeSlots = () => {
  const slots = [];
  let current = new Date();
  current.setHours(8, 0, 0, 0); //workday starts at 8am
  
  const end = new Date();
  end.setHours(23, 45, 0, 0); //workday ends at midnight

  while (current <= end) {
    const hours = current.getHours();
    const minutes = current.getMinutes();

    slots.push({
      label: current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      hours,
      minutes
    });

    current.setMinutes(current.getMinutes() + 15);
  }
  return slots;
};

export default function SchedulePage() {
  // 1. The Toggle State: Can either be 'daily' or 'weekly'
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('weekly');
  
  const timeSlots = generateTimeSlots();

  // Determine active columns based on the toggle state
  const activeColumns = viewMode === 'daily' ? TEACHERS : DAYS;

  // Calculate business rule restrictions dynamically for the weekly view
  const getWeeklyCellStatus = (day: string, slotHours: number, slotMinutes: number) => {
    if (day === "Saturday") {
      return { isBlocked: true, reason: "Closed (Shabbat)" };
    }
    if (day === "Friday" && (slotHours > 16 || (slotHours === 16 && slotMinutes >= 0))) {
      return { isBlocked: true, reason: "Closed (Sunset)" };
    }
    return { isBlocked: false, reason: "" };
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 text-slate-100 p-6">
      
      {/* HEADER & TOGGLE INPUT CONTROL */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Studio Matrix Schedule</h1>
          <p className="text-slate-400 text-sm">
            {viewMode === 'daily' ? 'Teacher Schedule Grid' : 'Weekly Calendar View (Sunday - Saturday)'}
          </p>
        </div>

        {/* The Toggle Button Group */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'daily'
                ? 'bg-slate-800 text-slate-100 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily (Teachers)
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'weekly'
                ? 'bg-slate-800 text-slate-100 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly (Days)
          </button>
        </div>
      </header>

      {/* DYNAMIC VIEWPORT CONTAINER */}
      <div className="flex-1 overflow-auto border border-slate-700 rounded-lg shadow-2xl bg-slate-950">
        <div 
          className="grid min-w-[1200px]" 
          style={{ 
            // The template math automatically updates column widths when activeColumns changes lengths
            gridTemplateColumns: `80px repeat(${activeColumns.length}, minmax(140px, 1fr)) 80px` 
          }}
        >
          {/* HEADER ROW */}
          <div className="sticky top-0 bg-slate-800 p-3 font-semibold text-xs border-b border-r border-slate-700 flex items-center justify-center text-slate-400 z-20">Time</div>
          {activeColumns.map((colName) => (
            <div key={colName} className="sticky top-0 bg-slate-800 p-3 font-semibold text-sm border-b border-r border-slate-700 text-center z-20 shadow-sm">
              {colName}
            </div>
          ))}
          <div className="sticky top-0 bg-slate-800 p-3 font-semibold text-xs border-b border-slate-700 flex items-center justify-center text-slate-400 z-20">Time</div>

          {/* CELLS MATRIX */}
          {timeSlots.map((slot) => (
            <React.Fragment key={slot.label}>
              
              {/* Left Time Label */}
              <div className="bg-slate-900/60 p-2 text-xs font-mono text-slate-400 border-b border-r border-slate-800 flex items-center justify-center sticky left-0 z-10 backdrop-blur-sm">
                {slot.label}
              </div>

              {/* Data Intersects */}
              {activeColumns.map((colName) => {
                // If weekly, check for restrictions. If daily, leave open for now.
                const blockConfig = viewMode === 'weekly' 
                  ? getWeeklyCellStatus(colName, slot.hours, slot.minutes)
                  : { isBlocked: false, reason: "" };

                if (blockConfig.isBlocked) {
                  return (
                    <div 
                      key={`${slot.label}-${colName}`} 
                      // 1. bg-stripes applies the grey diagonal lines
                      // 2. cursor-not-allowed shows the universal "disabled" mouse cursor
                      // 3. select-none stops users from highlighted text
                      className="bg-stripes bg-slate-900/80 text-slate-500 text-[11px] font-medium p-2 border-b border-r border-slate-800 flex items-center justify-center cursor-not-allowed select-none"
                      title={blockConfig.reason} // Shows "Closed (Shabbat)" on mouse hover
                    >
                      <span className="opacity-40 uppercase tracking-wider text-[9px]">
                        {blockConfig.reason}
                      </span>
                    </div>
                  );
                }

                return (
                  <div 
                    key={`${slot.label}-${colName}`} 
                    className="bg-slate-950 p-2 border-b border-r border-slate-800 min-h-[42px] transition-all hover:bg-slate-900/60 cursor-pointer group flex items-center justify-center"
                    onClick={() => alert(`Booking for ${colName} at ${slot.label}`)}
                  >
                    <div className="hidden group-hover:block text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      + Select
                    </div>
                  </div>
                );
              })}

              {/* Right Time Label */}
              <div className="bg-slate-900/60 p-2 text-xs font-mono text-slate-400 border-b border-slate-800 flex items-center justify-center sticky right-0 z-10 backdrop-blur-sm">
                {slot.label}
              </div>

            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}