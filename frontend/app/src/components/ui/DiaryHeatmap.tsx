// src/pacients/components/DiaryHeatmap.tsx
import React from "react";

interface HeatmapEntry {
  date: string;       // "2025-01-04"
  used: boolean;      // se usou o diário no dia
}

interface HeatmapProps {
  entries: HeatmapEntry[]; // últimos 90 dias
}

const DiaryHeatmap: React.FC<HeatmapProps> = ({ entries }) => {
  // separa por semanas
  const weeks: HeatmapEntry[][] = [];
  for (let i = 0; i < entries.length; i += 7) {
    weeks.push(entries.slice(i, i + 7));
  }

  return (
    <div className="p-4 bg-card border rounded-xl shadow-sm overflow-x-auto">
      <div className="flex gap-[4px] min-w-max">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[4px]">
            {week.map((day, dIdx) => (
              <div
                key={dIdx}
                title={`${day.date} — ${day.used ? "Usou o diário" : "Sem registro"}`}
                className={`
                  w-4 h-4 rounded-sm transition-all
                  ${day.used ? "bg-primary" : "bg-muted"}
                  hover:scale-110 cursor-pointer
                `}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiaryHeatmap;
