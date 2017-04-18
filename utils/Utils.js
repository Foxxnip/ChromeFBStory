import React from 'react';
import {render} from 'react-dom';
import StorySeenList from '../content/src/scripts/components/app/StorySeenList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {muiTheme} from './Constants';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';
import moment from 'moment';
import $ from 'jquery';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from "../node_modules/photoswipe/dist/photoswipe-ui-default.min.js";
import "../node_modules/photoswipe/dist/photoswipe.css";
import "../node_modules/photoswipe/dist/default-skin/default-skin.css";

// inject div container to host the Story image gallery
export function injectPswpContainer() {
  var pswpContainer = document.createElement("div");
  pswpContainer.setAttribute("id", "pswpContainer");
  document.body.appendChild(pswpContainer);
}

// displays image gallery for Story images
export function showImageGallery(storyItems) {
  // retrieve the injected pswpElement
  getPswpElement(function(pswpElement) {
    var slides = [];
    
    // create an image gallery slide for each story
    storyItems.map((storyItem, index) => {
      slides.push(getStorySlide(index, storyItem));
    });
    
    var options = {
      closeOnScroll: false,
      shareEl: false,
      history: false
    };
    
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
    
    // update the Story author's username and profile picture
    gallery.listen('afterChange', function() {
      
      var currItem = $(gallery.currItem.container);
      
      var storyAuthorImage = currItem.find('.fb-story-author-image');
      var storyAuthorUsername = currItem.find('.fb-story-author-username');
      var storySeenList = currItem.find('.fb-story-seen-list');
      
      // only inject the Story author attribution and seen list to the current slide if it doesn't already exist
      if(storyAuthorImage.length == 0 && storyAuthorUsername.length == 0 && storySeenList.length == 0) {
        storyAuthorImage = document.createElement('img');
        storyAuthorImage.setAttribute("class", "fb-story-author-image");
        
        storyAuthorUsername = document.createElement('span');
        storyAuthorUsername.setAttribute("class", "fb-story-author-username");
        
        storySeenList = document.createElement('div');
        storySeenList.id = "storySeenList";
        storySeenList.setAttribute("class", "fb-story-seen-list");
        
        $(currItem).append(storyAuthorImage);
        $(currItem).append(storyAuthorUsername);
        $(currItem).append(storySeenList);
      }
      
      var storyItem = gallery.currItem.storyItem;
      var user = storyItem.message_owner;
      $(storyAuthorImage).attr("src", getFacebookProfilePicture(user.id));
      $(storyAuthorUsername).text(user.name + " - " + getTimeElapsed(storyItem.time));
      
      // render the list of users who have seen the story item at the current sline
      render(
        <MuiThemeProvider muiTheme={muiTheme}>
          <StorySeenList seenList={gallery.currItem.seenList}/>
        </MuiThemeProvider>
        , $(storySeenList)[0]);
      });
      
      // handle playing/pausing videos while traversing the gallery
      gallery.listen('beforeChange', function() {
        var currItem = $(gallery.currItem.container);
        // remove 'active' class from any videos
        $('.pswp__video').removeClass('active');
        // add 'active' class to the currently playing video
        var currItemIframe = currItem.find('.pswp__video').addClass('active');
        // for each video, pause any inactive videos, and play the active video
        $('.pswp__video').each(function() {
          if (!$(this).hasClass('active')) {
            $(this)[0].pause();
            $(this)[0].currentTime = 0;
          } else {
            $(this)[0].play();
          }
        });
      });
      
      // handle pausing videos when the gallery is closed
      gallery.listen('close', function() {
        $('.pswp__video').each(function() {
          $(this)[0].pause();
        });
      });
      
      gallery.init();
    });
  }
  
  // returns an HTML slide used by PhotoSwipe for each Story item
  export function getStorySlide(index, storyItem) {
    var item = storyItem.node.direct_messages.edges[0].node;
    var url = getMediaItemUrl(item);
    
    if(isVideo(url)) {
      var storyVideo = document.createElement('video');
      var source = document.createElement("source");
      storyVideo.setAttribute("controls", true);
      if(index === 0) { storyVideo.setAttribute("autoplay", true); }
      source.src = url;
      storyVideo.appendChild(source);
      $(storyVideo).addClass('fb-video-story-item');
      $(storyVideo).addClass('pswp__video active');
      $(storyVideo).css('position', 'absolute');
      
      return {
        html: storyVideo,
        storyItem: item,
        seenList: storyItem.node.seenDirectUsers.edges
      };
    } else {
      var storyImage = document.createElement('img');
      storyImage.src = url;
      $(storyImage).addClass('fb-video-story-item');
      $(storyImage).css('position', 'absolute');
      
      return {
        html: storyImage,
        storyItem: item,
        seenList: storyItem.node.seenDirectUsers.edges
      };
    }
  }
  
  // used to initialize and show the Story image gallery
  export function getPswpElement(callback) {
    // if photoswipe element exists, return it
    if($('#pswp').length) {
      callback(document.getElementById('pswp'));
    } else {
      // photoswipe element doesn't exist, inject it
      $("#pswpContainer").load(chrome.extension.getURL("html/photoswipe.html"), function() {
        callback(document.getElementById('pswp'));
      });
    }
  }
  
  // downloads a zip file containing the user's Story
  export function downloadStory(trayItem, callback) {
    var zip = new JSZip();
    var storyItems = trayItem.threads.edges;
    storyItems.map((storyItem, i) => {
      var message = storyItem.node.direct_messages.edges[0].node;
      var mediaItemUrl = getMediaItemUrl(message);
      // downloads each Story image/video and adds it to the zip file
      zip.file(getStoryFileName(storyItem.node, mediaItemUrl), urlToPromise(mediaItemUrl), {binary:true});
    });
    // generate zip file and start download
    zip.generateAsync({type:"blob"})
    .then(function(content) {
      FileSaver.saveAs(content, getZipFileName(storyItems));
      if(callback) { callback(); }
    });
  }
  
  // promises to download the file before zipping it
  function urlToPromise(url) {
    return new Promise(function(resolve, reject) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  
  // returns the name of the zip file to download with format: (username-timestamp.zip)
  function getZipFileName(storyItems) {
    var user = storyItems[0].node.direct_messages.edges[0].node.message_owner;
    return user.name + "-" + moment().format() + ".zip";
  }
  
  // returns the name of the image/video file to add to the zip file
  function getStoryFileName(storyItem, mediaItemUrl) {
    return storyItem['id'] + (((mediaItemUrl.includes(".mp4")) ? ".mp4" : ".jpg"));
  }
  
  export function getTimeElapsed(timestamp) {
    return moment.unix(timestamp).fromNow();
  }
  
  export function getFacebookProfilePicture(id) {
    return "https://graph.facebook.com/" + id + "/picture";
  }
  
  export function getMediaItemUrl(storyItem) {
    var media = storyItem.message_media;
    return(media.playable_url) ? media.playable_url : media.image2048.uri;
  }
  
  export function isVideo(url) {
    return url.indexOf('.mp4') > -1;
  }