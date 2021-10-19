import { combineReducers } from 'redux';

import BLEReducer from './BLEReducer';
import HomeReducer from './HomeReducer';
import XXReducer from './XXReducer';
import MultiBMSXXReducer from './MultiBMSXXReducer'

export default combineReducers({
    Ble: BLEReducer,
    Home: HomeReducer,
    XX: XXReducer,
    MultiBMS: MultiBMSXXReducer,
});