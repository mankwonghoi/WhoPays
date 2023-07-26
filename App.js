import {} from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import Home from './screen/Home';
import TransactionHistory from './screen/TransactionHistory';
import TransactionHistoryDetail from './screen/TransactionHistoryDetail';
import { TransactionHistorysProvider } from './Context/TransactionHistoryContext';

const BottomTab = createBottomTabNavigator();
const TransactionHistoryStack = createStackNavigator();

export default function WhoPays() {
  return (
    <>
      <TransactionHistorysProvider>
        <NavigationContainer>
          <BottomTab.Navigator screenOptions={{ headerShown: false }}>
            <BottomTab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <AntDesign name="home" size={size} color={color} />
                ),
              }}
            />
            <BottomTab.Screen
              name="Transaction"
              component={NestedStackScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <AntDesign name="form" size={size} color={color} />
                ),
              }}
            />
          </BottomTab.Navigator>
        </NavigationContainer>
      </TransactionHistorysProvider>
    </>
  );
}

const NestedStackScreen = () => {
  return (
    <TransactionHistoryStack.Navigator screenOptions={{ headerShown: false }}>
      <TransactionHistoryStack.Screen
        component={TransactionHistory}
        name="TransactionHistory"
      />
      <TransactionHistoryStack.Screen
        component={TransactionHistoryDetail}
        name="TransactionHistoryDetail"
      />
    </TransactionHistoryStack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});
