import React from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { Course } from '../../types/academic';

interface ScheduleViewProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ courses, onSelectCourse }) => {
  const days = [
    { number: 1, name: 'Lunes' },
    { number: 2, name: 'Martes' },
    { number: 3, name: 'Miércoles' },
    { number: 4, name: 'Jueves' },
    { number: 5, name: 'Viernes' },
  ];

  // Agrupar horarios por día de la semana
  const scheduleByDay = days.map((day) => {
    const slots: Array<{
      course: Course;
      startTime: string;
      endTime: string;
      classroom: string;
    }> = [];

    courses.forEach((course) => {
      course.schedules.forEach((sch) => {
        if (sch.dayOfWeek === day.number) {
          slots.push({
            course,
            startTime: sch.startTime,
            endTime: sch.endTime,
            classroom: sch.classroom,
          });
        }
      });
    });

    // Ordenar por hora de inicio
    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return {
      day,
      slots,
    };
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Horario Académico Semanal
          </h1>
          <p className="text-xs text-slate-500">
            4.º Semestre • Carrera de Economía • 21 Créditos
          </p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-200">
          Periodo 2026-I
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {scheduleByDay.map(({ day, slots }) => (
          <div
            key={day.number}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col"
          >
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{day.name}</span>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                {slots.length} clases
              </span>
            </div>

            <div className="p-3 space-y-3 flex-1">
              {slots.length === 0 ? (
                <div className="h-28 flex items-center justify-center text-[11px] text-slate-400 italic text-center">
                  Sin clases programadas
                </div>
              ) : (
                slots.map((slot, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectCourse(slot.course.id)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group space-y-1.5"
                    style={{ borderLeftWidth: '4px', borderLeftColor: slot.course.colorHex }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{slot.startTime} - {slot.endTime}</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {slot.course.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate pt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{slot.classroom}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
