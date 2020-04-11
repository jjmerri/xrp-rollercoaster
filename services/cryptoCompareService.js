import axios from 'axios';

export const getHistoricalData = async (crypto, currency, limit) => {
  return await axios
    .get(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=${crypto}&tsym=${currency}&limit=${limit}`, {
      headers: {
        authorization: `Apikey ${process.env.cryptoCompareApiKey}`,
      },
    })
    .then(response => response.data);
};
