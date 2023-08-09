import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendsContext = createContext(null);
const FriendsDispatchContext = createContext(null);

export function FriendsProvider({ children }) {
  const [friends, dispatch] = useReducer(friendReducer, []);



  return (
    <FriendsContext.Provider value={friends}>
      <FriendsDispatchContext.Provider value={dispatch}>
        {children}
      </FriendsDispatchContext.Provider>
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}

export function useFriendsDispatch() {
  return useContext(FriendsDispatchContext);
}

function friendReducer(friends, action) {
  console.log(action);
  switch (action.type) {
    case 'add': {
      return [...friends, action];
    }
    case 'delete': {
      return friends.filter((fd) => fd !== action);
    }
    case 'set': {
      let fds = [];
      for (let fd of action.friends) {
        fds = [...fds, fd.name];
      }
      return fds;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

//test data
const initialFriends = ['Ben', 'Ken', 'Sam'];
