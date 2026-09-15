import axios from 'axios';
import { randomUUID } from 'crypto';
import config from '../config.js';

const { baseUrl, clientId, clientSecret, country, currency } = config.airtel;

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const { data } = await axios.post(`${baseUrl}/auth/oauth2/token`, {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

export async function initiatePayment({ phone, amount, orderId }) {
  const referenceId = randomUUID();
  const token = await getAccessToken();

  await axios.post(
    `${baseUrl}/merchant/v1/payments/`,
    {
      reference: orderId,
      subscriber: {
        country,
        currency,
        msisdn: normalizePhone(phone),
      },
      transaction: {
        amount,
        country,
        currency,
        id: referenceId,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Country': country,
        'X-Currency': currency,
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    }
  );

  return { referenceId, provider: 'airtel', status: 'PENDING' };
}

export async function checkStatus(referenceId) {
  const token = await getAccessToken();

  const { data } = await axios.get(
    `${baseUrl}/standard/v1/payments/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Country': country,
        'X-Currency': currency,
      },
    }
  );

  const statusCode = data?.data?.transaction?.status;
  return {
    referenceId,
    provider: 'airtel',
    status: mapAirtelStatus(statusCode),
    raw: data,
  };
}

function mapAirtelStatus(code) {
  if (code === 'TS') return 'SUCCESSFUL';
  if (code === 'TF') return 'FAILED';
  return 'PENDING';
}

function normalizePhone(phone) {
  return phone.replace(/^\+?256/, '').replace(/^0/, '').replace(/\s+/g, '');
}

export default { initiatePayment, checkStatus, getAccessToken };