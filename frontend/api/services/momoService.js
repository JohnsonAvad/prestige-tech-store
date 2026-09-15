import axios from 'axios';
import { randomUUID } from 'crypto';
import config from '../config.js';

const { baseUrl, subscriptionKey, apiUser, apiKey, targetEnvironment } = config.momo;

// MTN's sandbox only ever accepts EUR, regardless of your actual target market.
// Production accounts use the real local currency (UGX for Uganda).
const SANDBOX_CURRENCY = 'EUR';
const PRODUCTION_CURRENCY = 'UGX';

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Get an OAuth-style access token using Basic Auth (apiUser:apiKey).
 * Tokens are short-lived, so we cache and refresh a little before expiry.
 */
async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const basicAuth = Buffer.from(`${apiUser}:${apiKey}`).toString('base64');

  const { data } = await axios.post(
    `${baseUrl}/collection/token/`,
    {},
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
    }
  );

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

/**
 * Initiate a "request to pay". Returns the referenceId you must store and poll.
 */
export async function initiatePayment({ phone, amount, orderId }) {
  const referenceId = randomUUID();
  const token = await getAccessToken();
  const currency = targetEnvironment === 'sandbox' ? SANDBOX_CURRENCY : PRODUCTION_CURRENCY;

  await axios.post(
    `${baseUrl}/collection/v1_0/requesttopay`,
    {
      amount: String(amount),
      currency,
      externalId: orderId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: normalizePhone(phone),
      },
      payerMessage: `Payment for order ${orderId}`,
      payeeNote: `Order ${orderId}`,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': targetEnvironment,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json',
      },
    }
  );

  return { referenceId, provider: 'mtn', status: 'PENDING' };
}

/**
 * Check the status of a previously initiated payment.
 */
export async function checkStatus(referenceId) {
  const token = await getAccessToken();

  const { data } = await axios.get(
    `${baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Target-Environment': targetEnvironment,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
    }
  );

  return {
    referenceId,
    provider: 'mtn',
    status: data.status,
    reason: data.reason || null,
    raw: data,
  };
}

function normalizePhone(phone) {
  return phone.replace(/^\+/, '').replace(/\s+/g, '');
}

export default { initiatePayment, checkStatus, getAccessToken };