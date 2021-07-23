import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    //https://github.com/zeit/next.js/blob/master/examples/with-typescript-styled-components/pages/_document.tsx
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <meta name="viewport" content="width=device-width,height=device-height" key="viewport" />
          <link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP&display=swap" rel="stylesheet"></link>
        </Head>

        <body>
          <Main />

          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
