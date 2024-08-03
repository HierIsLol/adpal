import React from 'react';

const StoreLinkPage: React.FC = () => {
  return (
    <div style={{ width: '434px', height: '886px', position: 'relative', background: 'white', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '434px', height: '886px', left: '0px', top: '0px', position: 'absolute', background: '#EEEEEE' }}></div>
      <div style={{ width: '361px', height: '65px', left: '36px', top: '225px', position: 'absolute', background: 'white', borderRadius: '32.50px' }}></div>
      <div style={{ width: '269px', height: '29px', left: '82px', top: '243px', position: 'absolute', color: 'black', fontSize: '26px', fontWeight: 700, lineHeight: '26px', wordWrap: 'break-word' }}>↓Volg de instructies</div>
      <div style={{ width: '321px', height: '76px', left: '57px', top: '746px', position: 'absolute', background: '#003366', borderRadius: '17px' }}></div>
      <div style={{ width: '321px', height: '76px', left: '57px', top: '746px', position: 'absolute', background: 'rgba(0, 51, 102, 0)', borderRadius: '17px' }}></div>
      <div style={{ width: '297px', height: '186px', left: '69px', top: '313px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontWeight: 700, lineHeight: '20px', wordWrap: 'break-word' }}>Om verbinding te kunnen maken met je store hebben wij een koppelingsnummer nodig.</div>
      <div id="koppelButton" style={{ width: '254px', height: '29px', left: '91px', top: '769px', position: 'absolute', color: 'white', fontSize: '26px', fontWeight: 700, lineHeight: '26px', wordWrap: 'break-word', cursor: 'pointer' }}>↓Koppel mijn store!</div>
      <div style={{ width: '153px', height: '76px', left: '224px', top: '600px', position: 'absolute', background: 'white', borderRadius: '17px' }}></div>
      <div style={{ width: '122px', height: '29px', left: '240px', top: '614px', position: 'absolute', textAlign: 'center', color: '#003366', fontSize: '26px', fontWeight: 700, lineHeight: '26px', wordWrap: 'break-word' }}>Client ID:</div>
      <div style={{ width: '153px', height: '76px', left: '46px', top: '600px', position: 'absolute', background: 'white', borderRadius: '17px' }}></div>
      <div style={{ width: '137px', height: '29px', left: '54px', top: '609px', position: 'absolute', textAlign: 'center', color: '#003366', fontSize: '26px', fontWeight: 700, lineHeight: '26px', wordWrap: 'break-word' }}>Client secret:</div>
      <div style={{ width: '361px', height: '0px', left: '37px', top: '394px', position: 'absolute', border: '1px black solid' }}></div>
      <img src="https://i.postimg.cc/Mp8Whhmw/Ad-Pal-logo-no-white.png" style={{ width: '188px', height: '188px', left: '123px', top: '37px', position: 'absolute' }} alt="AdPal Logo"/>
      <img src="https://i.postimg.cc/Z0fzBD27/ezgif-5-675330dec9-kopie.gif" style={{ width: '316px', height: '164px', left: '59px', top: '418px', position: 'absolute' }} alt="GIF"/>
      <input id="clientSecret" type="text" style={{ width: '140px', height: '30px', left: '53px', top: '685px', position: 'absolute', textAlign: 'center' }} placeholder="Vul je Client Secret in" />
      <input id="clientId" type="text" style={{ width: '140px', height: '30px', left: '231px', top: '685px', position: 'absolute', textAlign: 'center' }} placeholder="Vul je Client ID in" />
      <div id="result" style={{ position: 'absolute', top: '830px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', fontWeight: 'bold' }}></div>
    </div>
  );
};

export default StoreLinkPage;
