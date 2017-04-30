import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FriendStoriesList from './FriendStoriesList';

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
      currentStory: null
    }
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
        {this.props.stories.length === 0 ?
          <span className="center-div" style={styles.emptyState}>No stories available</span>
          :
          <div>
            <div style={styles.friendsStoriesList}>
              <FriendStoriesList onSelectStory={(story) => this.setNewStory(story)}/>
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
    stories: state.stories.friendStories
  };
};

export default connect(mapStateToProps)(App);
