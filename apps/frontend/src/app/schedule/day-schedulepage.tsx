"use client";
import React from 'react';

// 1. Columns defined as Days of the Week (Sunday first)
const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

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

export default function DailySchedulePage() {
  const timeSlots = generateTimeSlots();

  // Helper function to calculate business rule restrictions dynamically per cell
  const getCellStatus = (day: string, slotHours: number, slotMinutes: number) => {
    // Rule 1: Saturday is completely blocked out all day
    if (day === "Saturday") {
      return { isBlocked: true, reason: "Closed (Shabbat)" };
    }

    // Rule 2: Friday is blocked out starting from sunset (4:00 PM onwards)
    if (day === "Friday") {
      // 16 hours = 4:00 PM
      if (slotHours > 16 || (slotHours === 16 && slotMinutes >= 0)) {
        return { isBlocked: true, reason: "Closed (Shabbat)" };
      }
    }

    return { isBlocked: false, reason: "" };
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 text-slate-100 p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Weekly Studio Schedule</h1>
        <p className="text-slate-400 text-sm">Sunday - Saturday Matrix (15-min increments)</p>
      </header>

      {/* Main Spreadsheet Scroll Viewport */}
      <div className="flex-1 overflow-auto border border-slate-700 rounded-lg shadow-2xl bg-slate-950">
        <div 
          className="grid min-w-[1200px]" 
          style={{ 
            gridTemplateColumns: `80px repeat(${DAYS.length}, minmax(140px, 1fr)) 80px` 
          }}
        >
          {/* TOP EXCEL ROW: HEADER */}
          <div className="sticky top-0 bg-slate-800 p-3 font-semibold text-xs border-b border-r border-slate-700 flex items-center justify-center text-slate-400 z-20">Time</div>
          {DAYS.map((day) => (
            <div key={day} className="sticky top-0 bg-slate-800 p-3 font-semibold text-sm border-b border-r border-slate-700 text-center z-20 shadow-sm">
              {day}
            </div>
          ))}
          <div className="sticky top-0 bg-slate-800 p-3 font-semibold text-xs border-b border-slate-700 flex items-center justify-center text-slate-400 z-20">Time</div>

          {/* SPREADSHEET CELLS MATRIX */}
          {timeSlots.map((slot) => (
            <React.Fragment key={slot.label}>
              {/* Left Pinned Time Label */}
              <div className="bg-slate-900/60 p-2 text-xs font-mono text-slate-400 border-b border-r border-slate-800 flex items-center justify-center sticky left-0 z-10 backdrop-blur-sm">
                {slot.label}
              </div>

              {/* Loop through each day column for this specific 15-minute interval */}
              {DAYS.map((day) => {
                const { isBlocked, reason } = getCellStatus(day, slot.hours, slot.minutes);

                if (isBlocked) {
                  return (
                    <div 
                      key={`${slot.label}-${day}`} 
                      className="bg-stripes bg-slate-900/80 text-slate-500 text-[11px] font-medium p-2 border-b border-r border-slate-800 flex items-center justify-center cursor-not-allowed select-none transition-colors"
                      title={reason}
                    >
                      <span className="opacity-40 uppercase tracking-wider text-[9px]">{reason}</span>
                    </div>
                  );
                }

                // Return an open active cell if not blocked
                return (
                  <div 
                    key={`${slot.label}-${day}`} 
                    className="bg-slate-950 p-2 border-b border-r border-slate-800 min-h-[42px] transition-all hover:bg-slate-900/60 cursor-pointer group flex items-center justify-center"
                    onClick={() => alert(`Opening booking panel for ${day} at ${slot.label}`)}
                  >
                    <div className="hidden group-hover:block text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      + Select
                    </div>
                  </div>
                );
              })}

              {/* Right Pinned Time Label */}
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