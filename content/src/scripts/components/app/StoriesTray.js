import React, { Component } from 'react';
import {connect} from 'react-redux';
import StoryTrayItem from './StoryTrayItem';
import {downloadStory, getFacebookProfilePicture} from '../../../../../utils/Utils';

class StoriesTray extends Component {
  viewUserStory(index) {
    var story = this.props.friendStories[index];
    this.props.onStoryClicked(story);
  }
  
  onDownloadStory(index) {
    var storyItem = this.props.friendStories[index];
    downloadStory(storyItem.node);
  }
  
  render() {
    const storyTrayItems = this.props.friendStories.map((storyTrayItem, key) => {
      var storyItem = storyTrayItem.node;
      var user = storyItem.other_participant;
      
      if(user === null) {
        user = storyItem.threads.edges[0].node.direct_messages.edges[0].node.message_owner;
        user.name = "Your Story";
      }
      
      return (
        <StoryTrayItem
          key={key}
          trayItemIndex={key}
          trayItemIcon={<img className={"fb-tray-item-image " + ((storyItem.unseen_count == 0) ? "seen-fb-story-item" : "unseen-fb-story-item")} src={getFacebookProfilePicture(user.id)} onClick={() => this.viewUserStory(key)}/>}
          trayItemUsername={user.short_name || user.name}
          onDownloadStory={(index) => this.onDownloadStory(index)}
          />
      )});
      
      return (
        <div className="fb-tray-container">
          {storyTrayItems}
        </div>
      )
    }
  }
  
  const mapStateToProps = (state) => {
    return {
      friendStories: state.stories.friendStories,
    };
  };
  
  export default connect(mapStateToProps)(StoriesTray);