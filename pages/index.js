import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState, useCallback } from 'react';
import CryptoChart from '../components/CryptoChart';
import ReactGA from 'react-ga';
import { cryptoHistory } from '../services/apiService';
import { getHistoricalData } from '../services/cryptoCompareService';
import { TimeUnits } from '../consts/TimeUnits';
import { CurrencyCodes } from '../consts/CurrencyCodes';
import Footer from 'rc-footer';

const Container = styled.div`
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 2rem;
  text-align: center;
  min-height: calc(100vh - 32px);
`;
const ChartContainer = styled.div`
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 2rem;
  padding-bottom: 10rem;
  text-align: center;
`;

const ImageContainer = styled.div`
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 2rem;
  padding-bottom: 3rem;
  text-align: center;
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

  useEffect(() => {
    document.body.style.margin = '0';

    ReactGA.initialize('UA-163121450-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const updateHistoricalData = useCallback(async (currency, timeUnits) => {
    setHistData(await cryptoHistory('XRP', currency, timeUnits));
  }, []);

  return (
    <>
      <Head>
        <title>XRP Rollercoaster</title>
        <link rel='icon' href='/favicon.png' />
        <meta name='monetization' content='$ilp.uphold.com/MLmWKGEgJR82' />
      </Head>

      <main>
        <img alt='starry background image' src='background.jpg' className='full-screen-background-image' />
        <Container>
          <ImageContainer>
            <RotatedImage src='/xrp-rollercoaster.gif' alt='xrp rollercoaster' rotation={calculateRotation(histData)} />
          </ImageContainer>
          <ChartContainer>
            <CryptoChart histData={histData} updateData={updateHistoricalData} />
          </ChartContainer>
        </Container>
        <Footer
          className='override-rc-footer'
          columns={[
            {
              className: 'override-rc-footer-column',
              title: 'CONTACT',
              items: [
                {
                  title: 'BlobWare42@gmail.com',
                  url: 'mailto:BlobWare42@gmail.com',
                  openExternal: true,
                },
                {
                  title: 'PM BoyAndHisBlob on Reddit',
                  url: 'https://www.reddit.com/message/compose/?to=BoyAndHisBlob',
                  openExternal: true,
                },
              ],
            },
            {
              className: 'override-rc-footer-column',
              title: 'SUPPORT',
              items: [
                {
                  title: 'Tip in crypto',
                  url: 'https://blobware-tips.firebaseapp.com/',
                  openExternal: true,
                },
                {
                  title: 'Web Monetized with Coil',
                  url: 'https://coil.com/explore',
                  openExternal: true,
                },
              ],
            },
            {
              className: 'override-rc-footer-column',
              title: 'PROJECTS',
              items: [
                {
                  title: 'GitHub',
                  url: 'https://github.com/jjmerri',
                  openExternal: true,
                },
                {
                  title: 'Dropchat',
                  url: 'https://chrome.google.com/webstore/detail/dropchat/eaejhpdjaoedfbbnajilifkhdngdgbno?hl=en-US',
                  openExternal: true,
                },
              ],
            },
          ]}
          bottom={
            <a style={{ color: '#808080' }} href='https://github.com/jjmerri/xrp-rollercoaster' target='_blank'>
              xrprollercoaster.com source
            </a>
          }
        />
      </main>
    </>
  );
};

export default Home;
