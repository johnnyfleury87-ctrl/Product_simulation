import { supabaseServer } from '@/lib/supabaseServer';
import { CreateRecallRequest, AckRecallRequest } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/recalls
 * 
 * Créer un rappel (fournisseur) - Appelle RPC create_recall_by_dlc_window
 * Body: { product_id, dlc_ref, severity }
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateRecallRequest = await request.json();
    const { product_id, dlc_ref, severity } = body;

    // Valider les champs
    if (!product_id || !dlc_ref || !severity) {
      return NextResponse.json(
        { success: false, error: 'Champs requis: product_id, dlc_ref, severity' },
        { status: 400 }
      );
    }

    // Appeler RPC create_recall_by_dlc_window
    const { data, error } = await supabaseServer.rpc(
      'create_recall_by_dlc_window',
      {
        p_product_id: product_id,
        p_dlc_ref: dlc_ref,
        p_severity: severity,
      }
    );

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
    console.error('[/api/recalls] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la création du rappel' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/recalls/notifications?customer_id=...
 * 
 * Récupérer les notifications de rappel pour un client
 */
export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get('customer_id');

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Paramètre customer_id requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('recall_notifications')
      .select(
        `
        *,
        recall:recall_id (
          *,
          product:product_id (*)
        )
        `
      )
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[/api/recalls GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
