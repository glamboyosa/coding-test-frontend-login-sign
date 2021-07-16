const express = require('express');
const cors = require('cors');
const { isValidAddress, isValidChecksumAddress } = require('ethereumjs-util');
const { recoverPersonalSignature, normalize } = require('eth-sig-util');
const { sign } = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.get('/token', (req, res) => {
  let nonce = Math.floor(Math.random() * 1000000).toString(); // in a real life scenario we would random this after each login and fetch it from the db as well
  return res.send(nonce);
});
app.post('/auth', (req, res) => {
  const { address, signature, nonce } = req.body;

  //  Validate signature by using eth tools 
  if (!isValidAddress(address) || !isValidChecksumAddress(address)) {
    return res.status(400).send({ message: 'Not a valid MetaMask address' });
  }
  const recoveredAddress = recoverPersonalSignature({
    data: nonce,
    sig: signature,
  });
  // normalize address before comparison so everything is lowercase hexadecimal 
  // could alterantively not use strict equality
  if (recoveredAddress !== normalize(address)) {
    return res.status(401).send({ message: 'Not Authorized to make login.' });
  }
  // user is authenticated. create token
  const token = sign({ address }, process.env.TOKEN, { expiresIn: '7d' });
  res.send(`Hello World! ${token}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
