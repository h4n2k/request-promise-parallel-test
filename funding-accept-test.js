const rp = require('request-promise');
const bb = require('bluebird');

const options = {
  baseUrl: 'http://localhost:8080',
  json: true
};

const password = 'Wallex$2019'

// DATA BODY

const dataLogin = [
  {
    username: 'wallex.test+a1@outlook.com',
    password: password
  },
  // {
  //   username: 'wallex.test+b1@outlook.com',
  //   password: password
  // },
  // {
  //   username: 'wallex.test+c1@outlook.com',
  //   password: password
  // },
  // {
  //   username: 'wallex.test+d1@outlook.com',
  //   password: password
  // },
];

const dataRates = [
  {
    sell_currency: 'IDR',
    buy_currency: 'SGD',
    fixed_side: 'buy',
    amount: 100
  },
  // {
  //   sell_currency: 'IDR',
  //   buy_currency: 'SGD',
  //   fixed_side: 'buy',
  //   amount: 200
  // },
  // {
  //   sell_currency: 'IDR',
  //   buy_currency: 'SGD',
  //   fixed_side: 'buy',
  //   amount: 300
  // },
  // {
  //   sell_currency: 'IDR',
  //   buy_currency: 'SGD',
  //   fixed_side: 'buy',
  //   amount: 400
  // },
  // {
  //   sell_currency: 'IDR',
  //   buy_currency: 'SGD',
  //   fixed_side: 'buy',
  //   amount: 600
  // },
];

const dataConversion = [
  {
    reason: 'Wallex Conversion - Postman - Fathoni',
    reference_id: 'ABCDEFG-00001',
    // quote_uuid: '{{QUOTE_UUID}}'
  },
  // {
  //   reason: 'Wallex Conversion - Postman - Fathoni',
  //   reference_id: 'ABCDEFG-00002',
  //   // quote_uuid: '{{QUOTE_UUID}}'
  // },
  // {
  //   reason: 'Wallex Conversion - Postman - Fathoni',
  //   reference_id: 'ABCDEFG-00003',
  //   // quote_uuid: '{{QUOTE_UUID}}'
  // },
  // {
  //   reason: 'Wallex Conversion - Postman - Fathoni',
  //   reference_id: 'ABCDEFG-00004',
  //   // quote_uuid: '{{QUOTE_UUID}}'
  // },
  // {
  //   reason: 'Wallex Conversion - Postman - Fathoni',
  //   reference_id: 'ABCDEFG-00005',
  //   // quote_uuid: '{{QUOTE_UUID}}'
  // },
];

const dataFunding = [
  {
    amount: 1200000,
    funding_method: 'BANK_TRANSFER',
    currency: 'IDR',
    reference: 'POSTMAN',
    bank_account_number: '2612630888'
  },
  // {
  //   amount: 1200001,
  //   funding_method: 'BANK_TRANSFER',
  //   currency: 'IDR',
  //   reference: 'POSTMAN',
  //   bank_account_number: '2612630888'
  // },
  // {
  //   amount: 100000,
  //   funding_method: 'BANK_TRANSFER',
  //   currency: 'IDR',
  //   reference: 'POSTMAN',
  //   bank_account_number: '2612630888'
  // },
  // {
  //   amount: 1200000,
  //   funding_method: 'BANK_TRANSFER',
  //   currency: 'IDR',
  //   reference: 'POSTMAN',
  //   bank_account_number: '2612630888'
  // },
];

const dataLoginAdmin = {
    username: 'vito+admin@wallextech.com',
    password: password,
    action: 'login_admin'
};

let dataTransactionListForFundingAccept = {
    related_entity_type: 'funding',
    // related_entity_id: '{{TRANSACTION_FUNDING_ID}}'
    related_entity_id: null
};

const dataFundingAccept = [
  // {
  //   idtransactions: '{{TRANSACTION_ID}}'
  // },
];

const dataTransactionListForConversionCheck = [
  {
    related_entity_type: 'conversion',
    related_entity_id: '{{CONVERSION_ID}}'
  },
];

// init variables
let headers = [];
let quoteUUIDs = [];
let conversionIDs = [];
let fundingIDs = [];
let transactionIDs = [];

