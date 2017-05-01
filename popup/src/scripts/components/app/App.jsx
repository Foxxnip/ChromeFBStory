import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FriendStoriesList from './FriendStoriesList';
import {getStoryTray} from '../../../../../utils/Utils';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';
import FacebookApi from '../../../../../utils/FacebookApi';

import "../../../../../node_modules/react-image-gallery/styles/css/image-gallery.css";

import {
  POPUP_BACKGROUND_COLOR_GRAY,
  POPUP_CONTAINER_WIDTH,
  POPUP_CONTAINER_HEIGHT
} from '../../../../../utils/Constants';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStory: null,
      isFriendStoriesLoading: true
    }
  }
  
  componentDidMount() {
    setTimeout(function() {
      // if the access token from the store is null, open Facebook to retrieve it
      if(this.props.accessToken === null) {
        chrome.runtime.sendMessage({hasEmptyAccessToken: true});
      } else {
        FacebookApi.getFriendStories(this.props.accessToken, (stories) => {
          this.props.dispatch({
            type: 'SET_FRIEND_STORIES',
            friendStories: getStoryTray(stories)
          });
          this.setState({isFriendStoriesLoading: false});
        });
      }
      AnalyticsUtil.track("Popup Opened", {itemsLength: this.props.stories.length});
    }.bind(this), 100);
  }
  
  setNewStory(story) {
    this.setState({currentStory: null});
    setTimeout(function() {
      this.setState({currentStory: story});
    }.bind(this), 100);
  }
  
  render() {
    const styles = {
      popupContainer: {
        minWidth: POPUP_CONTAINER_WIDTH + 'px',
        minHeight: POPUP_CONTAINER_HEIGHT + 'px',
        margin: '0px',
        overflow: 'hidden',
        background: POPUP_BACKGROUND_COLOR_GRAY
      },
      friendsStoriesList: {
        width: (this.state.currentStory != null) ? '40%' : '100%',
        minHeight: POPUP_CONTAINER_HEIGHT + 'px',
        float: 'left',
        overflowY: 'auto'
      },
      friendsStoryContainer: {
        minHeight: POPUP_CONTAINER_HEIGHT + 'px',
        marginLeft:  (this.state.currentStory != null) ? '40%' : '0%'
      },
      emptyState: {
        fontSize: '30px',
        color: 'gray'
      }
    };
    
    return (
      <div style={styles.popupContainer}>
        {this.props.stories.length === 0 && !this.state.isFriendStoriesLoading &&
          <span className="center-div" style={styles.emptyState}>No stories available</span>
        }
        
        {this.props.stories.length === 0 && this.state.isFriendStoriesLoading &&
          <div style={{height: POPUP_CONTAINER_HEIGHT + 'px'}}>
            <CircularProgress className="center-div" size={60}/>
          </div>
        }
        
        {this.props.stories.length > 0 &&
          <div>
            <div style={styles.friendsStoriesList}>
              <FriendStoriesList
                onSelectStory={(story) => this.setNewStory(story)}
                isLoading={this.state.isFriendStoriesLoading}/>
            </div>
            <div style={styles.friendsStoryContainer}>
              {this.state.currentStory != null && this.state.currentStory}
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stories: state.stories.friendStories,
    accessToken: state.session.accessToken
  };
};

export default connect(mapStateToProps)(App);
