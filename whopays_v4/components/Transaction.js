import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Colors from '../misc/Colors';

const Transaction = ({ item, onPress }) => {
  const { name, amount, remark, creator } = item;
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.header}>{item.date}</Text>
      <Text numberOfLines={3}>
        {name} Paid ${amount} for {remark}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.DARK,
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.BUTTON,
    marginBottom:5,
  },
});

export default Transaction;
