import { useState } from 'react';
import { StyleSheet, TextInput, Dimensions, View } from 'react-native';
import Colors from '../misc/Colors';
import RoundIconBtn from './RoundIconBtn';

export default function TextBoxAdd({ onAdd }) {
  const [text, setText] = useState('');
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.textInput}
        placeholder="Add"
        value={text}
        onChangeText={setText}
      />
      <RoundIconBtn
        antIconName="add"
        size={24}
        color={Colors.DARK}
        onPress={() => {
          setText('');
          onAdd(text);
        }}
        style={styles.addBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 40,
  },
  row: {
    flexDirection: 'row',
  },
  textInput: {
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    color: Colors.PRIMARY,
    width: Dimensions.get('window').width / 2,
    height: 40,
    borderRadius: 10,
    paddingLeft: 15,
    marginTop:20,
    fontSize: 20,
    marginBottom: 15,
  },
  addBtn:{
    marginTop:20,
    marginBottom: 15,
    marginLeft:3,
  }
});
