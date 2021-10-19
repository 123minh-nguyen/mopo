import 'react-native-gesture-handler'
import React from 'react';
import { View, StatusBar, StyleSheet} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Flash from './src/screen/FlashScreen'
import Login from './src/screen/LoginScreen'
import CreateAccount from './src/screen/CreateAccountScreen'
import ForgotPassword from './src/screen/ForgotPasswordScreen'
import Home from './src/screen/HomeScreen'


import { Provider } from 'react-redux';
import { createStore, applyMiddleware} from 'redux';
import rootReducer from './src/reducer/combineReducers';
import thunk from "redux-thunk";

import {BleManager} from 'react-native-ble-plx';

const DeviceManager = new BleManager();

const Stack = createStackNavigator();

const store = createStore(rootReducer, applyMiddleware(thunk.withExtraArgument(DeviceManager)));

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent={true} backgroundColor={backgroundColor} {...props} />
  </View>
);

const App: () => React$Node = () => {

  return (
    <>
      <Provider store={ store }>
        <MyStatusBar backgroundColor="#000000A0" barStyle="light-content" />

        <NavigationContainer>
          <Stack.Navigator headerMode="none" initialRouteName="Home">
            <Stack.Screen name="Flash" component={Flash}/>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="CreateAccount" component={CreateAccount}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
            <Stack.Screen name="Home" component={Home}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      
    </>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: 0,
  },
});

export default App;
