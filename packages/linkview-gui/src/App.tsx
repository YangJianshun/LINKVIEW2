import React from 'react';
import './App.css';
import { PageHeader, Row, Col, Alert } from 'antd';
import ParamsInput from './components/ParamsInput';
import { GithubOutlined, DownloadOutlined } from '@ant-design/icons';
import initOptions from './initOptions';
import { main, Options } from '@linkview/linkview-core';
import { useState } from 'react';

function App() {
  const [svg, setSvg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const onSubmit = async (userOptions: Options) => {
    const options = {...initOptions};
    Object.assign(options, userOptions);
    console.log('options', options);
    try {
      const svg = await main(options) || '';
      console.log('optionsAfter', JSON.stringify(options));
      console.log(svg);
      setSvg(svg);
      setErrMsg('');
    } catch(error) {
      console.log((error as Error).message);
      setSvg('');
      setErrMsg((error as Error).message);
    }
  }
  // const save = () => {
  //   const a = document.createElement
  // }
  return (
    <div className='App'>
      <PageHeader
        className='head'
        title='LINKVIEW2'
        subTitle='A simple visualization tool for DNA sequence alignments.'
        extra={[
          <a
            href='https://github.com/YangJianshun/LINKVIEW2'
            className='github-icon'
            key='github'
          >
            <GithubOutlined />
          </a>,
        ]}
      >
        <p className='supplement'>
          This pure front-end page is the graphical interface of LINKVIEW2 and
          has almost all the functions of the LINKVIEW2 command line tool.
        </p>
      </PageHeader>

      <Row className={'main-container'}>
        <Col span={10} offset={1}>
          <ParamsInput onSubmit={onSubmit} />
        </Col>
        <Col span={10} offset={1}>
          <div className='display-container' key='svg'>
            {errMsg ? (
              <Alert
                message='LINKVIEW2 Error'
                description={
                  <code style={{ whiteSpace: 'pre-wrap' }}>{errMsg}</code>
                }
                type='error'
                closable
                className='error'
              />
            ) : (
              <a
                href={`data:text/plain;charset=utf-8,${svg.replaceAll(
                  '#',
                  '%23'
                )}`}
                download='linkview.svg'
                className='download'
              >
                <DownloadOutlined />
              </a>
            )}

            <div
              className='svg-container'
              dangerouslySetInnerHTML={{ __html: svg }}
            ></div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;

