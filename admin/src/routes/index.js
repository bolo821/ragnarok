import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from '../view/Dashboard';
import Login from '../view/Auth/login';
import ForgotPassword from '../view/Auth/forgotpassword';
import Emailverification from '../view/Admin/emailverification';
import Register from '../view/Auth/register';
import AccountManagement from '../view/Admin/accountmanagement';
import UserDashboard from '../view/Admin/dashboard';
import UserActivities from '../view/Admin/activities';
import UserAccounts from '../view/Admin/users';
import UserBalances from '../view/Admin/balances';
import UserTransactionsYmir from '../view/Admin/transactionsYmir';
import UserTransactionsRok from '../view/Admin/transactionsRok';
import Transactions from '../view/Admin/logs';
import UserMail from '../view/Admin/mails';
import UserTokens from '../view/Admin/tokens';
import Mode from '../view/Admin/mode';
import NotFound from '../components/layout/NotFound';
import PrivateRoute from '../components/PrivateRoute';
import News from '../view/Admin/news';
import MailServer from '../view/Admin/mailserver';

const Routes = () => {
  return (
    <>
    	<Switch>
        <Route exact path="/" component={ Dashboard } />
	      <Route path="/login" component={ Login } />
	      <Route path="/register" component={ Register } />
        <Route path="/forgotpassword" component={ ForgotPassword } />
	      <PrivateRoute path="/emailverification" component={ Emailverification } />
        <PrivateRoute path="/manageaccount" component={ AccountManagement } />
        <PrivateRoute path="/dashboard" component={ UserDashboard } />
        <PrivateRoute path="/activities" component={ UserActivities } />
        <PrivateRoute path="/news" component={ News } />
        <PrivateRoute path="/users" component={UserAccounts} />
        <PrivateRoute path="/balances" component={UserBalances} />
        <PrivateRoute path="/mail" component={UserMail} />
        <PrivateRoute path="/tokens" component={UserTokens} />
        <PrivateRoute path="/transactionsymir" component={UserTransactionsYmir} />
        <PrivateRoute path="/transactionsrok" component={UserTransactionsRok} />
        <PrivateRoute path="/logs" component={Transactions} />
        <PrivateRoute path="/mode" component={ Mode } />
        <PrivateRoute path="/mailserver" component={MailServer} />
        <Route path="/404" component={ NotFound } />
	      <Redirect to="/404" />
    	</Switch>
    </>
  );
};

export default Routes;