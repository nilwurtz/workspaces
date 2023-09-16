import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div>Loading...</div  >
      <Component {...pageProps} />
    </>
  );
}

// export default function MyApp({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }
