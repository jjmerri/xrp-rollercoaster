import Head from "next/head";
import styled from "styled-components";
import { useEffect } from "react";
import getConfig from "next/config";
import axios from "axios";
import CryptoChart from "../components/CryptoChart";

const { serverRuntimeConfig } = getConfig();

const Background = styled.div`
  background-image: url("background2.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RotatedImage = styled.img`
  -webkit-transform: rotate(${(props) => props.rotation}deg);
  -moz-transform: rotate(${(props) => props.rotation}deg);
  -ms-transform: rotate(${(props) => props.rotation}deg);
  -o-transform: rotate(${(props) => props.rotation}deg);
  transform: rotate(${(props) => props.rotation}deg);
  height: 300px;
  margin-top: 3rem;
  margin-bottom: 2.5rem;
  margin-left: 8rem;
`;

const calculateRotation = (histData) => {
  const maxChange = 0.1; // a 10% change fully rotates the image
  let rotation = 0;

  const previousPrice = histData.Data.Data[0].close;
  const currentPrice = histData.Data.Data[histData.Data.Data.length - 1].close;
  const change = currentPrice - previousPrice;
  const percentChange = change / previousPrice;

  if (percentChange > 0) {
    rotation = Math.min(percentChange / maxChange, 1) * 90;
  } else {
    rotation = Math.max(percentChange / maxChange, -1) * 90;
  }

  return 90 - rotation;
};

export async function getServerSideProps(context) {
  const histData = await axios
    .get(
      "https://min-api.cryptocompare.com/data/v2/histohour?fsym=XRP&tsym=USD&limit=12",
      {
        headers: {
          authorization: `Apikey ${serverRuntimeConfig.cryptoCompareApiKey}`,
        },
      }
    )
    .then((response) => response.data);
  return {
    props: { histData },
  };
}

const Home = ({ histData }) => {
  useEffect(() => {
    document.body.style.margin = 0;
  }, []);

  return (
    <Background>
      <Container>
        <Head>
          <title>XRP Rollercoaster</title>
          <link rel="icon" href="/favicon.png" />
        </Head>

        <main>
          <RotatedImage
            src="/xrp-rollercoaster.gif"
            alt="xrp rollercoaster"
            rotation={calculateRotation(histData)}
          />
          <CryptoChart histData={histData} />
        </main>
      </Container>
    </Background>
  );
};

export default Home;
