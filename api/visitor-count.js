const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

// GA4 配置
const GA4_CONFIG = {
  propertyId: process.env.GA4_PROPERTY_ID,
  clientEmail: process.env.GA4_CLIENT_EMAIL,
  privateKey: process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// 創建 JWT client
const getJwtClient = () => {
  const jwtClient = new google.auth.JWT(
    GA4_CONFIG.clientEmail,
    null,
    GA4_CONFIG.privateKey,
    ['https://www.googleapis.com/auth/analytics.readonly']
  );
  return jwtClient;
};

// 獲取訪客數據
const getVisitorCount = async () => {
  try {
    const jwtClient = getJwtClient();
    await jwtClient.authorize();

    const analyticsDataClient = google.analyticsdata({
      version: 'v1beta',
      auth: jwtClient,
    });

    const response = await analyticsDataClient.properties.runReport({
      property: `properties/${GA4_CONFIG.propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '2020-01-01',
          endDate: 'today',
        }],
        metrics: [{
          name: 'totalUsers',
        }],
      },
    });

    return {
      count: parseInt(response.data.rows[0].metricValues[0].value),
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    throw error;
  }
};

module.exports = async (req, res) => {
  try {
    // 設置 CORS 頭
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const data = await getVisitorCount();
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 