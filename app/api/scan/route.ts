import { getSupabaseServer } from '@/lib/supabaseServer';
import { ScanRequest } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/scan
 * 
 * Réception scanner - Appelle RPC receive_scan
 * Body: { product_code, lot_code, dlc, qty }
 */
export async function POST(request: NextRequest) {
  try {
    const body: ScanRequest = await request.json();
    const { product_code, lot_code, dlc, qty } = body;
    const supabaseServer = getSupabaseServer();

    // Valider les champs
    if (!product_code || !lot_code || !dlc || !qty) {
      return NextResponse.json(
        { success: false, error: 'Champs requis: product_code, lot_code, dlc, qty' },
        { status: 400 }
      );
    }

    // Appeler RPC receive_scan
    const { data, error } = await supabaseServer.rpc('receive_scan', {
      p_product_code: product_code,
      p_lot_code: lot_code,
      p_dlc: dlc,
      p_qty: qty,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0] || data,
    });
  } catch (error) {
    console.error('[/api/scan] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors du scan' },
      { status: 500 }
    );
  }
}
