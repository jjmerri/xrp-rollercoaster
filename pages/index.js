import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import CryptoChart from '../components/CryptoChart';
import ReactGA from 'react-ga';
import { cryptoHistory } from '../services/apiService';
import { getHistoricalData } from '../services/cryptoCompareService';

const Container = styled.div`
  padding-right: 15px;
  padding-left: 15px;
  padding-right: auto;
  padding-left: auto;
  padding-top: 2rem;
  text-align: center;
`;

const ImageContainer = styled(Container)`
  padding-bottom: 3rem;
`;

const RotatedImage = styled.img`
  -webkit-transform: rotate(${(props) => props.rotation}deg);
  -moz-transform: rotate(${(props) => props.rotation}deg);
  -ms-transform: rotate(${(props) => props.rotation}deg);
  -o-transform: rotate(${(props) => props.rotation}deg);
  transform: rotate(${(props) => props.rotation}deg);
  height: 300px;
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

  return rotation * -1;
};

export async function getServerSideProps(context) {
  const initialHistData = await getHistoricalData('XRP', 'USD', 12);
  return {
    props: { initialHistData },
  };
}

const Home = ({ initialHistData }) => {
  const [histData, setHistData] = useState(initialHistData);
  const [currency, setCurrency] = useState('USD');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    document.body.style.margin = 0;
    document.body.style.backgroundImage = 'url("background.jpg")';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    ReactGA.initialize('UA-163121450-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    //prevent recalling API on initial render
    if (!initialLoad) {
      updateHistoricalData();
    } else {
      setInitialLoad(false);
    }
  }, [currency]);

  const updateHistoricalData = async () => {
    setHistData(await cryptoHistory('XRP', currency, 12));
  };

  const handleCurrencyChange = async (e) => {
    setCurrency(e.target.value);
  };

  return (
    <Container>
      <Head>
        <title>XRP Rollercoaster</title>
        <link rel='icon' href='/favicon.png' />
        <meta name='monetization' content='$reddit.xrptipbot.com/BoyAndHisBlob' />>
      </Head>

      <main>
        <ImageContainer>
          <RotatedImage src='/xrp-rollercoaster.gif' alt='xrp rollercoaster' rotation={calculateRotation(histData)} />
        </ImageContainer>
        <select onChange={handleCurrencyChange} value={currency} class='select-css'>
          <option value='USD'>USD</option>
          <option value='BTC'>BTC</option>
          <option value='AUD'>AUD</option>
          <option value='CAD'>CAD</option>
          <option value='EUR'>EUR</option>
          <option value='GBP'>GBP</option>
        </select>
        <Container>
          <CryptoChart currency={currency} histData={histData} />
        </Container>
      </main>
    </Container>
  );
};

export default Home;
