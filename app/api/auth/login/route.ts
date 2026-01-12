import { NextRequest, NextResponse } from 'next/server';

/**
 * LOGIN API - DÉSACTIVÉE POUR MODE DÉMO
 * =====================================
 * L'authentification n'est pas nécessaire pour la démonstration.
 * Accédez directement à /qhse
 */

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'L\'authentification a été désactivée. Accédez directement à /qhse' },
    { status: 403 }
  );
}

