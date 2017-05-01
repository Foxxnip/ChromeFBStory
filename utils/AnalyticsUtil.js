import {MIXPANEL_TOKEN} from './Constants';

export function track(eventName, properties) {
  if(typeof mixpanel !== "undefined") {
    mixpanel.track(eventName, properties);
  }
}

// extract the meaningful data from the story for analytics purposes
export function getStoryObject(story) {
  var storyUser = story.other_participant;
  if(storyUser === null) {
    storyUser = story.threads.edges[0].node.direct_messages.edges[0].node.message_owner;
  }
  return {
    story: {
      id: story.id,
      itemsLength: story.threads.edges.length,
      user: {
        id: storyUser.id
      }
    }
  }
}

export function initializeMixpanel() {
  if(MIXPANEL_TOKEN !== null) {
    (function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");
    for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement("script");a.type="text/javascript";a.async=!0;a.src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=f.getElementsByTagName("script")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);
    mixpanel.init(MIXPANEL_TOKEN, {api_host:"https://api.mixpanel.com"});
  }
}

const AnalyticsUtil = {
  track,
  getStoryObject,
  initializeMixpanel
}

export default AnalyticsUtil;