import {} from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import Home from './screen/Home';
import WhoPaysSummary from './screen/WhoPaysSummary';
import TransactionHistory from './screen/TransactionHistory';
import TransactionHistoryDetail from './screen/TransactionHistoryDetail';
import { TransactionHistorysProvider } from './context/TransactionHistoryContext';
import { FriendsProvider } from './context/FriendContext';

const BottomTab = createBottomTabNavigator();
const NestedStack = createStackNavigator();

export default function WhoPays() {
  return (
    <>
      <TransactionHistorysProvider>
        <FriendsProvider>
            <NavigationContainer>
              <BottomTab.Navigator screenOptions={{ headerShown: false }}>
                <BottomTab.Screen
                  name="Home"
                  component={HomeNestedStackScreen}
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <AntDesign name="home" size={size} color={color} />
                    ),
                  }}
                />
                <BottomTab.Screen
                  name="Transaction"
                  component={TransactionNestedStackScreen}
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <AntDesign name="form" size={size} color={color} />
                    ),
                  }}
                />
              </BottomTab.Navigator>
            </NavigationContainer>
        </FriendsProvider>
      </TransactionHistorysProvider>
    </>
  );
}

const HomeNestedStackScreen = () => {
  return (
    <NestedStack.Navigator screenOptions={{ headerShown: false }}>
      <NestedStack.Screen component={Home} name="Home" />
      <NestedStack.Screen component={WhoPaysSummary} name="WhoPaysSummary" />
    </NestedStack.Navigator>
  );
};

const TransactionNestedStackScreen = () => {
  return (
    <NestedStack.Navigator screenOptions={{ headerShown: false }}>
      <NestedStack.Screen
        component={TransactionHistory}
        name="TransactionHistory"
      />
      <NestedStack.Screen
        component={TransactionHistoryDetail}
        name="TransactionHistoryDetail"
      />
    </NestedStack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});
