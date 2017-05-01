import getMuiTheme from 'material-ui/styles/getMuiTheme';

export const API_BASE = "https://graph.facebook.com/graphqlbatch/";
export const AUTH_BASE = "https://www.facebook.com/v1.0/dialog/oauth/confirm";

// UI colors
export const COLOR_BLUE = "#5890FF";
export const POPUP_BACKGROUND_COLOR_GRAY = "#E9EBEE";

// UI dimensions 
export const POPUP_CONTAINER_WIDTH = 562;
export const POPUP_CONTAINER_HEIGHT = 600;

export const MIXPANEL_TOKEN = null;

export const muiTheme = getMuiTheme({
  palette: {
    primary1Color: COLOR_BLUE
  },
});

export function getAccessTokenRequestParams(fb_dtsg) {
  var params = {
    "fb_dtsg": fb_dtsg,
    "app_id": "165907476854626",
    "redirect_uri": "fbconnect://success&display=popup",
    "access_token": "",
    "sdk": "",
    "from_post": "1",
    "private": "",
    "tos": "",
    "login": "",
    "read": "",
    "write": "",
    "extended": "",
    "social_confirm": "",
    "confirm": "",
    "seen_scopes": "",
    "auth_type": "",
    "auth_token": "",
    "auth_nonce": "",
    "default_audience": "",
    "ref": "Default",
    "return_format": "access_token",
    "domain": "",
    "sso_device": "ios",
    "__CONFIRM__": "1",
  }
  return params;
}

export function getFriendStoriesRequestParams() {
  var queries = {
    "BATCH_0": {
      "query_id": "1237133843001937",
      "query_params": {
        "7": 500,
        "3": 500,
        "16": "true",
        "8": 500,
        "4": "image/jpeg",
        "11": 2,
        "5": 720,
        "6": 500,
        "10": "true",
        "2": 500
      }
    }
  }
  var params = {
    "method": "get",
    "format": "json",
    "sdk_version": "3",
    "locale": "en_US",
    "queries": JSON.stringify(queries),
    "batch_name": "FBSnacksBucketsQuery",
    "fb_api_req_friendly_name": "FBSnacksBucketsQuery",
    "app_version": "53195005",
    "fb_api_caller_class": "FBGraphQLServiceLegacy",
    "sdk": "ios"
  };
  return params;
}