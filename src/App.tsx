import React, { Suspense, useState } from 'react';
import { HashRouter, Route, RouterProvider, Routes, createHashRouter } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';
import './App.scss';
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";


const Login = React.lazy(() => import('./pages/login'));
const DefaultLayout = React.lazy(() => import('./defaultLayout/defaultLayout'));

const loading =
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className='loader' >
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
  </div>;

const App = () => {


  const router = createHashRouter([

    {
      path: '/',
      element: <Login />,
    },
    {
      path: '*',
      element: <DefaultLayout children/>,
      
    }
  
  ]);

  return (
    <>
      <Suspense fallback={loading}>
        <RouterProvider router={router} />
      </Suspense>


    </>
  );
};

export default App;
