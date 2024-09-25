import React, { useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar.jsx';
import { Helmet } from 'react-helmet';
import {Board} from '../components/BlockBoard/BlockBoard.jsx'
import { useHttp } from '../hooks/useHttp'; // Import the custom hook

export default function Actions() {
  const { data, error, loading, httpRequestHandler } = useHttp(); // Destructure values from the hook

  
  return (
    <>
      <Helmet>
        <title>Actions Page</title>
        <meta name="description" content="Description of Actions page" />
      </Helmet>

      <Navbar elementActive="actions" />

      <main className='main md:overflow-hidden lg:overflow-hidden'>
        <Board />

      </main>
    </>
  );
}
