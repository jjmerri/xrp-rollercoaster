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
      width={500}
      height={300}
      data={getChartData(histData)}
    >
      <CartesianGrid />
      <XAxis dataKey="name" />
      <YAxis
        domain={[(dataMin) => dataMin * 0.95, (dataMax) => dataMax * 1.05]}
      />
      <Tooltip />
      <Line type="monotone" dataKey="price" />
    </LineChart>
  );
};

export default CryptoChart;
