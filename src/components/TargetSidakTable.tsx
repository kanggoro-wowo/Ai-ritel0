import React, { useState } from "react";
import { SidakTargetSku } from "../types";
import { formatRupiah } from "../utils/phantomEngine";
import { Search, CheckCircle, RefreshCw, AlertCircle, ArrowUpDown, ChevronDown, ChevronUp, FileSpreadsheet } from "lucide-react";

interface TargetSidakTableProps {
  survivingSkus: SidakTargetSku[];
  onExecuteZeroStock: (skuId: string) => void;
}

export const TargetSidakTable: React.FC<TargetSidakTableProps> = ({
  survivingSkus,
  onExecuteZeroStock,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSku, setExpandedSku] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const filtered = survivingSkus.filter(
    (item) =>
      (item.plu || item.sku_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.nama_sku || item.nama_barang || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const toggleExpand = (plu: string) => {
    setExpandedSku(expandedSku === plu ? null : plu);
  };

  const pendingCount = survivingSkus.filter((s) => s.sidak_status !== "STOK_DI_NOLKAN").length;

  return (
    <div id="target-sidak-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Table Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Daftar SKU Target Sidak Fisik (Priority Queue)
            </h2>
            <span className="bg-red-950/80 text-red-400 border border-red-800 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              {pendingCount} Pending Audit ({survivingSkus.length} Total Target)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Diurutkan berdasarkan estimasi kerugian terbesar (Stok On-Hand &times; Harga Satuan). Lakukan sidak &amp; nolkan stok per individual SKU.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-search-sku"
              type="text"
              placeholder="Cari PLU / Nama SKU..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 rounded-lg focus:outline-none focus:border-red-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
            <tr>
              <th className="py-3 px-3 w-10 text-center">Rank</th>
              <th className="py-3 px-3 font-semibold">PLU</th>
              <th className="py-3 px-3 font-semibold">Nama SKU</th>
              <th className="py-3 px-3 font-semibold text-right">Avg Sales (7D)</th>
              <th className="py-3 px-3 font-semibold text-center">Sales Kemarin</th>
              <th className="py-3 px-3 font-semibold text-center">Stok On-Hand</th>
              <th className="py-3 px-3 font-semibold text-right">Harga Satuan</th>
              <th className="py-3 px-3 font-semibold text-right text-red-400 flex items-center justify-end gap-1">
                <span>Est. Kerugian</span>
                <ArrowUpDown className="w-3 h-3" />
              </th>
              <th className="py-3 px-3 font-semibold text-center">Aksi Sidak Fisik</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-sans">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  Tidak ada SKU target sidak yang sesuai dengan pencarian "{searchTerm}".
                </td>
              </tr>
            ) : (
              paginated.map((sku, index) => {
                const globalRank = startIndex + index + 1;
                const isZeroed = sku.sidak_status === "STOK_DI_NOLKAN";
                const pluKey = sku.plu || sku.sku_id || `PLU-${index}`;
                const isExpanded = expandedSku === pluKey;
                const lossVal = sku.loss_amount ?? (sku.stok_sistem_onhand * sku.harga_satuan);

                return (
                  <React.Fragment key={`target-${pluKey}-${startIndex + index}`}>
                    <tr
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isZeroed ? "bg-emerald-950/20" : globalRank === 1 ? "bg-red-950/20" : ""
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">
                        #{globalRank}
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        {sku.plu || sku.sku_id}
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-100 max-w-xs">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span>{sku.nama_sku || sku.nama_barang}</span>
                            <button
                              onClick={() => toggleExpand(pluKey)}
                              className="text-slate-500 hover:text-slate-300 p-0.5"
                              title="Detail Kalkulasi"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono">
                            <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                              2D Ago: {sku.sales_dua_hari_lalu ?? 0}
                            </span>
                            <span className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700 font-bold">
                              DC: {sku.status_dc || "NORMAL"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-indigo-400">
                        {(sku.avg_sales_7hari ?? sku.avg_sales_harian ?? 0).toFixed(1)} /hr
                      </td>

                      <td className="py-3 px-3 text-center font-mono">
                        <span className="bg-slate-800 px-2.5 py-0.5 rounded text-amber-300 border border-slate-700 font-bold">
                          {sku.sales_kemarin}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            isZeroed
                              ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                              : "bg-red-900/60 text-red-300 border border-red-700"
                          }`}
                        >
                          {isZeroed ? "0 (DI-NOLKAN)" : `${sku.stok_sistem_onhand ?? sku.stok_sistem} unit`}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-400">
                        {formatRupiah(sku.harga_satuan)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-extrabold text-red-400 text-sm">
                        {formatRupiah(lossVal)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          id={`btn-zero-stock-${pluKey}`}
                          onClick={() => onExecuteZeroStock(pluKey)}
                          disabled={isZeroed}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all flex items-center justify-center gap-1 mx-auto ${
                            isZeroed
                              ? "bg-emerald-950 border border-emerald-700 text-emerald-400 cursor-default opacity-90"
                              : "bg-red-600 hover:bg-red-500 text-white shadow-sm hover:shadow-red-900/40 cursor-pointer"
                          }`}
                        >
                          {isZeroed ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              Stok System 0
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              Sidak & Nolkan Stok
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Math Details */}
                    {isExpanded && (
                      <tr className="bg-slate-950/90 text-slate-400 border-b border-slate-800">
                        <td colSpan={9} className="p-3 pl-12">
                          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                            <div className="font-mono text-amber-300 font-semibold flex items-center gap-2">
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                              Formula Kalkulasi Estimasi Kerugian ({pluKey}):
                            </div>
                            <p className="font-mono text-slate-300">
                              Loss Amount = Stok_Sistem_OnHand ({sku.stok_sistem_onhand ?? sku.stok_sistem}) &times; Harga_Satuan ({formatRupiah(sku.harga_satuan)}) ={" "}
                              <span className="text-red-400 font-bold">{formatRupiah(lossVal)}</span>
                            </p>
                            <p className="text-slate-500 text-[11px]">
                              Velocity Mismatch Flag: Stok ({sku.stok_sistem_onhand ?? sku.stok_sistem}) &gt; 0, Avg Sales ({sku.avg_sales_7hari ?? sku.avg_sales_harian}) &gt; 0, Sales Kemarin = {sku.sales_kemarin}.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 px-1 text-xs text-slate-400 border-t border-slate-800">
          <div>
            Menampilkan <span className="font-mono text-slate-200 font-bold">{startIndex + 1}</span> - <span className="font-mono text-slate-200 font-bold">{Math.min(startIndex + pageSize, filtered.length)}</span> dari <span className="font-mono text-amber-400 font-bold">{filtered.length}</span> SKU Target
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 font-mono">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 rounded border border-slate-700 font-semibold transition-colors"
              >
                &laquo; Prev
              </button>

              <span className="px-3 py-1 bg-slate-950 text-slate-300 rounded border border-slate-800">
                Hal <strong className="text-amber-400">{currentPage}</strong> / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 rounded border border-slate-700 font-semibold transition-colors"
              >
                Next &raquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
