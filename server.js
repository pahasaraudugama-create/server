const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock Database (In production, use MongoDB or PostgreSQL)
const VALID_KEYS = {
  'LP-S-PRO-001': { tier: 'SINGLE', terminalId: null },
  'LP-M-ENT-999': { tier: 'MULTI', terminalId: null },
};

app.post('/api/license/activate', (req, res) => {
  const { key, terminalId } = req.body;

  const license = VALID_KEYS[key];

  if (!license) {
    return res.status(404).json({ message: 'Invalid License Key' });
  }

  // Bind the key to the hardware if it's the first time
  if (license.terminalId === null) {
    license.terminalId = terminalId;
  } else if (license.terminalId !== terminalId) {
    return res.status(403).json({ message: 'Key already bound to another terminal' });
  }

  res.json({
    status: 'active',
    tier: license.tier,
    expiryDate: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 Year from now
  });
});

app.listen(3001, () => console.log('License server running on port 3001'));
