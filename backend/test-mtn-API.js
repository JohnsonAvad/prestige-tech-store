const https = require('https')

const SUBSCRIPTION_KEY = '776cb420722b4d2f9f3e2fe828364667'
const API_USER = 'd3d527ba-4d09-4ee1-9221-fb40c57b03ae'

const options = {
  hostname: 'sandbox.momodeveloper.mtn.com',
  path: '/v1_0/apiuser',
  method: 'POST',
  headers: {
    'X-Reference-Id': API_USER,
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    'Content-Type': 'application/json'
  }
}

const req = https.request(options, res => {
  console.log('Create API User Status:', res.statusCode)
  res.on('data', d => process.stdout.write(d))
  res.on('end', () => {
    console.log('\n')
    getApiKey()
  })
})

req.on('error', e => console.error(e))
req.write(JSON.stringify({ providerCallbackHost: 'localhost' }))
req.end()

function getApiKey() {
  const options2 = {
    hostname: 'sandbox.momodeveloper.mtn.com',
    path: `/v1_0/apiuser/${API_USER}/apikey`,
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      'Content-Type': 'application/json'
    }
  }

  const req2 = https.request(options2, res => {
    console.log('Get API Key Status:', res.statusCode)
    res.on('data', d => process.stdout.write(d))
  })

  req2.on('error', e => console.error(e))
  req2.write('{}')
  req2.end()
}