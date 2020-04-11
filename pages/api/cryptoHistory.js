import { getHistoricalData } from '../../services/cryptoCompareService';

export default async (req, res) => {
  const { crypto, currency, limit } = req.query;
  const histData = await getHistoricalData(crypto, currency, limit);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(histData));
};
