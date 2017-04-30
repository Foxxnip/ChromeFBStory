import React, {Component} from 'react';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';
import moment from 'moment';

// returns the "slide" object the StoryGallery in the popup uses
export function getStoryGallerySlide(story, callback) {
  const storyMedia = story.map((media, key) => {
    var item = media.node.direct_messages.edges[0].node;
    const url = getMediaItemUrl(item);
    if(isVideo(url)){
      return {
        id: media.id,
        original: url,
        renderItem: renderStoryVideoItem
      };
    } else {
      return {
        id: media.id,
        original: url,
        renderItem: renderStoryImage
      };
    }
  });
  
  var storySlide = {
    key: story.id,
    media: storyMedia,
    story: story
  };
  
  callback(storySlide);
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

function renderStoryVideoItem(item) {
  return (
    <div>
      <video
        style={{width: '100%'}}
        id={item.id}
        src={item.original}
        controls
        />
    </div>
  )
}

function renderStoryImage(item) {
  return (
    <div>
      <img
        style={{width: '100%'}}
        src={item.original}
        />
    </div>
  )
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