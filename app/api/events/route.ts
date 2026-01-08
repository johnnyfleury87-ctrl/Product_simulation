import { supabaseServer } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/events
 * 
 * Récupérer les logs d'événements (tous les types)
 * Query params: type?, limit?, days?
 */
export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '100');
    const days = parseInt(request.nextUrl.searchParams.get('days') || '7');

    let query = supabaseServer
      .from('event_logs')
      .select('*')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error('[/api/events] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
