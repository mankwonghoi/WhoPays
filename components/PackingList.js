import { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RoundIconBtn from './RoundIconBtn';
import Colors from '../misc/Colors';

export default function PackingList({ friends, onPress }) {
  //var totalPaid = friends.reduce((a, v) => (a = a + Number(v.paid)), 0);

  return (
      <View style={styles.containor}>
        <View style={styles.row}>
          <Text
            style={styles.header}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            Friends
          </Text>
          <Text
            style={styles.header}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            Paid
          </Text>
          <Text
            style={[styles.header, styles.header_last]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            OutStanding Balance
          </Text>
          <Text></Text>
        </View>
        <FlatList
          data={friends}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.item}>
                <Text>{item.name}</Text>
              </View>
              <View style={styles.item}>
                <Text>${item.paid.toFixed(2)}</Text>
              </View>
              <View style={styles.item}>
                <TouchableOpacity onPress={() => onPress(item.detail)}>
                  {item.balance < 0 ? (
                    <Text style={{ color: 'red' }}>
                      ${item.balance.toFixed(2)}
                    </Text>
                  ) : (
                    <Text>${item.balance.toFixed(2)}</Text>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.item} />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    width: '28%',
    borderBottomWidth: 0.8,
    height: 50,
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    justifyContent: 'center',
    width: '28%',
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 0.8,
    flexShrink: 1,
    height: 30,
  },
  header_last: {
    width: '44%',
  },
  containor:{
    maxHeight:'90%'
  }
});
