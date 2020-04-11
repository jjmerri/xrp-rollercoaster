import axios from 'axios';

export const cryptoHistory = async (crypto, currency, limit) => {
  return await axios
    .get(`/api/cryptoHistory?crypto=${crypto}&currency=${currency}&limit=${limit}`)
    .then(response => response.data);
};
