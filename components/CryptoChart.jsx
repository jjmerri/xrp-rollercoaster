import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        id="cryptoLineChart"
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
    </ResponsiveContainer>
  );
};

export default CryptoChart;
