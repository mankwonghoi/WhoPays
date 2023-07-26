import { useState, useEffect } from 'react';
import TextBoxAdd from '../components/TextBoxAdd';
import PackingList from '../components/PackingList';
import Colors from '../misc/Colors';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTransactionHistorys } from '../Context/TransactionHistoryContext';

//const initialFriends = [
//  { id: 0, name: 'Harrison', paid: 10 },
//  { id: 1, name: 'Grace', paid: 20 },
//  { id: 2, name: 'Derek', paid: 35 },
//];

export default function Home() {
  const transactionHistorys = useTransactionHistorys();
  const [friends, setFriends] = useState([]);
  const [additionalFriends, setAdditionalFriends] = useState([]);

  const buildFriends = () => {
    let fds = [];
    let index = 0;
    //from transaction historys
    for (let th of transactionHistorys) {
      if (fds.find((fd) => fd.name === th.name)) {
        fds.forEach((fd) => {
          if (fd.name === th.name) {
            fd.paid += th.amount;
          }
        });
      } else {
        fds = [
          ...fds,
          {
            id: index++,
            name: th.name,
            paid: th.amount,
          },
        ];
      }
    }
    //from additional friends
    for (let af of additionalFriends) {
      if (!fds.find((fd) => fd.name === af.name)) {
        {
          fds = [
            ...fds,
            {
              id: index++,
              name: af.name,
              paid: 0,
            },
          ];
        }
      }
    }
    setFriends(fds);
  };

  let totalPaid = friends.reduce((a, v) => (a = a + Number(v.paid)), 0);

  const findAdditionalFriends = async () => {
    const result = await AsyncStorage.getItem('additionalFriends');
    if (result !== null) {
      let newFriends = JSON.parse(result);
      setAdditionalFriends(newFriends);
    }
  };

  useEffect(() => {
    findAdditionalFriends();
  }, []);

  useEffect(() => {
    buildFriends();
    //AsyncStorage.clear();
  }, [transactionHistorys, additionalFriends]);

  const handleAddFriend = async (name) => {
    if (!friends.some((fd) => fd.name === name)) {
      let newFriends = [
        ...friends,
        {
          id: friends.length,
          name: name,
          paid: 0,
        },
      ];
      setAdditionalFriends(newFriends);
      await setAsyncStorage('additionalFriends', newFriends);
    }
  };

  const handleUpdateFriend = async (friendId, updatedFriendPaid) => {
    let newFriends = friends.map((friend) => {
      if (friend.id === friendId) {
        return {
          ...friend,
          paid: updatedFriendPaid,
        };
      } else {
        return friend;
      }
    });
    setAdditionalFriends(newFriends);
    await setAsyncStorage('additionalFriends', newFriends);
  };

  const handleDeleteFriend = async (friendId) => {
    let newFriends = friends.filter((friend) => friend.id !== friendId);
    setAdditionalFriends(newFriends);
    await setAsyncStorage('additionalFriends', newFriends);
  };

  const setAsyncStorage = async (itemName, item) => {
    switch (itemName) {
      case 'additionalFriends':
        await AsyncStorage.setItem(itemName, JSON.stringify(item));
        break;
      default:
      // code block
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TextBoxAdd onAdd={handleAddFriend} />
          <PackingList
            friends={friends.sort((a, b) => a.name.localeCompare(b.name))}
            onUpdateFriend={handleUpdateFriend}
            onDeleteFriend={handleDeleteFriend}
          />
          <Text style={styles.totalPaid}>{`Total Paid: $${totalPaid}`}</Text>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: Constants.statusBarHeight + 30,
  },
  totalPaid: {
    fontWeight: 'bold',
    marginTop: 10,
    padding:5,
    alignSelf: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.BUTTON,
  },
});
