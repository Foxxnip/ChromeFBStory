import {createStore} from 'redux';
import rootReducer from './reducers';

import {wrapStore} from 'react-chrome-redux';

import {
  AUTH_BASE,
  API_BASE,
} from '../../utils/Constants';

const store = createStore(rootReducer, {});

wrapStore(store, {
  portName: 'chrome-fb-story'
});

// listen for tab changes (i.e. AJAX request back to the home page) so we can re-inject
chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if (change.status == "complete" && tab.active) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {injectContentScript: true});
    });
  }
});

// hook into web request and modify headers before sending the request
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(info) {
    var headers = info.requestHeaders;
    var newHeaders = [];
    var shouldInjectHeaders = false;
    
    if(info.url === AUTH_BASE || info.url === API_BASE) {
      shouldInjectHeaders = true;
    }

    if(shouldInjectHeaders) {
      for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        if(header.name.toLowerCase() == 'user-agent' && shouldInjectHeaders) {
          header.value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X) AppleWebKit/602.2.14 (KHTML, like Gecko)';
          newHeaders.push(header);
        } else if(header.name.toLowerCase() != 'referer' && header.name.toLowerCase() != 'origin') {
          // remove the referer and origin headers
          newHeaders.push(header);
        } 
      }
    }
    return {requestHeaders: (shouldInjectHeaders) ? newHeaders : info.requestHeaders};
  },
  {
    urls: [
      "*://*.facebook.com/*"
    ],
    types: ["xmlhttprequest"]
  },
  ["blocking", "requestHeaders"]
);