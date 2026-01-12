import { NextRequest, NextResponse } from 'next/server';
import { simulatedLogin } from '@/lib/authSimulation';

/**
 * LOGIN API - MODE SIMULATION DÉMO
 * ================================
 * Pour production : réactiver getSupabaseServer() et signInWithPassword
 * 
 * MODE DÉMO : Utilise un système de login simulé sans Supabase Auth
 * Accepte n'importe quel email avec password: "demo" ou "demo123456"
 */

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Mode simulation
    const result = await simulatedLogin(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: result.user,
        token: `mock-token-${result.user!.id}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
