import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import Checkbox from 'expo-checkbox';

import Colors from '../misc/Colors';

const NameCheckbox = ({ name, ticked, mode, onClick}) => {
  const [checked, setChecked] = useState(ticked);
  const [text, setText] = useState('');

  const onClickCheckBox = (click) => {
    setChecked(click);
    if (mode === 'edit') {
      onClick(click,text);
    }
    else{
      onClick(click,name);
    }
  };

  return (
    <View style={styles.row}>
      <Checkbox
        disabled={false}
        value={checked}
        onValueChange={(value) => {
          onClickCheckBox(value);
        }}
        color={checked ? Colors.BUTTON : undefined}
        style={styles.checkbox}
      />
      {mode === 'edit' ? (
        <TextInput placeholder="Add" value={text} onChangeText={setText} style={styles.textInput}/>
      ) : (
        <Text style={styles.text}>{name}</Text>
      )}
    </View>
  );
};

const width = Dimensions.get('window').width - 40;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    //backgroundColor: Colors.CHECKBOX,
    width: width / 2 - 5,
    //borderRadius: 10,
    //overflow: 'hidden',
    padding: 2,
  },
  checkbox: {
    backgroundColor: Colors.PRIMARY,
  },
  text: {
    marginLeft: 3,
  },textInput: {
    marginLeft: 3,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    color: Colors.PRIMARY,
    width: Dimensions.get('window').width / 2,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT,
    paddingLeft: 5,
  },
});

export default NameCheckbox;
