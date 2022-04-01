import React from 'react';
import { useSelector } from "react-redux";
import './App.css';

import Header from './components/layout/Header';
import Alert from './components/Alert';
import SuccessModal from './components/modal/SuccessModal';
import Routes from './routes';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingOverlay from 'react-loading-overlay';
import Auth from './Auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const isLoading = useSelector(state => state.load.loader);

  return (
    <LoadingOverlay active={isLoading} spinner text='Please do not close the browser and wait for the transaction to be completed to avoid possible token loss.'>
      <ToastContainer pauseOnFocusLoss={false} autoClose={5000} hideProgressBar={false} closeOnClick />
      <Router basename='/admin-OiJIUzI1NiIsI/'>
        <Alert />
        <SuccessModal />
        <Header />
        <Switch>
          <Auth>
            <Route component={ Routes } />
          </Auth>
        </Switch>
      </Router>
    </LoadingOverlay>
  );
}

export default App;
