const initialState = {
  accessToken: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
    return {
      ...state,
      accessToken: action.accessToken
    }
    default:
    return state;
  }
};