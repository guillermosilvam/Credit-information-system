'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, DollarSign, Calendar, Percent, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CalculadoraCredito() {
  const [monto, setMonto] = useState<number>(15000);
  const [plazo, setPlazo] = useState<number>(12);
  const tasaAnual = 14; // 14% de interés referencial agrio-promedio

  // Cálculos matemáticos
  const resultados = useMemo(() => {
    const tasaMensual = (tasaAnual / 100) / 12;
    // Fórmula de amortización francesa: Cuota = Capital * (i * (1+i)^n) / ((1+i)^n - 1)
    const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);
    
    const totalPagar = cuota * plazo;
    const totalIntereses = totalPagar - monto;

    return {
      cuotaMensual: cuota,
      totalIntereses: totalIntereses,
      totalPagar: totalPagar
    };
  }, [monto, plazo]);

  const formatoMoneda = (valor: number) => {
    return '$' + Math.round(valor).toLocaleString('en-US');
  };

  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 border border-slate-200 mb-6 shadow-sm">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold tracking-wide">Simulador de Financiamiento</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Planifica tu inversión agrícola
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Utiliza nuestra herramienta referencial para estimar el costo de capital de los planes ofrecidos por las principales entidades bancarias.
            </p>
          </div>

          {/* Calculadora (Grid 2 Columnas) */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 bg-slate-50 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            
            {/* Controles */}
            <div className="space-y-10 relative z-20">
              {/* Slider de Monto */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" /> Monto Solicitado
                  </label>
                  <span className="text-2xl font-bold text-slate-900">{formatoMoneda(monto)}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000" 
                  value={monto} 
                  onChange={(e) => setMonto(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium font-mono">
                  <span>$1k</span>
                  <span>$100k</span>
                </div>
              </div>

              {/* Botones de Plazo */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Plazo del Crédito (Meses)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[6, 12, 24, 36].map((meses) => (
                    <button
                      key={meses}
                      onClick={() => setPlazo(meses)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all ${
                        plazo === meses 
                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105 border border-primary' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/40 hover:bg-slate-50'
                      }`}
                    >
                      {meses} m
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasa Informativa */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Percent className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Tasa de Referencia Asumida: {tasaAnual}%</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Este valor es un promedio referencial de banca agrícola nacional. Las entidades impondrán su propia política final.</p>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="bg-slate-900 rounded-4xl p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-10 -translate-y-10" />
              
              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-slate-300 text-sm font-medium mb-2">Cuota Mensual Estimada</p>
                  <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400">
                    {formatoMoneda(resultados.cuotaMensual)}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Capital Solicitado:</span>
                    <span className="font-semibold text-slate-200">{formatoMoneda(monto)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Intereses Totales:</span>
                    <span className="font-semibold text-slate-200">{formatoMoneda(resultados.totalIntereses)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-slate-700/50 pt-4">
                    <span className="text-slate-300 font-medium">Costo Total del Crédito:</span>
                    <span className="font-bold text-white text-lg">{formatoMoneda(resultados.totalPagar)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 relative z-10">
                <Button asChild className="w-full h-14 bg-primary text-white hover:bg-primary/90 text-base shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]">
                  <Link href="/registro/productor">
                    Solicitar Perfil Financiero
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <p className="text-center text-xs text-slate-500 mt-4 font-light">
                  Resultados matemáticos referenciales. No aplicables para obligaciones contractuales automáticas.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