let headersAdmin;

let promiseRates;
let promiseConversion;
let promisefundingCreate;
let promiseTransactionAccept;

// Login
const login = (body) => {
  return rp({
    ...options,
    uri: '/api/users/login',
    body,
    method: 'POST'
  });
};

const promiseLogin = dataLogin.map(data => login(data));

// Conversion - Rate
const rates = (headers, body) => {
  return rp({
    ...options,
    uri: '/api/conversions/rates',
    body,
    method: 'POST',
    headers,
  });
};

// Conversion - Create
const conversion = (headers, body) => {
  return rp({
    ...options,
    uri: '/api/conversions/create',
    body,
    method: 'POST',
    headers,
  });
};

// Funding - Create
const fundingCreate = (headers, body) => {
  return rp({
    ...options,
    uri: '/api/funding/create',
    body,
    method: 'POST',
    headers,
  });
};

// Admin Transaction - List
const adminTransactionList = (headers, body) => {
  return rp({
    ...options,
    uri: '/admin/api/transactions/list',
    body,
    method: 'POST',
    headers,
  });
};

// Admin Transactions - Accept
const adminTransactionAccept = (headers, body) => {
  return rp({
    ...options,
    uri: '/admin/api/transactions/accept',
    body,
    method: 'POST',
    headers,
  });
};

// START TEST
const startTest = async () => {
  // login
  console.log('> LOGIN');
  const resultLogin = await Promise.all(promiseLogin);
  promiseRates = resultLogin.map((response, index) => {
    console.log('RESPONSE', { response });

    const header = { 'Authorization': response.token };
    headers.push(header);

    return rates(header, dataRates[index]);
  });

  console.log('headers', { headers });

  // rates
  console.log('> CONVERSION RATES');
  const resultRates = await Promise.all(promiseRates);
  console.log('RATES', { resultRates });

  // Conversion - Create
  console.log('> CONVERSION CREATE');
  promiseConversion = resultRates.map((response, index) => {
    console.log('RESPONSE Rates', { response });

    const quoteUUID = response.quote_uuid;
    quoteUUIDs.push(quoteUUID);

    dataConversion[index].quote_uuid = quoteUUID;

    return conversion(headers[index], dataConversion[index])
  });

  console.log('quoteUUIDs', { quoteUUIDs });

  // Funding - Create
  console.log('> FUNDING CREATE');
  promisefundingCreate = dataFunding.map((data, index) => {
    return fundingCreate(headers[index], data);
  });

  const resultFundingCreate = await Promise.all(promisefundingCreate);
  console.log('FUNDING CREATE', { resultFundingCreate });

  // Login Admin
  console.log('> LOGIN ADMIN');
  const resultLoginAdmin = await login(dataLoginAdmin);
  console.log('LOGIN ADMIN', { resultLoginAdmin });

  headersAdmin = { 'Authorization': resultLoginAdmin.token };
  console.log('headers Admin', { headersAdmin });

  // Transaction Accept
  console.log('> FUNDING ACCEPT');
  promiseTransactionAccept = resultFundingCreate.map((response, index) => {

    console.log('RESPONSE Funding Create', { response });

    // get funding id
    const fundingID = response.idfunding
    fundingIDs.push(fundingID);

    dataTransactionListForFundingAccept.related_entity_id = fundingID;
    console.log('dataTransactionListForFundingAccept: ', dataTransactionListForFundingAccept);
  // Admin Transaction - List

    // return adminTransactionList(headersAdmin, dataTransactionListForFundingAccept)

    const resultTransactionListForFundingAccept = adminTransactionList(headersAdmin, dataTransactionListForFundingAccept)
    console.log('resultTransactionListForFundingAccept: ', resultTransactionListForFundingAccept);

    return resultTransactionListForFundingAccept;
    // const transactionID = response.idfunding

    // dataFundingAccept[index].idtransactions = transactionID

    // return adminTransactionAccept(headersAdmin, dataFundingAccept[index]);
  });

  console.log('fundingIDs', fundingIDs);
  
  const resultTransactionAccept = await Promise.all(promiseTransactionAccept);
  console.log('FUNDING ACCEPT', { resultTransactionAccept });


};


startTest();
