import React, { useState, useEffect } from "react";
import { X, FileSpreadsheet, Check, ExternalLink, Save } from "lucide-react";

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhookUrl: string;
  onSaveWebhookUrl: (url: string) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  webhookUrl,
  onSaveWebhookUrl,
}) => {
  const [urlInput, setUrlInput] = useState(webhookUrl);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUrlInput(webhookUrl);
  }, [webhookUrl]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWebhookUrl(urlInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const scriptDocUrl = "https://docs.google.com/document/d/1HLFwoHlZdculXEiLHUXmeAFEtrxTDzUf980DVSa9XoI/edit?usp=sharing";

  return (
    <div
      id="modal-sheets-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="modal-sheets-content"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 text-slate-200"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">
              Google Sheets Setup
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1 Input field to enter the Webhook Apps Script URL */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="input-webhook-url"
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              Webhook Apps Script URL
            </label>
            <div className="flex gap-2">
              <input
                id="input-webhook-url"
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? "Tersimpan!" : "Simpan URL"}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Masukkan Webhook URL Apps Script yang telah di-deploy untuk sinkronisasi otomatis hasil audit sidak.
            </p>
          </div>
        </form>

        {/* 1 Link to the GitHub Gist / Google Docs containing the updated script */}
        <div className="border-t border-slate-800 pt-4">
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Dokumentasi &amp; Script Google Apps Script
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Salin dan deploy script versi terbaru dari Google Docs / GitHub Gist resmi.
              </p>
            </div>
            <a
              href={scriptDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Buka Script</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
