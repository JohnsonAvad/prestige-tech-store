import { supabase } from '../lib/supabase.js';

// POST /api/webhooks/airtel
// TODO before production: validate the callback signature/source per Airtel's docs.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Airtel webhook received:', req.body);
  const referenceId = req.body?.transaction?.id;
  const status = req.body?.transaction?.status === 'TS' ? 'SUCCESSFUL' : 'FAILED';
  await handleFinalStatus('airtel', referenceId, status);
  res.sendStatus(200);
}

async function handleFinalStatus(provider, referenceId, status) {
  const { data: record, error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('reference_id', referenceId)
    .select()
    .single();

  if (error || !record) {
    console.warn(`Webhook for unknown/failed-update reference ${referenceId} (${provider})`, error);
    return;
  }

  if (status === 'SUCCESSFUL') {
    console.log(`Order ${record.order_id} paid via ${provider}. Mark as paid & fulfill.`);
  } else if (status === 'FAILED') {
    console.log(`Order ${record.order_id} payment failed via ${provider}.`);
  }
}