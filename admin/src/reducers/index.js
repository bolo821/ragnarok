import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import balance from './balance';
import logs from './logs';
import modal from './modal';
import rok from './rok';
import ymir from './ymir';
import load from './load';
import news from './news';
import character from './character';
import minter from './minter';
import user from './user';
import transaction from './transaction';
import mode from './mode';


export default combineReducers({
  alert,
  auth,
  balance,
  logs,
  rok,
  ymir,
  modal,
  load,
  news,
  character,
  minter,
  user,
  transaction,
  mode,
});
