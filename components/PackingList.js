import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList } from 'react-native';
import RoundIconBtn from './RoundIconBtn';
import Colors from '../misc/Colors';

export default function PackingList({
  friends,
  onUpdateFriend,
  onDeleteFriend,
}) {
  var totalPaid = friends.reduce((a, v) => (a = a + Number(v.paid)), 0);

  const renderItem = useCallback(({item}) => (
    <View key={item.key}>
        <Text>{item.title}</Text>
    </View>
  ), []);

  return (
    <>
      <View>
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
            style={[styles.header,styles.header_last]}
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
                <Text>${item.paid}</Text>
              </View>
              <View style={styles.item}>
                <Text>
                {(item.paid - totalPaid / friends.length) < 0 ?
                  <Text style={{color:'red'}}>${(item.paid - totalPaid / friends.length).toFixed(2)}</Text>
                  :
                    <Text>${(item.paid - totalPaid / friends.length).toFixed(2)}</Text>
                }
                </Text>
              </View>
              {item.paid===0?
              <View style={styles.item}>
                <RoundIconBtn
                  antIconName="delete-outline"
                  size={16}
                  color="black"
                  onPress={() => onDeleteFriend(item.id)}
                  style={styles.deletebtn}
                />
              </View>:<View style={styles.item}/>}
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    width: '28%',
    borderBottomWidth:0.8,
    height:50,
  },
  deletebtn: {
    margin: 10,
    width:33,
  },
  row: {
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: Colors.TEXTINPUT,
    color: Colors.ERROR,
    width: '90%',
    height: 20,
    borderWidth: 1,
    marginLeft:2,
    left:2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  header: {
    justifyContent: 'center',
    width: '28%',
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth:0.8,
    flexShrink: 1,
    height: 30,
  },
  header_last:{
    width: '44%',
  }
});
