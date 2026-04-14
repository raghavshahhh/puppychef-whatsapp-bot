// n8n Integration for RAGSPRO WhatsApp Agent
// Sends leads, conversations, and events to n8n workflows

const https = require('https');
const http = require('http');

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const N8N_WEBHOOK_KEY = process.env.N8N_WEBHOOK_KEY;

// Lead data structure
const leads = new Map();

// Send data to n8n webhook
async function sendToN8n(data) {
  if (!N8N_WEBHOOK_URL) {
    console.log('[N8N] Webhook URL not configured, skipping');
    return { success: false, reason: 'N8N_WEBHOOK_URL not set' };
  }

  return new Promise((resolve) => {
    const url = new URL(N8N_WEBHOOK_URL);
    const postData = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
      source: 'ragspro-whatsapp-agent',
      version: '2.0.0'
    });

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Key': N8N_WEBHOOK_KEY || '',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const client = url.protocol === 'https:' ? https : http;

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`[N8N] Response: ${res.statusCode}`);
        resolve({ success: res.statusCode === 200, status: res.statusCode, data });
      });
    });

    req.on('error', (err) => {
      console.error('[N8N] Error:', err.message);
      resolve({ success: false, error: err.message });
    });

    req.write(postData);
    req.end();
  });
}

// Track new lead
async function trackLead(phone, source = 'whatsapp') {
  const lead = {
    phone,
    source,
    firstContact: new Date().toISOString(),
    status: 'new',
    tags: [],
    conversationCount: 1
  };

  leads.set(phone, lead);

  // Send to n8n
  await sendToN8n({
    event: 'lead.new',
    lead
  });

  return lead;
}

// Update lead
async function updateLead(phone, updates) {
  const lead = leads.get(phone);
  if (!lead) return null;

  Object.assign(lead, updates);
  lead.lastUpdated = new Date().toISOString();

  await sendToN8n({
    event: 'lead.update',
    lead
  });

  return lead;
}

// Track conversation
async function trackConversation(phone, message, intent, response) {
  const lead = leads.get(phone);
  if (!lead) {
    await trackLead(phone);
  } else {
    lead.conversationCount = (lead.conversationCount || 0) + 1;
  }

  await sendToN8n({
    event: 'conversation.new',
    phone,
    message: message.substring(0, 500), // Truncate long messages
    intent,
    responseLength: response?.length || 0,
    leadStatus: lead?.status || 'new'
  });
}

// Track call booking
async function trackCallBooking(phone, bookingDetails) {
  const updates = {
    status: 'call_booked',
    callBookedAt: new Date().toISOString(),
    callDetails: bookingDetails
  };

  await updateLead(phone, updates);

  await sendToN8n({
    event: 'lead.call_booked',
    phone,
    booking: bookingDetails
  });
}

// Track qualified lead (showed interest in paying)
async function trackQualifiedLead(phone, serviceInterest, estimatedValue) {
  await updateLead(phone, {
    status: 'qualified',
    serviceInterest,
    estimatedValue,
    qualifiedAt: new Date().toISOString()
  });

  await sendToN8n({
    event: 'lead.qualified',
    phone,
    serviceInterest,
    estimatedValue
  });
}

// Get lead status
function getLead(phone) {
  return leads.get(phone) || null;
}

// Get all leads (for admin)
function getAllLeads() {
  return Array.from(leads.entries()).map(([phone, data]) => ({
    phone,
    ...data
  }));
}

// Cleanup old leads (30 days)
setInterval(() => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  for (const [phone, lead] of leads) {
    const lastUpdate = new Date(lead.lastUpdated || lead.firstContact).getTime();
    if (lastUpdate < thirtyDaysAgo) {
      leads.delete(phone);
    }
  }
}, 24 * 60 * 60 * 1000); // Daily cleanup

module.exports = {
  trackLead,
  updateLead,
  trackConversation,
  trackCallBooking,
  trackQualifiedLead,
  getLead,
  getAllLeads,
  sendToN8n
};
