import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

const currencySymbol = { USD: '$', BTC: '₿', AUD: '$', CAD: '$', EUR: '€', GBP: '£' };

const getChartData = (histData) => {
  return histData.Data.Data.map((data) => {
    const datetime = new Date(data.time * 1000);
    return {
      name: datetime.toLocaleString('en-US', { hour: 'numeric', hour12: true }),
      price: data.close,
    };
  });
};

const calculatePrecision = (histData) => {
  const price = histData.Data.Data[0].close;
  let precision = 0;
  if (price < 1) {
    // .123 = 0; .00001234 = 4
    const magnitude = -Math.floor(Math.log10(price)) - 1;

    //get 4 digits after 0s
    precision = magnitude + 4;
  } else {
    // 1 = 1; 100 = 3
    precision = Math.floor(Math.log10(price)) + 1;
  }

  //min precision of 4
  return Math.max(precision, 4);
};

const CryptoChart = ({ histData, currency }) => {
  const [precision, setPrecision] = useState(4);
  const [symbol, setSymbol] = useState('$');

  useEffect(() => {
    setPrecision(calculatePrecision(histData));
  }, [histData]);

  useEffect(() => {
    setSymbol(currencySymbol[currency]);
  }, [currency]);

  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart
        id='cryptoLineChart'
        data={getChartData(histData)}
        margin={{
          right: 10,
          left: 7 + 8 * precision,
          bottom: 40,
        }}>
        <CartesianGrid />
        <XAxis dataKey='name' label={<Label value='HOURS' position='bottom' fill='gray' />} />
        <YAxis
          domain={[(dataMin) => (dataMin * 0.95).toFixed(precision), (dataMax) => (dataMax * 1.05).toFixed(precision)]}
          tickFormatter={(tick) => `${symbol}${tick.toFixed(precision)}`}
          label={<Label value={currency} angle={-90} position='left' offset={8 * (precision - 1)} fill='gray' />}
        />
        <Tooltip formatter={(value) => [`${symbol}${value}`, '']} separator={''} />
        <Line type='monotone' dataKey='price' />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CryptoChart;
