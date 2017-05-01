import React, { Component } from 'react';
import ImageGallery from 'react-image-gallery';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import {isVideo, getTimeElapsed, getFacebookProfilePicture} from '../../../../../utils/Utils';

class Story extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStoryViewersListActive: false,
      currentStoryItem: this.props.item.story[0],
      currentIndex: -1,
    };
  }
  
  componentDidMount() {
    setTimeout(function() {
      this.playStory(0);
    }.bind(this), 1);
  }
  
  playStory(currentIndex) {
    this.setState({
      currentStoryItem: this.props.item.story[this._imageGallery.getCurrentIndex()],
      currentIndex: currentIndex
    });
    
    var currentMedia = this.props.item.media[this._imageGallery.getCurrentIndex()];
    if(isVideo(currentMedia.original)) {
      var video = document.getElementById(currentMedia.id);
      if(video.paused) {
        video.play();
      }
    }
  }
  
  onSlide(currentIndex) {
    if(this.state.currentIndex >= 0) {
      var previousMedia = this.props.item.media[this.state.currentIndex];
      if(isVideo(previousMedia.original)) {
        var video = document.getElementById(previousMedia.id);
        if(!video.paused) {
          video.pause();
        }
      }
    }
    this.playStory(currentIndex);
  }
  
  toggleStoryViewersList() {
    this.setState({isStoryViewersListActive: !this.state.isStoryViewersListActive});
  }
  
  render() {
    const styles = {
      overlayTop: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 4,
      },
      storyViewersList: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: 'rgba(0,0,0,0.6)',
        top: '40px',
        zIndex: 4,
        overflowY: 'auto'
      },
      storyViewerStyle: {
        fontSize: '15px',
        color: 'white'
      },
      storyViewersButton: {
        position: 'absolute',
        zIndex: 4,
        color: 'white'
      }
    }
    
    var storyViewersListData = [];
    if(this.state.currentStoryItem.node.seenDirectUsers) {
      storyViewersListData = this.state.currentStoryItem.node.seenDirectUsers.edges.map((storyViewer, key) => {
        var user = storyViewer.node;
        return (
          <ListItem
          key={key}
          disabled={true}
          style={styles.storyViewerStyle}
          leftAvatar={<Avatar src={getFacebookProfilePicture(user.id)} size={32} />}
          primaryText={<div style={{color: 'white', marginLeft: '-15px', marginTop: '-5px'}}>{user.name}</div>}
          secondaryText={<span style={{color: 'white', marginLeft: '-15px', fontSize: '10px'}}>{getTimeElapsed(storyViewer.seen_time)}</span>}
          />
        )
      });
    }
    
    return (
      <div>
      <div className="overlayTop" style={styles.overlayTop}>
      <img src="/img/overlay-top.png" style={{width: '100%'}} alt=""/>
      </div>
      
      {this.state.currentStoryItem.node.seenDirectUsers &&
        <FlatButton
        style={styles.storyViewersButton}
        label={(this.state.currentStoryItem.node.seenDirectUsers.edges.length) > 0 ? this.state.currentStoryItem.node.seenDirectUsers.edges.length : "0"}
        icon={<VisibilityIcon color={"#ffffff"}/>}
        onClick={() => this.toggleStoryViewersList()}/>
      }
      {this.state.isStoryViewersListActive &&
        <List style={styles.storyViewersList}>
        {storyViewersListData}
        </List>
      }
      
      <ImageGallery
      ref={i => this._imageGallery = i}
      items={this.props.item.media}
      showThumbnails={false}
      autoPlay={false}
      showNav={true}
      showPlayButton={false}
      showFullscreenButton={false}
      showBullets={false}
      showIndex={false}
      onSlide={(currentIndex) => this.onSlide(currentIndex)}
      />
      </div>
    )
  }
}

export default Story;