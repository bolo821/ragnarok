import axios from 'axios';
import socketIOClient from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const SOCKET = socketIOClient(SERVER_URL);
export default api;