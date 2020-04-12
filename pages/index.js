import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import CryptoChart from '../components/CryptoChart';
import ReactGA from 'react-ga';
import { cryptoHistory } from '../services/apiService';
import { getHistoricalData } from '../services/cryptoCompareService';
import { TimeUnits } from '../consts/TimeUnits';
import { CurrencyCodes } from '../consts/CurrencyCodes';

const Container = styled.div`
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 2rem;
  text-align: center;
`;

const ChartControlsContainer = styled.div`
  padding-top: 2rem;
  text-align: left;
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
  const initialHistData = await getHistoricalData('XRP', CurrencyCodes.USD, TimeUnits.HOURS);
  return {
    props: { initialHistData },
  };
}

const Home = ({ initialHistData }) => {
  const [histData, setHistData] = useState(initialHistData);
  const [currency, setCurrency] = useState(CurrencyCodes.USD);
  const [timeUnits, setTimeUnits] = useState(TimeUnits.HOURS);
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
  }, [currency, timeUnits]);

  const updateHistoricalData = async () => {
    setHistData(await cryptoHistory('XRP', currency, timeUnits));
  };

  const handleCurrencyChange = async (e) => {
    setCurrency(e.target.value);
  };
  const handleTimeUnitsChange = async (e) => {
    setTimeUnits(e.target.value);
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
        <ChartControlsContainer>
          <select
            onChange={handleCurrencyChange}
            value={currency}
            className='select-css'
            style={{ marginLeft: '7rem' }}>
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
        <Container>
          <CryptoChart currency={currency} histData={histData} timeUnits={timeUnits} />
        </Container>
      </main>
    </Container>
  );
};

export default Home;
