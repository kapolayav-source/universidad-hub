import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const SupabaseConfigBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlMigrationPath = 'database/migrations/001_phase1_academic_mvp.sql';

  const copySqlPath = () => {
    navigator.clipboard.writeText(sqlMigrationPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside aria-label="Estado de conexión backend" className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isSupabaseConfigured ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Conectado a Supabase PostgreSQL</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>Modo Local / Fallback Activo (Datos precargados del 4.º Semestre de Economía)</span>
            </span>
          )}
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Fase 1: MVP Académico listo con RLS y migración SQL.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Instrucciones de Base de Datos</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 pb-2">
          <div className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
              Conexión con tu proyecto de Supabase
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Para conectar tu base de datos PostgreSQL real, crea un proyecto en Supabase y define las siguientes variables en tu archivo <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">.env</code>:
            </p>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px] text-emerald-400 select-all">
              VITE_SUPABASE_URL=&quot;https://tu-proyecto.supabase.co&quot;<br />
              VITE_SUPABASE_ANON_KEY=&quot;tu-clave-publica-anon&quot;
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white">Script de Migración SQL</h4>
            <p className="text-slate-400 leading-relaxed">
              El esquema completo relacional (tablas, RLS, triggers y datos de prueba) está disponible en:
            </p>
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
              <code className="text-[11px] text-slate-300 flex-1 font-mono truncate">
                {sqlMigrationPath}
              </code>
              <button
                onClick={copySqlPath}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                title="Copiar ruta"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-[11px]"
            >
              <span>Ir a la consola de Supabase (SQL Editor)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </aside>
  );
};
