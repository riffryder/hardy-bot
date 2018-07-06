/* Data provided for free by IEX (https://iextrading.com/developer) .View IEX’s Terms of Use(https://iextrading.com/api-exhibit-a/) */
const actions = require('../../react-client/src/actions/types');
const particleHelpers = require('../helpers/particleHelpers.js');

require('dotenv').config();
const express = require('express');

const router = express.Router();

// add EventSource dependency
const streamdataio = require('streamdataio-js-sdk/dist/bundles/streamdataio-node');
// add json patch dependency
const jsonPatch = require('fast-json-patch');

// appToken is the way Streamdata.io authenticates you as a valid user.
// you MUST provide a valid token for your request to go through.
const appToken = process.env.STREAMDATA_STOCKS;

let mapParticle = (symbols) => {
  return Object.keys(symbols).map((symbol) => {
    return {
      Symbol: symbol,
      Price: String(symbols[symbol].quote.latestPrice),
    };
  });
};

let eventSource;

router.get('/api/stocks', (req, res) => {
  // hardcoded stock symbol for testing
  let symbols = 'aapl,fb,googl,amzn';
  let targetUrl = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbols}&types=quote`;

  eventSource = streamdataio.createEventSource(targetUrl, appToken);
  let result;
  const io = req.app.get('socketio');
  io.emit('action', { type: actions.STOCK_REQUEST_RECEIVED });

  eventSource
    // the standard 'open' callback will be called when connection is established with the server
    .onOpen(() => {
      console.log('connected!');
    })
    // the streamdata.io specific 'data' event will be called when a fresh Json data set
    // is pushed by Streamdata.io coming from the API
    .onData((data) => {
      console.log('data received');
      // memorize the fresh data set
      result = data;
      console.log(result);
      particleHelpers.sendEventData('stocks', mapParticle(data), req.session.particleToken);
      io.emit('action', { type: actions.STOCK_DATA_RECEIVED, data: { data } });
    })
    // the streamdata.io specific 'patch' event will be called when a fresh Json patch
    // is pushed by streamdata.io from the API. This patch has to be applied to the
    // latest data set provided.
    .onPatch((patch) => {
      // display the patch
      console.log('patch: ', patch);
      // apply the patch to data using json patch API
      jsonPatch.applyPatch(result, patch);
      // do whatever you wish with the update data
      // console.log(result);
      const data = result;
      particleHelpers.sendEventData('stocks', mapParticle(data), req.session.particleToken);
      io.emit('action', { type: actions.STOCK_DATA_UPDATE, data: { data } });
    })

    // the standard 'error' callback will be called when an error occur with the evenSource
    // for example with an invalid token provided
    .onError((error) => {
      console.log('ERROR!', error);
      io.emit('action', { type: actions.STOCK_REQUEST_ERROR, data: error });
      eventSource.close();
    });

  eventSource.open();

  res.status(200).end('Stock polling started');
});

router.get('/api/stocks/close', (req, res) => {
  eventSource.close();
  res.status(200).end('Stock polling stopped');
});

module.exports = router;
