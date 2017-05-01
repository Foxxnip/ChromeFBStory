import {combineReducers} from 'redux';

import stories from './stories';
import session from './session';

export default combineReducers({
  stories,
  session
});
