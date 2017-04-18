import {
  AUTH_BASE,
  API_BASE,
  getAccessTokenRequestParams,
  getFriendStoriesRequestParams
} from './Constants';

// fetch the access token used to authenticate the API requests
function getAccessToken(fb_dtsg, callback) {
  return fetch(AUTH_BASE, {
    method: 'POST',
    credentials: 'include',
    body: queryParams(getAccessTokenRequestParams(fb_dtsg))
  }).then(checkStatus)
  .then(parseText)
  .then(parseAccessToken)
  .then(callback);
}

// fetch the requesting user's story tray for their friends' stories
function getFriendStories(authToken, callback) {
  return fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'OAuth ' + authToken
    },
    body: JSON.stringify(getFriendStoriesRequestParams())
  }).then(checkStatus)
  .then(parseText)
  .then(parseJSON)
  .then(callback);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error);
    throw error;
  }
}

function queryParams(params) {
  return Object.keys(params)
  .map(k => k + '=' + params[k])
  .join('&');
}

function parseAccessToken(responseText) {
  var data = responseText.match(/access_token=(.*?)&/)[1];
  return data;
}

function parseText(response) {
  return response.text();
}

function parseJSON(responseText) {
  var strLines = responseText.split("\n");
  return JSON.parse(strLines[0]);
}

const FacebookApi = {
  getAccessToken,
  getFriendStories
};

export default FacebookApi;