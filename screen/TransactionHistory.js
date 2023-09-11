import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList,Button,Alert } from 'react-native';
import Constants from 'expo-constants';

import { useTransactionHistorys,useTransactionHistorysDispatch } from '../context/TransactionHistoryContext';
import RoundIconBtn from '../components/RoundIconBtn';
import Colors from '../misc/Colors';
import Transaction from '../components/Transaction';


const TransactionHistory = ({ navigation }) => {
  const transactionHistorys = useTransactionHistorys();
  const transactionHistorysDispatch = useTransactionHistorysDispatch();
  const [keyword, setKeyword] = useState('');

  const addTransactionHistory = () => {
    navigation.navigate('TransactionHistoryDetail', {id:null, mode:'new'});
  };

  const openTransaction = (id) => {
    navigation.navigate('TransactionHistoryDetail', {id:id, mode:'edit'});
  };

  const renderPostListHeader = () => {
    return (
      <>
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder={'Search Name'}
          style={styles.input}
        />
      </>
    );
  };

  const renderPostListFooter = () => {
    return (
      <>
        <Button
          onPress={displayDeleteAlert}
          title="Delete All Transaction"
          color={Colors.PRIMARY}
          accessibilityLabel="Learn more about this purple button"
        />
      </>
    );
  };

  const deleteAllTransaction = () => {
    transactionHistorysDispatch({
      type: 'set',
      transactionHistorys: [],
    });
  };

  const displayDeleteAlert = () => {
    //console.log('delete');
    Alert.alert(
      'Are You Sure?',
      'This action will delete ALL your record permanently!',
      [
        {
          text: 'Delete',
          onPress: deleteAllTransaction,
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

  let thData = transactionHistorys.filter((item)=>item.name.indexOf(keyword) > -1).sort((a, b) => { return b.id - a.id; })

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={thData}
          ListHeaderComponent={renderPostListHeader()}
          renderItem={({ item }) => (
            <Transaction item={item} onPress={() => openTransaction(item.id)} />
          )}
          ListFooterComponent={renderPostListFooter()}
          keyExtractor={(item) => item.id}
        />
        <RoundIconBtn
          antIconName="add"
          size={50}
          color={Colors.DARK}
          onPress={() => {
            addTransactionHistory();
          }}
          style={styles.addBtn}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: Constants.statusBarHeight+30,
  },
  addBtn: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    borderRadius: 33,
  },
  input: {
    backgroundColor: Colors.LIGHT,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    color:Colors.PRIMARY,
  },
});

export default TransactionHistory;
