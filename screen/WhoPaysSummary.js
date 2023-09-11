import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import Constants from 'expo-constants';
import { DataTable } from 'react-native-paper';

import Colors from '../misc/Colors';
import { useFriends } from '../context/FriendContext';

const WhoPaysSummary = () => {
  const _friends = useFriends();
  const [_summaryList, setSummaryList] = useState([]);

  //Table
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, _summaryList.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const buildSummary = (fds) => {
    let surplus = fds
      .filter((fd) => fd.balance > 0)
      .map((fd) => {
        return { name: fd.name, balance: Number(fd.balance.toFixed(2)) };
      })
      .sort((a, b) => (a.balance > b.balance ? -1 : 1));
    let deficit = fds
      .filter((fd) => fd.balance < 0)
      .map((fd) => {
        return { name: fd.name, balance: Number(Math.abs(fd.balance).toFixed(2)) };
      })
      .sort((a, b) => (a.balance > b.balance ? -1 : 1));
    let summaryList = [];

    for (let surplusFd of surplus) {
      let positiveBalance = surplusFd.balance;
      for (let deficitFd of deficit) {
        if (deficitFd.balance > 0) {
          let b = positiveBalance;
          if (positiveBalance > deficitFd.balance) {
            summaryList = [
              ...summaryList,
              {
                debtor: deficitFd.name,
                creditor: surplusFd.name,
                amount: deficitFd.balance,
              },
            ];
            positiveBalance = positiveBalance - deficitFd.balance;
            deficitFd.balance = 0; //deficit balance done
          } else {
            summaryList = [
              ...summaryList,
              {
                debtor: deficitFd.name,
                creditor: surplusFd.name,
                amount: positiveBalance,
              },
            ];
            deficitFd.balance -= positiveBalance; //balance not done
            positiveBalance = 0;
          }
          
          if (positiveBalance <= 0) break;
        }
      }
    }

    setSummaryList(
      summaryList.sort((a, b) => a.debtor.localeCompare(b.debtor))
    );
  };

  useEffect(() => {
    buildSummary(_friends);
    //AsyncStorage.clear();
  }, [_friends]);

  //const [_summaryList] = useState();

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Debtor</DataTable.Title>
          <DataTable.Title>Creditor</DataTable.Title>
          <DataTable.Title numeric>Amount</DataTable.Title>
        </DataTable.Header>

        {_summaryList.slice(from, to).map((item) => (
          <DataTable.Row>
            <DataTable.Cell textStyle={styles.dataTableText}>
              <Text style={styles.dataTable_debtor}>{item.debtor}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styles.dataTable_creditor}>{item.creditor}</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>${item.amount.toFixed(2)}</DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(_summaryList.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${_summaryList.length}`}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: Constants.statusBarHeight + 30,
  },
  dataTable_debtor: {
    color: Colors.ERROR,
    fontWeight: 'Bold',
  },
  dataTable_creditor: {
    color: Colors.BUTTON,
    fontWeight: 'Bold',
  },
  row: {
    flexDirection: 'row',
  },
});

export default WhoPaysSummary;
