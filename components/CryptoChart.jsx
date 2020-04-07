import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const getChartData = (histData) => {
  return histData.Data.Data.map((data) => {
    const datetime = new Date(data.time * 1000);
    return {
      name: datetime.toLocaleString("en-US", { hour: "numeric", hour12: true }),
      price: data.close,
    };
  });
};

const CryptoChart = ({ histData }) => {
  return (
    <LineChart
      id="cryptoLineChart"
      width={700}
      height={300}
      data={getChartData(histData)}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid />
      <XAxis dataKey="name" />
      <YAxis
        domain={[
          (dataMin) => (dataMin * 0.95).toFixed(4),
          (dataMax) => (dataMax * 1.05).toFixed(4),
        ]}
      />
      <Tooltip />
      <Line type="monotone" dataKey="price" />
    </LineChart>
  );
};

export default CryptoChart;
