import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { LocaleProvider } from 'antd';
import th_TH from 'antd/es/locale-provider/th_TH';
import moment from 'moment';
import 'moment/locale/th';

moment.locale('th');

ReactDOM.render(<LocaleProvider locale={th_TH}><App /></LocaleProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
