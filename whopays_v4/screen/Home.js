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
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
} from 'react-native-paper';
import { WebView } from 'react-native-webview';

import { useTransactionHistorys } from '../context/TransactionHistoryContext';
import { useFriendsDispatch } from '../context/FriendContext';

//const initialFriends = [
//  { id: 0, name: 'Harrison', paid: 10 },
//  { id: 1, name: 'Grace', paid: 20 },
//  { id: 2, name: 'Derek', paid: 35 },
//];

export default function Home() {
  const transactionHistorys = useTransactionHistorys();
  const updateFriendsDispatch = useFriendsDispatch();
  const [friends, setFriends] = useState([]);

  const [visible, setVisible] = useState(false);
  const [dialogMsg, setDialogMsg] = useState();
  const showDialog = (msg) => {
    setVisible(true);
    console.log(msg);
    setDialogMsg(msg);
  };
  const hideDialog = () => setVisible(false);

  const buildFriends = () => {
    let fds = [];
    let index = 0;
    //from transaction historys
    for (let th of transactionHistorys) {
      let totalFds = th.relatedFriends.length;
      let balanceForEveryone = th.amount / totalFds;
      let detailForSpender =
        th.name +
        ' paid $' +
        th.amount.toFixed(2) +
        ' for ' +
        th.remark +
        '.\n';
      let detailForRelatedFriends =
        '{name} need to pay $' +
        balanceForEveryone.toFixed(2) +
        ' for ' +
        th.remark +
        '.\n';

      //Spender
      if (fds.find((fd) => fd.name === th.name)) {
        fds.forEach((fd) => {
          if (fd.name === th.name) {
            fd.paid += th.amount;
            fd.balance += th.amount;
            fd.detail += detailForSpender;
          }
        });
      } else {
        fds = [
          ...fds,
          {
            id: index++,
            name: th.name,
            paid: th.amount,
            balance: th.amount,
            detail: detailForSpender,
          },
        ];
      }

      //Related friends
      for (let rfd of th.relatedFriends) {
        if (fds.find((fd) => fd.name === rfd)) {
          {
            fds.forEach((fd) => {
              if (fd.name === rfd) {
                fd.balance += balanceForEveryone * -1;
                fd.detail += detailForRelatedFriends.replace('{name}', rfd);
              }
            });
          }
        } else {
          fds = [
            ...fds,
            {
              id: index++,
              name: rfd,
              paid: 0,
              balance: balanceForEveryone * -1,
              detail: detailForRelatedFriends.replace('{name}', rfd),
            },
          ];
        }
      }
    }
    setFriends(fds);
    updateFriendsDispatch({
      type: 'set',
      friends: fds,
    });
  };

  let totalPaid = friends.reduce((a, v) => (a = a + Number(v.paid)), 0);

  useEffect(() => {
    buildFriends();
    //AsyncStorage.clear();
  }, [transactionHistorys]);

  return (
    <Provider>
      <View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Detail</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{dialogMsg}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <PackingList
            friends={friends.sort((a, b) => a.name.localeCompare(b.name))}
            onPress={showDialog}
          />
          <Text style={styles.totalPaid}>{`Total Expense: $${totalPaid.toFixed(
            2
          )}`}</Text>
        </View>
      </TouchableWithoutFeedback>
    </Provider>
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
    padding: 5,
    alignSelf: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.BUTTON,
  },
});
