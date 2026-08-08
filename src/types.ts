export interface RawSkuData {
  plu: string; // Product Code / PLU ID
  nama_sku: string; // Product Description
  avg_sales_7hari: number; // 7-Day Daily Velocity
  sales_kemarin: number; // Yesterday's Sales
  sales_dua_hari_lalu?: number; // Sales 2 Days Ago (default 0)
  stok_sistem_onhand: number; // System Stock On Hand
  harga_satuan: number; // Unit Price in IDR
  status_dc?: string; // DC Inventory Status ('NORMAL', 'OOS', 'EMPTY' - default 'NORMAL')

  // Backward compatibility aliases
  sku_id?: string;
  nama_barang?: string;
  avg_sales_harian?: number;
  sales_hari_ini?: number;
  stok_sistem?: number;
}

export interface GateEvaluation {
  preFilter_dcCheck: boolean; // Status_DC is not OOS / EMPTY
  gate1_avgSales: boolean; // Avg_Sales_7Hari >= 3.0 OR (Harga_Satuan >= 50000 AND Avg_Sales_7Hari >= 1.0)
  gate2_salesZero: boolean; // Closed 2-Day Freeze: Sales_Kemarin == 0 AND Sales_Dua_Hari_Lalu == 0
  gate3_lowStock: boolean; // Stok_Sistem_OnHand > 0 AND Stok_Sistem_OnHand <= Math.max(3, Avg_Sales_7Hari * 0.3)
  dynamicThreshold: number; // Math.max(3, Avg_Sales_7Hari * 0.3)
  isPassed: boolean;
  failedGates: string[];
}

export interface SidakTargetSku extends RawSkuData {
  sales_dua_hari_lalu: number;
  status_dc: string;
  loss_amount: number; // Stok_Sistem_OnHand * Harga_Satuan
  velocity_mismatch: boolean; // Stok_Sistem_OnHand > 0 && Avg_Sales_7Hari > 0 && Sales_Kemarin === 0 && Sales_Dua_Hari_Lalu === 0
  evaluation: GateEvaluation;
  sidak_status?: "PENDING" | "PROCESSED" | "STOK_DI_NOLKAN";
  action: "SIDAK_FISIK_DAN_NOLKAN_STOK";
  processedAt?: string;
  notes?: string;

  // Backward compatibility aliases
  potensi_kerugian_harian?: number;
}

export interface NodeInfo {
  nodeId: string;
  name: string;
  address: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  rtRw: string;
  status: "LOCKED" | "ACTIVE";
}

export interface LaporanPhantomInventoryJson {
  jejak_penalaran_logika: string;
  target_operasi_fisik: {
    plu: string;
    nama_sku: string;
    stok_sistem_onhand: number;
    loss_amount: number;
  }[];
}
