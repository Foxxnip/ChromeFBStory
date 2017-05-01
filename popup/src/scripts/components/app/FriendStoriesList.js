import React, { Component } from 'react';
import {connect} from 'react-redux';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import ImageGallery from 'react-image-gallery';
import {downloadStory, getFacebookProfilePicture, getStoryGallerySlide} from '../../../../../utils/Utils';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';
import Story from './Story';

let SelectableList = makeSelectable(List);

class FriendStoriesList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: -1
    }
  }
  
  handleRequestChange (event, index) {
    var selectedStory = this.props.friendStories[index].node.threads.edges;
    getStoryGallerySlide(selectedStory, (storySlide) => this.changeStory(storySlide));
    this.setState({
      selectedIndex: index,
    });
    AnalyticsUtil.track("Story List Item Clicked", AnalyticsUtil.getStoryObject(this.props.friendStories[index].node));
  }
  
  changeStory(storySlide) {
    const story = (
      <Story item={storySlide} />
    );
    this.props.onSelectStory(story);
  }
  
  render() {
    const friendStoriesListData = this.props.friendStories.map((friendStory, key) => {
      var storyItem = friendStory.node;
      var user = storyItem.other_participant;
      
      if(user === null) {
        user = storyItem.threads.edges[0].node.direct_messages.edges[0].node.message_owner;
        user.name = "Your Story";
      }
      
      return (
        <ListItem
          key={key}
          value={key}
          primaryText={user.short_name || user.name}
          leftAvatar={<Avatar src={getFacebookProfilePicture(user.id)} />}
          rightIconButton={
            <IconButton
              onClick={() => {
                var selectedStory = this.props.friendStories[key];
                downloadStory(selectedStory.node);
              }}>
              <DownloadIcon />
            </IconButton>
          }/>
        )
      });
      
      return (
        <SelectableList value={this.state.selectedIndex} onChange={this.handleRequestChange.bind(this)}>
          <Subheader>Facebook Stories</Subheader>
          {friendStoriesListData}
        </SelectableList>
      )
    }
  }
  
  const mapStateToProps = (state) => {
    return {
      friendStories: state.stories.friendStories
    };
  };
  
  export default connect(mapStateToProps)(FriendStoriesList);
