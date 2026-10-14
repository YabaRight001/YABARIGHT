import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, paymentMethod, affiliateRef } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart items are required to place an order.' },
        { status: 400 }
      );
    }

    if (!customer?.fullName || !customer?.email || !customer?.phone || !customer?.address) {
      return NextResponse.json(
        { success: false, message: 'Customer full name, email, phone, and address are required.' },
        { status: 400 }
      );
    }

    // 1. Fetch real products from SQLite to prevent client-side price tampering
    const productIds = items.map((i: any) => i.productId || i.id).filter(Boolean);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // 2. Validate availability and recalculate verified subtotal on server
    let serverSubtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const pId = item.productId || item.id;
      const product = productMap.get(pId);

      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product "${item.name || pId}" is no longer available in the catalog.` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Number(item.quantity) || 1);

      if (product.quantity < qty) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for "${product.name}". Only ${product.quantity} remaining.`,
          },
          { status: 400 }
        );
      }

      // Verified price from database
      const itemPrice = product.price;
      serverSubtotal += itemPrice * qty;

      let parsedImages = ['/logo.png'];
      try {
        if (typeof product.images === 'string') parsedImages = JSON.parse(product.images);
        else if (Array.isArray(product.images)) parsedImages = product.images;
      } catch (e) {}

      orderItemsData.push({
        productId: product.id,
        name: product.name,
        price: itemPrice,
        quantity: qty,
        size: item.size || product.size || 'Standard',
        color: item.color || product.color || null,
        image: parsedImages[0] || '/logo.png',
      });
    }

    // 3. Server calculations
    const shippingCost = serverSubtotal >= 35000 ? 0 : 2500;
    const tax = Math.round(serverSubtotal * 0.05);
    const finalTotal = serverSubtotal + shippingCost + tax;

    // 4. Pre-check affiliate if provided
    let affiliateRecord: any = null;
    if (affiliateRef) {
      try {
        affiliateRecord = await prisma.affiliate.findUnique({
          where: { code: affiliateRef.toUpperCase().trim() },
        });
      } catch (e) {
        console.warn('Could not query affiliate:', e);
      }
    }

    // 5. Generate unique human-readable order number e.g. YBR-2026-948201
    const orderNumber = `YBR-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 6. Execute Order creation and inventory updates
    const result = await prisma.$transaction(
      async (tx) => {
        // Create order
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            customerName: customer.fullName.trim(),
            customerEmail: customer.email.trim().toLowerCase(),
            customerPhone: customer.phone.trim(),
            address: customer.address.trim(),
            city: customer.city || 'Lagos',
            state: customer.state || 'Lagos',
            subtotal: serverSubtotal,
            shippingCost,
            tax,
            total: finalTotal,
            paymentMethod: paymentMethod || 'monnify',
            paymentStatus: paymentMethod === 'bank_transfer' ? 'PENDING' : 'PAID',
            orderStatus: 'CONFIRMED',
            affiliateRef: affiliateRef || null,
            items: {
              create: orderItemsData,
            },
          },
          include: {
            items: true,
          },
        });

        // Atomically decrement stock
        for (const item of orderItemsData) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: { decrement: item.quantity },
              sold: { increment: item.quantity },
            },
          });
        }

        // Record affiliate commission if valid code
        if (affiliateRecord) {
          const commissionAmount = Math.round(finalTotal * 0.1); // 10% commission
          await tx.commission.create({
            data: {
              affiliateId: affiliateRecord.id,
              orderId: newOrder.id,
              orderTotal: finalTotal,
              commissionAmount,
              customerName: customer.fullName.trim(),
              status: 'PENDING',
            },
          });

          await tx.affiliate.update({
            where: { id: affiliateRecord.id },
            data: {
              pendingEarnings: { increment: commissionAmount },
              totalEarnings: { increment: commissionAmount },
            },
          });
        }

        return newOrder;
      },
      {
        maxWait: 15000,
        timeout: 20000,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Order placed and confirmed successfully!',
      order: result,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to place order.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, orderStatus, paymentStatus } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};
    if (orderStatus) dataToUpdate.orderStatus = orderStatus;
    if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: dataToUpdate,
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

