import * as momo from '../services/momoService.js';
import * as airtel from '../services/airtelService.js';
import { supabase } from '../lib/supabase.js';

function providerFor(name) {
  if (name === 'mtn') return momo;
  if (name === 'airtel') return airtel;
  throw new Error(`Unknown provider: ${name}`);
}

// POST /api/payments/initiate
// body: { provider: "mtn" | "airtel", phone, amount, orderId }
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider, phone, amount, orderId } = req.body;

  if (!provider || !phone || !amount || !orderId) {
    return res.status(400).json({ error: 'provider, phone, amount and orderId are required' });
  }

  try {
    const service = providerFor(provider);
    const result = await service.initiatePayment({ phone, amount, orderId });

    const { error: dbError } = await supabase.from('transactions').insert({
      reference_id: result.referenceId,
      order_id: orderId,
      phone,
      amount,
      provider: result.provider,
      status: 'PENDING',
    });

    if (dbError) {
      console.error('Failed to save transaction to Supabase:', dbError);
    }

    res.status(202).json({
      message: 'Payment request sent. Ask the customer to approve on their phone.',
      referenceId: result.referenceId,
      provider: result.provider,
    });
  } catch (err) {
    console.error('Payment initiation failed:', err.response?.data || err.message);
    res.status(502).json({ error: 'Failed to initiate payment', details: err.response?.data });
  }
}