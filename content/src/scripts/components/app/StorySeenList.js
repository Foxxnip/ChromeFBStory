import React, { Component } from 'react';
import {getTimeElapsed, getFacebookProfilePicture} from '../../../../../utils/Utils';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import moment from 'moment';
import $ from 'jquery';

class StorySeenList extends Component {
  constructor(props){
    super(props);
    this.state = {
      isStoryViewersListActive: true,
      listHeight: 1000
    }
  }
  
  componentDidMount() {
    this.setState({listHeight: $(".pswp__container").height() - 90});
  }
  
  toggleStoryViewersList() {
    this.setState({isStoryViewersListActive: !this.state.isStoryViewersListActive});
  }
  
  render() {
    const friendStoriesListData = this.props.seenList.map((seenUser, key) => {
      var user = seenUser.node;
      return (
        <ListItem
          key={key}
          value={key}
          style={{color: 'white', fontSize: '13px'}}
          innerDivStyle={{marginLeft: '-15px'}}
          disabled={true}
          primaryText={<div style={{color: 'white', marginLeft: '-15px', marginTop: '-5px'}}>{user.name}</div>}
          secondaryText={<span style={{color: 'white', marginLeft: '-15px', fontSize: '10px'}}>{getTimeElapsed(seenUser.seen_time)}</span>}
          leftAvatar={<Avatar size={28} src={getFacebookProfilePicture(user.id)} />}
          />
      )
    });
    
    return (
      <div>
        <FlatButton
          style={{color: 'white'}}
          label={this.props.seenList.length + " views"}
          icon={<VisibilityIcon color={"#ffffff"}/>}
          onClick={() => this.toggleStoryViewersList()}/>
        {this.state.isStoryViewersListActive &&
          <List style={{height: this.state.listHeight, overflowY: 'auto'}}>
            {friendStoriesListData}
          </List>
        }
      </div>
    )
  }
}

export default StorySeenList;