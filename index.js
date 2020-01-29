const rp = require('request-promise');
const bb = require('bluebird');

const options = {
  baseUrl: 'http://localhost:8080',
  json: true
}

// DATA BODY

const dataLogin = [
  {
    username: 'wallex.test+a1@outlook.com',
    password: 'Wallex$2019'
  },
  {
    username: 'wallex.test+a2@outlook.com',
    password: 'Wallex$2019'
  }
];

const dataRates = [
  {
    'sell_currency': 'IDR',
    'buy_currency': 'SGD',
    'fixed_side': 'buy',
    'amount': 100
  },
  {
    'sell_currency': 'IDR',
    'buy_currency': 'SGD',
    'fixed_side': 'buy',
    'amount': 200
  },
];

const dataConversion = [
  {
    'reason': 'Wallex Conversion - Postman - Fathoni',
    'reference_id': 'ABCDEFG-123451',
    // 'quote_uuid': '{{QUOTE_UUID}}'
  },
  {
    'reason': 'Wallex Conversion - Postman - Fathoni',
    'reference_id': 'ABCDEFG-123452',
    // 'quote_uuid': '{{QUOTE_UUID}}'
  },
]

let headers = [];
let quoteUUIDs = [];

// Login
const login = (body) => {
  return rp({
    ...options,
    uri: '/api/users/login',
    body,
    method: 'POST'
  })
}

const promiseLogin = dataLogin.map(data => login(data));

// Conversion - Rate
const rates = (headers, body) => {
  return rp({
    ...options,
    uri: '/api/conversions/rates',
    body,
    method: 'POST',
    headers,
  })
}

// Conversion - Create
const conversion = (headers, body) => {
  return rp({
    ...options,
    uri: '/api/conversions/create',
    body,
    method: 'POST',
    headers,
  })
}

let promiseRates;
let promiseConversion;

// Funding - Create

const startTest = async () => {
  // login
  const resultLogin = await Promise.all(promiseLogin);
  promiseRates = resultLogin.map((response, index) => {
    console.log('RESPONSE', { response });
    
    const header = { 'Authorization': response.token };
    headers.push(header);

    return rates(header, dataRates[index]);    
  });

  console.log('headers', { headers });

  // rates
  const resultRates = await Promise.all(promiseRates);
  console.log('RATES', { resultRates });

  // Conversion - Create
  promiseConversion = resultRates.map((response, index) => {
    console.log('RESPONSE Rates', { response });

    const quoteUUID = response.quote_uuid;
    quoteUUIDs.push(quoteUUID);

    dataConversion[index].quote_uuid = quoteUUID; 

    return conversion(headers[index], dataConversion[index])
  });

  console.log('quoteUUIDs', { quoteUUIDs });


}


startTest();
