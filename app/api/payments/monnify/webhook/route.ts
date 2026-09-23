import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('monnify-signature');
    const secretKey = process.env.MONNIFY_SECRET_KEY;

    if (secretKey && signature) {
      // Validate signature
      const expectedSignature = crypto
        .createHmac('sha512', secretKey)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { eventType, eventData } = payload;

    console.log(`[Monnify Webhook] Event: ${eventType}`, eventData);

    if (eventType === 'SUCCESSFUL_TRANSACTION') {
      const { paymentReference, amountPaid, paidOn, customer } = eventData;
      console.log(`[Monnify Webhook] Payment confirmed for ref: ${paymentReference}, amount: ₦${amountPaid}`);
    }

    return NextResponse.json({ status: 'success', message: 'Webhook processed' });
  } catch (error: any) {
    console.error('Monnify webhook error:', error);
    return NextResponse.json(
      { message: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
