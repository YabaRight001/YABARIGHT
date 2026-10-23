import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format for client-side consumption
    const formatted = vendors.map((v: any) => ({
      id: v.id,
      name: v.user?.name || v.shopName,
      shopName: v.shopName,
      email: v.user?.email || '',
      phone: v.user?.phone || '0800 000 0000',
      address: v.address || 'Yaba, Lagos',
      idType: v.idType || 'CAC Certificate',
      idNumber: v.idNumber || 'N/A',
      isVerified: v.isVerified,
      verifiedAt: v.verifiedAt ? v.verifiedAt.toISOString().split('T')[0] : undefined,
      status: v.user?.status || 'active',
      joinedAt: v.createdAt.toISOString().split('T')[0],
      rating: v.rating,
      totalSales: v.totalSales,
      productsCount: v.products.length,
    }));

    return NextResponse.json({
      success: true,
      vendors: formatted,
    });
  } catch (error: any) {
    console.error('Error fetching admin vendors:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isVerified, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Vendor ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isVerified === 'boolean') {
      updateData.isVerified = isVerified;
      updateData.verifiedAt = isVerified ? new Date() : null;
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
      },
    });

    // If status changed, update user account status too
    if (status && updatedVendor.userId) {
      await prisma.user.update({
        where: { id: updatedVendor.userId },
        data: { status },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor updated successfully',
      vendor: updatedVendor,
    });
  } catch (error: any) {
    console.error('Error updating vendor:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update vendor' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Vendor ID is required' }, { status: 400 });
    }

    await prisma.vendor.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Vendor removed successfully',
    });
  } catch (error: any) {
    console.error('Error deleting vendor:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete vendor' },
      { status: 500 }
    );
  }
}
