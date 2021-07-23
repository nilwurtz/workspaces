import 'ress';

import App, { AppContext } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';

import store from '../store';

const GlobalStyle = createGlobalStyle`
  *, :before, :after{
    box-sizing:border-box;
  }
  html {
    font-size:62.5%;
    word-wrap: break-word;
  }
  body {
    line-height: 1.4;
    color: black;
    background-color: white;
    font-family: 'Noto Sans JP', "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ", Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
    position: relative;
  }
`;

export default class extends App {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render(): JSX.Element {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <GlobalStyle />
        <Component {...pageProps} />
      </Provider>
    );
  }
}
