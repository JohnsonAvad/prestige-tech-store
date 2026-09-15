import * as momo from '../../../services/momoService.js';
import * as airtel from '../../../services/airtelService.js';
import { supabase } from '../../../lib/supabase.js';

function providerFor(name) {
  if (name === 'mtn') return momo;
  if (name === 'airtel') return airtel;
  throw new Error(`Unknown provider: ${name}`);
}

// GET /api/payments/status/:provider/:referenceId
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider, referenceId } = req.query;

  try {
    const service = providerFor(provider);
    const status = await service.checkStatus(referenceId);

    const { error: dbError } = await supabase
      .from('transactions')
      .update({ status: status.status })
      .eq('reference_id', referenceId);

    if (dbError) {
      console.error('Failed to update transaction status in Supabase:', dbError);
    }

    res.json(status);
  } catch (err) {
    console.error('Status check failed:', err.response?.data || err.message);
    res.status(502).json({ error: 'Failed to check status' });
  }
}