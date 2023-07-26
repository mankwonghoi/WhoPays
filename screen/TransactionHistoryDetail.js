import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import Constants from 'expo-constants';
import moment from 'moment';

import {
  useTransactionHistorys,
  useTransactionHistorysDispatch,
} from '../Context/TransactionHistoryContext';
import RoundIconBtn from '../components/RoundIconBtn';
import Colors from '../misc/Colors';

export default function TransactionHistoryDetail({ route, navigation }) {
  const mode = route.params.mode;
  const transactionId = route.params.id;
  const transactionHistorys = useTransactionHistorys();
  const dispatch = useTransactionHistorysDispatch();
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
    };
  } else {
    transaction = {
      id: 0, //no use
      date: moment(Date.now()).format('YYYY/MM/DD'),
      name: '',
      amount: 0,
      remark: '',
    };
  }

  //Transaction form
  const [date, setDate] = useState(transaction?.date);
  const [name, setName] = useState(transaction?.name);
  const [amount, setAmount] = useState(transaction?.amount);
  const [remark, setRemark] = useState(transaction?.remark);

  const deleteTransaction = () => {
    dispatch({
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

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TextInput
            label="Date(YYYY/MM/DD)"
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
            style={{ height: 300 }}
          />
          {mode === 'edit' ? (
            <>
              <RoundIconBtn
                antIconName="save"
                size={50}
                color={Colors.DARK}
                onPress={() => {
                  dispatch({
                    type: 'update',
                    transactionHistory: {
                      ...transaction,
                      date: date.trim(),
                      name: name.trim(),
                      amount: Number(amount),
                      remark: remark,
                    },
                  });
                  navigation.goBack();
                }}
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
                onPress={() => {
                  dispatch({
                    type: 'add',
                    id: Date.now(),
                    date: date.trim(),
                    name: name.trim(),
                    amount: Number(amount),
                    remark: remark,
                  });
                  navigation.goBack();
                }}
                style={styles.saveBtn}
              />
            </>
          ) : null}
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
  date: {
    backgroundColor: '#e7e7e7',
    borderBottomWidth: 1,
    borderBottomColor: '#ababab',
    padding: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#6a6a6a',
  },
});
