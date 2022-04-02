import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import './App.css';
import { getMode } from './actions/mode';
import Maintenance from './view/Dashboard/Maintenance';
import Header from './components/layout/Header';
import Alert from './components/Alert';
import SuccessModal from './components/modal/SuccessModal';
import Routes from './routes';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingOverlay from 'react-loading-overlay';
import Auth from './Auth';
import { SOCKET } from './utils/api';
import { logout } from './actions/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.load.loader);
  const mode = useSelector(state => state.mode.mode);

  useEffect(() => {
    dispatch(getMode());

    SOCKET.on('MOVE_TO_MAINTENANCE_MODE', () => {
      dispatch(logout());
      window.location.reload();
    })
  }, [ dispatch ]);

  if (mode === 'active') 
    return (
      <LoadingOverlay active={isLoading} spinner text='Please do not close the browser and wait for the transaction to be completed to avoid possible token loss.'>
        <ToastContainer pauseOnFocusLoss={false} autoClose={5000} hideProgressBar={false} closeOnClick />
        <Router>
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
  else if (mode === 'maintenance')
    return <Maintenance />
  else
    return <></>
}

export default App;
