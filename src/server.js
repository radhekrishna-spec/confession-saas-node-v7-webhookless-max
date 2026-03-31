require('dotenv').config();
const express = require('express');
const { startAllWorkers } = require('./workers');
const debug = require('./services/debugService');

const formService = require('./services/formService');
const app = express();
app.use(express.json());

app.get('/', (_,res)=>res.send('v7 webhookless max running'));
app.get('/health', (_,res)=>res.json(debug.healthCheck()));

app.post('/submit', async (req, res) => {
  const result = await formService.handleSubmit(req.body.text);
  res.json(result);
});

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
  console.log('running', port);
  startAllWorkers();
});