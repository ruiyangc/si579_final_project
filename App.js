import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from './Styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { LoginScreen } from './LoginScreen';
import { FridgeScreen } from './FridgeScreen';
import { EditFridge } from './EditFridge';
import { FoodScreen } from './FoodScreen';
import { EditFood } from './EditFood';
import { RoutineScreen } from './RoutineScreen'

const Stack = createStackNavigator();
const FridgeStack = createStackNavigator();

function FridgeStackScreen() {
  return (
    <FridgeStack.Navigator
      initialRouteName="Login"   
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "white"
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '500',
        },
      }}
    >
      <FridgeStack.Screen name="Fridges" component={FridgeScreen} />
      <FridgeStack.Screen name="EditFridge" component={EditFridge} />
      <FridgeStack.Screen name="Foods" component={FoodScreen} />
      <FridgeStack.Screen name="EditFood" component={EditFood} />
    </FridgeStack.Navigator>
  );
}

const RoutineStack = createStackNavigator();

function RoutineStackScreen() { //Not able to finish
  return (
    <RoutineStack.Navigator
      initialRouteName="Login"   
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "white"
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '500',
        }, 
      }}
    >
      <RoutineStack.Screen name="Routines" component={RoutineScreen} />
    </RoutineStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Fridge') {
            iconName = focused ? 'ios-albums' : 'ios-albums';
          } else if (route.name === 'Routine') {
            iconName = focused ? 'ios-list' : 'ios-list';
          }
        
          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
      tabBarOptions={{
        showLabel: true, // hide labels
        activeTintColor: colors.primary,
        inactiveTintColor: colors.primaryLight,
        style: {
          backgroundColor: 'white',
          height: 85,
        }
      }}
    >
      <Tab.Screen name="Fridge" component={FridgeStackScreen} />
      <Tab.Screen name="Routine" component={RoutineStackScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"   
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "white"
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: '500',
          }, 
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;