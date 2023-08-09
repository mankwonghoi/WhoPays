import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Button,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import Constants from 'expo-constants';
import moment from 'moment';

import {
  useTransactionHistorys,
  useTransactionHistorysDispatch,
} from '../context/TransactionHistoryContext';
import { useFriends, useFriendsDispatch } from '../context/FriendContext';
import RoundIconBtn from '../components/RoundIconBtn';
import Colors from '../misc/Colors';
import NameCheckbox from '../components/NameCheckBox';

export default function TransactionHistoryDetail({ route, navigation }) {
  const mode = route.params.mode;
  const transactionId = route.params.id;
  const transactionHistorys = useTransactionHistorys();
  const transactionHistorysDispatch = useTransactionHistorysDispatch();
  const friends = useFriends();
  const friendsDispatch = useFriendsDispatch();
  const [friendListForCheckBox, setFriendListForCheckBox] = useState([]);
  let transaction;

  if (mode === 'edit') {
    transaction = transactionHistorys.find((th) => th.id === transactionId);
  } else if (mode === 'new') {
    transaction = {
      id: 0, //no use
      date: moment(Date.now()).format('YYYY/MM/DD'),
      name: '',
      amount: 0,
      remark: '',
      relatedFriends: [],
    };
  }

  //Transaction form
  const [date, setDate] = useState(transaction?.date);
  const [name, setName] = useState(transaction?.name);
  const [amount, setAmount] = useState(transaction?.amount);
  const [remark, setRemark] = useState(transaction?.remark);

  const deleteTransaction = () => {
    transactionHistorysDispatch({
      type: 'delete',
      id: transactionId,
    });
    navigation.goBack();
  };

  const displayDeleteAlert = () => {
    //console.log('delete');
    Alert.alert(
      'Are You Sure!',
      'This action will delete your record permanently!',
      [
        {
          text: 'Delete',
          onPress: deleteTransaction,
        },
        {
          text: 'No Thanks',
          onPress: () => console.log('no thanks'),
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const buildFriendListForCheckBox = (fds, relatedFriends) => {
    let newFriends = [];
    for (let fd of fds) {
      newFriends = [
        ...newFriends,
        { name: fd, selected: relatedFriends.includes(fd) },
      ];
    }
    setFriendListForCheckBox(newFriends);
  };

  useEffect(() => {
    buildFriendListForCheckBox(friends, transaction.relatedFriends);
  }, []);

  const onCheckBoxClick = (click, name) => {
    if (name.length > 0) {
      if (friendListForCheckBox.find((fd) => fd.name === name)) {
        setFriendListForCheckBox(
          friendListForCheckBox.map((fd) => {
            if (fd.name === name) {
              return { ...fd, selected: click };
            } else {
              return fd;
            }
          })
        );
      } else {
        setFriendListForCheckBox([
          ...friendListForCheckBox,
          { name: name, selected: click },
        ]);
      }
    }
  };

  const getSelectedRelatedFriends = () => {
    let rfds = [];
    for (let fd of friendListForCheckBox) {
      if (fd.selected) rfds.push(fd.name);
    }
    return rfds;
  };

  const addBtnclick = () => {
    transactionHistorysDispatch({
      type: 'add',
      id: Date.now(),
      date: date.trim(),
      name: name.trim(),
      amount: Number(amount),
      remark: remark,
      relatedFriends: getSelectedRelatedFriends(),
    });
    navigation.goBack();
  };

  const saveBtnClick = () => {
    transactionHistorysDispatch({
      type: 'update',
      transactionHistory: {
        ...transaction,
        date: date.trim(),
        name: name.trim(),
        amount: Number(amount),
        remark: remark,
        relatedFriends: getSelectedRelatedFriends(),
      },
    });
    navigation.goBack();
  };

  const button = () => {
    return (
      <>
        {mode === 'edit' ? (
          <>
            <RoundIconBtn
              antIconName="save"
              size={50}
              color={Colors.DARK}
              onPress={saveBtnClick}
              style={styles.saveBtn}
            />
            <RoundIconBtn
              antIconName="delete-outline"
              size={50}
              color={Colors.DARK}
              onPress={displayDeleteAlert}
              style={styles.deleteBtn}
            />
          </>
        ) : null}
        {mode === 'new' ? (
          <>
            <RoundIconBtn
              antIconName="add"
              size={50}
              color={Colors.DARK}
              onPress={addBtnclick}
              style={styles.saveBtn}
            />
          </>
        ) : null}
      </>
    );
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TextInput
            label="Date (YYYY/MM/DD)"
            value={date}
            onChangeText={(text) => setDate(text)}
          />
          <TextInput
            label="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            label="Amount"
            value={amount.toString()}
            onChangeText={(text) => setAmount(text)}
          />
          <TextInput
            label="Remark"
            value={remark}
            onChangeText={(text) => setRemark(text)}
            multiline={true}
            style={{ height: 100 }}
          />
          <Text style={styles.relatedFriends}>Related Friends</Text>
          <FlatList
            data={friendListForCheckBox.sort((a, b) =>
              a.name.localeCompare(b.name)
            )}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <>
                <NameCheckbox
                  name={item.name}
                  onClick={onCheckBoxClick}
                  ticked={item.selected}
                />
              </>
            )}
            ListFooterComponent={() => (
              <>
                <NameCheckbox
                  name={''}
                  mode={'edit'}
                  onClick={onCheckBoxClick}
                  ticked={false}
                />
              </>
            )}
          />
          {button()}
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
  saveBtn: {
    position: 'absolute',
    right: 30,
    bottom: 100,
    borderRadius: 33,
  },
  deleteBtn: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    borderRadius: 33,
  },
  relatedFriends: {
    fontWeight: 'bold',
    margin: 5,
    padding: 5,
    alignSelf: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.PRIMARY,
  },
});
