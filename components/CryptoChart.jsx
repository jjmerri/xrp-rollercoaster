import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { TimeUnits } from '../consts/TimeUnits';
import { CurrencyCodes } from '../consts/CurrencyCodes';

const ChartControlsContainer = styled.div`
  padding-bottom: 2rem;
  text-align: left;
`;

const currencySymbols = { USD: '$', BTC: '₿', AUD: '$', CAD: '$', EUR: '€', GBP: '£' };

const getChartData = (histData, timeUnits) => {
  let formatTime;
  switch (timeUnits) {
    case TimeUnits.MINUTES:
      formatTime = (datetime) => datetime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      break;
    case TimeUnits.HOURS:
      formatTime = (datetime) => datetime.toLocaleString('en-US', { hour: 'numeric', hour12: true });
      break;
    case TimeUnits.DAYS:
      formatTime = (datetime) => datetime.toLocaleString('en-US', { day: '2-digit', month: '2-digit' });
      break;
  }

  return histData.Data.Data.map((data) => {
    return {
      name: formatTime(new Date(data.time * 1000)),
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

const CryptoChart = ({ histData, updateData }) => {
  const [precision, setPrecision] = useState(4);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [currency, setCurrency] = useState(CurrencyCodes.USD);
  const [timeUnits, setTimeUnits] = useState(TimeUnits.HOURS);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    setPrecision(calculatePrecision(histData));
  }, [histData]);

  useEffect(() => {
    setCurrencySymbol(currencySymbols[currency]);
  }, [currency]);

  useEffect(() => {
    if (!initialLoad) {
      updateData(currency, timeUnits);
    } else {
      setInitialLoad(false);
    }
  }, [currency, timeUnits]);

  const handleCurrencyChange = async (e) => {
    setCurrency(e.target.value);
  };
  const handleTimeUnitsChange = async (e) => {
    setTimeUnits(e.target.value);
  };

  return (
    <>
      <ChartControlsContainer>
        <select
          onChange={handleCurrencyChange}
          value={currency}
          className='select-css'
          style={{ marginLeft: `${4 + 0.5 * precision}rem` }}>
          {Object.keys(CurrencyCodes).map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        <select
          onChange={handleTimeUnitsChange}
          value={timeUnits}
          className='select-css'
          style={{ marginLeft: '2rem' }}>
          <option value={TimeUnits.MINUTES}>Mins</option>
          <option value={TimeUnits.HOURS}>Hours</option>
          <option value={TimeUnits.DAYS}>Days</option>
        </select>
      </ChartControlsContainer>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart
          id='cryptoLineChart'
          data={getChartData(histData, timeUnits)}
          margin={{
            right: 10,
            left: 7 + 8 * precision,
            bottom: 40,
          }}>
          <CartesianGrid />
          <XAxis dataKey='name' label={<Label value={timeUnits} position='bottom' fill='gray' />} />
          <YAxis
            domain={[
              (dataMin) => (dataMin * 0.95).toFixed(precision),
              (dataMax) => (dataMax * 1.05).toFixed(precision),
            ]}
            tickFormatter={(tick) => `${currencySymbol}${tick.toFixed(precision)}`}
            label={<Label value={currency} angle={-90} position='left' offset={8 * (precision - 1)} fill='gray' />}
          />
          <Tooltip formatter={(value) => [`${currencySymbol}${value}`, '']} separator={''} />
          <Line type='monotone' dataKey='price' />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default CryptoChart;
