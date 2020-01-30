const rp = require('request-promise');
const bb = require('bluebird');

const options = {
  baseUrl: 'http://localhost:8080',
  json: true
}

const password = 'Wallex$2019'

// DATA BODY

const dataLogin = [
  {
    username: 'wallex.test+a1@outlook.com',
    password: password
  },
  {
    username: 'wallex.test+b1@outlook.com',
    password: password
  },
  {
    username: 'wallex.test+c1@outlook.com',
    password: password
  },
  {
    username: 'wallex.test+d1@outlook.com',
    password: password
  },
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
  {
    'sell_currency': 'IDR',
    'buy_currency': 'SGD',
    'fixed_side': 'buy',
    'amount': 300
  },
  {
    'sell_currency': 'IDR',
    'buy_currency': 'SGD',
    'fixed_side': 'buy',
    'amount': 400
  },
  {
    'sell_currency': 'IDR',
    'buy_currency': 'SGD',
    'fixed_side': 'buy',
    'amount': 600
  },
];

const dataConversion = [
  {
    'reason': 'Wallex Conversion - Postman - Fathoni',
    'reference_id': 'ABCDEFG-00001',
    // 'quote_uuid': '{{QUOTE_UUID}}'
  },
  {
    'reason': 'Wallex Conversion - Postman - Fathoni',
    'reference_id': 'ABCDEFG-00002',
    // 'quote_uuid': '{{QUOTE_UUID}}'
  },
  {
    'reason': 'Wallex Conversion - Postman - Fathoni',
    'reference_id': 'ABCDEFG-00003',
    // 'quote_uuid': '{{QUOTE_UUID}}'
  },
  {
    'reason': 'Wallex Conversion - Postman - Fathoni',
    'reference_id': 'ABCDEFG-00004',
    // 'quote_uuid': '{{QUOTE_UUID}}'
  },
  {
    'reason': 'Wallex Conversion - Postman - Fathoni',
    'reference_id': 'ABCDEFG-00005',
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


// START TEST
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
