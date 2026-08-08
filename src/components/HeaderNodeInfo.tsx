import React from "react";
import { NodeInfo } from "../types";
import { formatRupiah } from "../utils/phantomEngine";
import { ShieldAlert, MapPin, Store, Database, CheckCircle2, FileSpreadsheet, Lock } from "lucide-react";

interface HeaderNodeInfoProps {
  nodeInfo: NodeInfo;
  totalSurviving: number;
  totalRaw: number;
  dailyRescuedGmv: number;
  onOpenCsvModal: () => void;
  onOpenJsonModal: () => void;
  onOpenAiModal: () => void;
  onOpenSheetsModal: () => void;
}

export const HeaderNodeInfo: React.FC<HeaderNodeInfoProps> = ({
  nodeInfo,
  totalSurviving,
  totalRaw,
  dailyRescuedGmv,
  onOpenCsvModal,
  onOpenJsonModal,
  onOpenAiModal,
  onOpenSheetsModal,
}) => {
  const monthlyRescuedGmv = dailyRescuedGmv * 30;

  return (
    <header id="header-node-info" className="bg-slate-900 border-b border-slate-800 text-white p-4 md:p-6 shadow-xl">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Node Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-semibold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" /> Single Node Isolation Lock
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Node ID: {nodeInfo.nodeId}
              </span>
              <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 text-xs font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-semibold shadow-sm">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Data Masking Active: AI only reads numeric codes.
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Store className="w-7 h-7 text-red-500 shrink-0" />
              {nodeInfo.name}
            </h1>

            <p className="text-slate-400 text-xs md:text-sm flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              {nodeInfo.address}, {nodeInfo.district}, {nodeInfo.regency}, {nodeInfo.province} {nodeInfo.postalCode}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-open-sheets-modal"
              onClick={onOpenSheetsModal}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              Google Sheets Setup
            </button>

            <button
              id="btn-open-csv"
              onClick={onOpenCsvModal}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              Upload / Kelola CSV ({totalRaw} SKU)
            </button>

            <button
              id="btn-open-json"
              onClick={onOpenJsonModal}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold rounded-lg transition-all shadow-md flex items-center gap-1.5"
            >
              <span className="text-amber-200">{`{ }`}</span> Export JSON Output
            </button>

            <button
              id="btn-open-ai"
              onClick={onOpenAiModal}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-md flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              AI Retail Architect
            </button>
          </div>
        </div>

        {/* Rescued GMV Stat Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div id="stat-target-skus" className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Target Sidak Fisik</p>
              <p className="text-2xl font-bold text-red-400 mt-0.5">{totalSurviving} SKU</p>
              <p className="text-[11px] text-slate-500">Lolos Filter Gate 1, 2, 3</p>
            </div>
            <div className="bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 text-red-400 font-extrabold text-sm">
              Phantom
            </div>
          </div>

          <div id="stat-daily-gmv" className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Potensi Kerugian Harian</p>
              <p className="text-xl md:text-2xl font-black text-amber-400 mt-0.5">{formatRupiah(dailyRescuedGmv)}</p>
              <p className="text-[11px] text-slate-500">Penyelamatan GMV / Hari</p>
            </div>
            <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-400 font-extrabold text-xs">
              /Hari
            </div>
          </div>

          <div id="stat-monthly-gmv" className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Estimasi Penyelamatan Bulanan</p>
              <p className="text-xl md:text-2xl font-black text-emerald-400 mt-0.5">{formatRupiah(monthlyRescuedGmv)}</p>
              <p className="text-[11px] text-slate-500">Proyeksi 30 Hari Auto-Replenish</p>
            </div>
            <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-400 font-extrabold text-xs">
              /Bulan
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
