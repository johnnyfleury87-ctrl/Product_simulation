import { supabaseServer } from '@/lib/supabaseServer';
import { AckRecallRequest } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/recalls/acknowledge
 * 
 * Confirmer une notification de rappel (client clique "J'ai lu")
 * Body: { notification_id }
 */
export async function POST(request: NextRequest) {
  try {
    const body: AckRecallRequest = await request.json();
    const { notification_id } = body;

    // Valider les champs
    if (!notification_id) {
      return NextResponse.json(
        { success: false, error: 'Champ requis: notification_id' },
        { status: 400 }
      );
    }

    // Appeler RPC acknowledge_recall_notification
    const { data, error } = await supabaseServer.rpc(
      'acknowledge_recall_notification',
      {
        p_notification_id: notification_id,
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
    console.error('[/api/recalls/acknowledge] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la confirmation' },
      { status: 500 }
    );
  }
}
