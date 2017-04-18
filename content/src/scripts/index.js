import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Store} from 'react-chrome-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {muiTheme} from '../../../utils/Constants';
import {isVideo, getMediaItemUrl, getPswpElement, injectPswpContainer, showImageGallery} from '../../../utils/Utils';
import FacebookApi from '../../../utils/FacebookApi';
import StoriesTray from './components/app/StoriesTray';
import StorySeenList from './components/app/StorySeenList';
import {List, ListItem} from 'material-ui/List';

const proxyStore = new Store({portName: 'chrome-fb-story'});

var facebookFeed;
var isInjectingContent = false;

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// inject div container to host the Story image gallery
injectPswpContainer();

// listen for the background script to tell us to inject the content script (called when the tab state changes)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {   
  if(request.injectContentScript) {
    injectContentScript();
  }
});

function injectContentScript() {
  facebookFeed = document.getElementsByClassName('_2c44')[0];
  if(facebookFeed && !isInjectingContent) {
    if(!document.getElementById("fb-tray-container")) {
      isInjectingContent = true;
      injectFriendStories();
    }
  }
}

// inject the user's friends' story tray in the homepage above the main feed on Facebook.com
function injectFriendStories(tray) {
  if(!document.getElementById("fb-tray-container")) {
    var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
    FacebookApi.getAccessToken(fb_dtsg, (accessToken) => {
      FacebookApi.getFriendStories(accessToken, (stories) => {
        var response = stories.BATCH_0.response;
        var tray = response[Object.keys(response)[0]].friends_stories_buckets.edges;
        
        var yourStory = response[Object.keys(response)[0]].story_bucket;
        var yourStoryItems = yourStory.edges;
        if(yourStoryItems && yourStoryItems[0].node.threads.edges.length > 0) {
          tray.unshift(yourStoryItems[0]);
        }

        isInjectingContent = false; 
        proxyStore.dispatch({
          type: 'SET_FRIEND_STORIES',
          friendStories: tray
        });
        
        renderStoryTray();  
      });
    });
  }
}

// show the selected story in the image gallery
function onStoryClicked(currentStoryItem) {
  showImageGallery(currentStoryItem.node.threads.edges);
}

// render the proper story tray based on its type
function renderStoryTray() {
  const anchor = document.createElement('div');
  anchor.id = 'rcr-anchor';
  if(!document.getElementById("rcr-anchor")) {
    facebookFeed.parentNode.insertBefore(anchor, facebookFeed.nextSibling);
  }
  
  // wait for the store to connect to the background page
  proxyStore.ready().then(() => {
    render(
      <Provider store={proxyStore}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <StoriesTray onStoryClicked={(storyId) => onStoryClicked(storyId)}/>
        </MuiThemeProvider>
      </Provider>
      , document.getElementById('rcr-anchor'));
    });  
  }