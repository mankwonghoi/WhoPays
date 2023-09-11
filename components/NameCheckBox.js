import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import Checkbox from 'expo-checkbox';

import Colors from '../misc/Colors';

const NameCheckbox = ({
  name,
  ticked,
  mode,
  onClick,
  checkBoxStyle,
  rowStyle,
  textStyle,
}) => {
  const [text, setText] = useState('');

  const onClickCheckBox = (click) => {
    if (mode === 'edit') {
      onClick(click, text);
    } else {
      onClick(click, name);
    }
  };

  return (
    <View style={[styles.row, rowStyle]}>
      <Checkbox
        disabled={false}
        value={ticked}
        onValueChange={(value) => {
          onClickCheckBox(value);
        }}
        color={ticked ? Colors.BUTTON : Colors.DARK}
        style={[styles.checkbox, checkBoxStyle]}
      />
      {mode === 'edit' ? (
        <TextInput
          placeholder="Add"
          value={text}
          onChangeText={setText}
          style={[styles.textInput, textStyle]}
          numberOfLines={1}
        />
      ) : (
        <Text style={[styles.text, textStyle]}>{name}</Text>
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
    backgroundColor: Colors.LIGHT,
    height: 30,
    width: 30,
  },
  text: {
    marginTop: 5,
    marginLeft: 3,
  },
  textInput: {
    marginLeft: 3,
    borderWidth: 1,
    borderColor: Colors.BUTTON,
    color: Colors.BUTTON,
    width: Dimensions.get('window').width / 2,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT,
    paddingLeft: 5,
  },
});

export default NameCheckbox;
