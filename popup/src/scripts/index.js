import React from 'react';
import {render} from 'react-dom';
import App from './components/app/App';
import {Store} from 'react-chrome-redux';
import {Provider} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {muiTheme} from '../../../utils/Constants';
import AnalyticsUtil from '../../../utils/AnalyticsUtil';

const proxyStore = new Store({
  portName: 'chrome-fb-story'
});

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// wait for the store to connect to the background page
proxyStore.ready().then(() => {
  setTimeout(function() {
    AnalyticsUtil.initializeMixpanel();
    render(
      <Provider store={proxyStore}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <App/>
        </MuiThemeProvider>  
      </Provider>
      , document.getElementById('app'));
    }, 100); 
  });