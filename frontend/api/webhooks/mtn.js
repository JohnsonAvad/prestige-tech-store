import { supabase } from '../lib/supabase.js';

// POST /api/webhooks/mtn
// TODO before production: validate this request is genuinely from MTN
// (IP allowlist and/or shared secret) before trusting the payload.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('MTN webhook received:', req.body);
  await handleFinalStatus('mtn', req.body.referenceId, req.body.status);
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