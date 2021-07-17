import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { ethers } from 'ethers';
type ethereum = {
  request: ({ method }: { method: string }) => Promise<String[]>;
};
const Home = () => {
  const [nonce, setNonce] = useState<string | null>(null!);
  const [ethereum, setEthereum] = useState<ethereum>();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const getNonce = async () => {
    try {
      const response = await fetch('http://localhost:4000/token');

      const data = await response.text();

      console.log(data);

      setNonce(data);
    } catch (e) {
      Toastify({
        text: e.message,
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: '#ff5733',
        stopOnFocus: true,
      }).showToast();
    }
  };
  // `useEffect` for getting the nonce from the server
  useEffect(() => {
    getNonce();
  }, []);
  // verify if browser is running metamask
  useEffect(() => {
    const browserWindow = window as any;
    if (typeof browserWindow.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');

      setEthereum(browserWindow.ethereum);
    }
  }, []);
  const loginHandler = async () => {
    setLoading(true);
    const browserWindow = window as any;
    try {
      // get user acoount
      const accounts = await ethereum!.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];

      console.log(account);
      // get ethers provider and signer
      const provider = new ethers.providers.Web3Provider(
        browserWindow.ethereum,
      );
      const signer = provider.getSigner();
      // get the address
      const address = await signer.getAddress();
      console.log('wallet address is');
      console.log(address);
      // sign token from server
      const signature = await signer.signMessage(nonce!);

      console.log('signature is');
      console.log(signature);

      const body = JSON.stringify({ signature, nonce, address });
      const response = await fetch('http://localhost:4000/auth', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.text();
      console.log(data);
      // if data has a :  that means we have a 400 oe 401
      if (data.includes(':')) {
        setLoading(false);
        const error = JSON.parse(data) as { message: string };
        Toastify({
          text: error.message,
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'center',
          backgroundColor: '#ff5733',
          stopOnFocus: true,
        }).showToast();
        return;
      }
      // render a success toast and save token to state
      setLoading(false);
      Toastify({
        text: 'Successfully logged in.',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: '#15f93e',
        stopOnFocus: true,
      }).showToast();
      setToken(data.split('!')[1].trim());
    } catch (e) {
      Toastify({
        text: e.message,
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: '#ff5733',
        stopOnFocus: true,
      }).showToast();
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Refinable + Metabase.</h1>
        <p className={[styles.description, styles.marginutility].join(' ')}>
          Login Authentication Challenge.
        </p>
        {token && (
          <p className={[styles.token, styles.marginutility].join(' ')}>
            {token}
          </p>
        )}
        <button
          disabled={loading}
          className={styles.button}
          onClick={loginHandler}
        >
          Login
        </button>
      </main>
    </div>
  );
};
export default Home;
