import { getSupabaseServer } from '@/lib/supabaseServer';
import { CreateOrderRequest } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/orders
 * 
 * Créer une commande et l'allouer (FEFO automatique)
 * Body: { customer_id, items: [{ product_id, qty }] }
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();
    const { customer_id, items } = body;
    const supabaseServer = getSupabaseServer();

    // Valider les champs
    if (!customer_id || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Champs requis: customer_id, items[]' },
        { status: 400 }
      );
    }

    // Créer la commande
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .insert({
        customer_id,
        status: 'CREATED',
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 400 }
      );
    }

    // Créer les order_items
    const orderItemsData = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      qty: item.qty,
    }));

    const { error: itemsError } = await supabaseServer
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      return NextResponse.json(
        { success: false, error: itemsError.message },
        { status: 400 }
      );
    }

    // Appeler RPC allocate_fefo
    const { data: allocation, error: allocError } = await supabaseServer.rpc(
      'allocate_fefo',
      {
        p_order_id: order.id,
      }
    );

    if (allocError) {
      return NextResponse.json(
        { success: false, error: allocError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        allocations: allocation,
      },
    });
  } catch (error) {
    console.error('[/api/orders] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la création de commande' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders?customer_id=...
 * 
 * Récupérer les commandes d'un client
 */
export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get('customer_id');
    const supabaseServer = getSupabaseServer();

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Paramètre customer_id requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('orders')
      .select(
        `
        *,
        order_items (
          *,
          product:product_id (*)
        ),
        allocations:order_items (
          allocations (*)
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
    console.error('[/api/orders GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
