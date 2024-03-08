import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { doDBSetting } from './lib/db/db';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

doDBSetting();

root.render(
  <BrowserRouter basename='/'>
    <App />
  </BrowserRouter>
);

