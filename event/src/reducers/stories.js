const initialState = {
  friendStories: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FRIEND_STORIES':
    return {
      ...state,
      friendStories: action.friendStories
    }
    default:
    return state;
  }
};