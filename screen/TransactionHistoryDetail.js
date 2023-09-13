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
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import Constants from 'expo-constants';
import moment from 'moment';

import {
  useTransactionHistorys,
  useTransactionHistorysDispatch,
} from '../context/TransactionHistoryContext';
import { useFriends } from '../context/FriendContext';
import RoundIconBtn from '../components/RoundIconBtn';
import Colors from '../misc/Colors';
import NameCheckbox from '../components/NameCheckBox';

export default function TransactionHistoryDetail({ route, navigation }) {
  const mode = route.params.mode;
  const transactionId = route.params.id;
  const transactionHistorys = useTransactionHistorys();
  const transactionHistorysDispatch = useTransactionHistorysDispatch();
  const friends = useFriends();
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
      'Are You Sure?',
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
        { name: fd.name, selected: relatedFriends.includes(fd.name) },
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

    
  const onSelectAll = () => {
    let flcb = friendListForCheckBox.map((cb) => {
      return { name: cb.name, selected: true };
    });
    setFriendListForCheckBox(flcb);
    console.log(flcb);
  };

  const onUnselectAll = () => {
    setFriendListForCheckBox(
      friendListForCheckBox.map((cb) => {
        return { name: cb.name, selected: false };
      })
    );
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
              style={styles.deleteBtn}
            />
          </>
        ) : null}
      </>
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View>
        <TextInput
          label="Date (YYYY/MM/DD)"
          value={date}
          onChangeText={(text) => setDate(text)}
        />
        <View style={styles.row}>
          <TextInput
            label="Name"
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.name}
          />
          <TextInput
            label="Amount"
            value={amount.toString()}
            onChangeText={(text) => setAmount(text)}
            keyboardType="numeric"
            style={styles.amount}
          />
        </View>
        <TextInput
          label="Remark"
          value={remark}
          onChangeText={(text) => setRemark(text)}
          multiline={true}
          style={{ height: 100 }}
        />
        <View style={styles.row}>
          <Text style={styles.relatedFriends}>Related Friends</Text>
          <Button
            onPress={onSelectAll}
            title={'Select All'}
            color={Colors.BUTTON}
          />
          <Button
            onPress={onUnselectAll}
            title={'Unselect All'}
            color={Colors.BUTTON}
          />
        </View>
      </View>
      {console.log('before list')}
      {console.log(friendListForCheckBox)}
      <FlatList
        data={friendListForCheckBox.sort((a, b) =>
          a.name.localeCompare(b.name)
        )}
        numColumns={2}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <>
          {console.log(item.selected)}
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
    </KeyboardAvoidingView>
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
    height: 30,
    margin: 5,
    padding: 5,
    alignSelf: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.PRIMARY,
  },
  row: {
    flexDirection: 'row',
  },
  name: {
    width: '60%',
  },
  amount: {
    width: '40%',
  },
});
