import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionHistorysContext = createContext(null);

const TransactionHistorysDispatchContext = createContext(null);

export function TransactionHistorysProvider({ children }) {
  const [isFirstTimeOpenApp, setIsFirstTimeOpenApp] = useState(true);
  const [transactionHistorys, dispatch] = useReducer(
    transactionHistoryReducer,
    []
  );

  useEffect(() => {
    getTransactionHistorys();
    setIsFirstTimeOpenApp(false);
    //AsyncStorage.clear();
  }, []);

  const getTransactionHistorys = async () => {
    console.log('get');
    const result = await AsyncStorage.getItem('transactionHistorys');
    if (result !== null) {
      let ths = JSON.parse(result);
      dispatch({
        type: 'set',
        transactionHistorys: ths,
      });
    }
    return null;
  };

  useEffect(() => {
    console.log(isFirstTimeOpenApp)
    if (isFirstTimeOpenApp === false) {
      saveTransactionHistorys();
      //findFriend();
      //AsyncStorage.clear();
    }
  }, [transactionHistorys]);

  const saveTransactionHistorys = async () => {
    console.log('Save');
    //if (transactionHistorys.length > 0) {
    console.log(transactionHistorys);
    await AsyncStorage.setItem(
      'transactionHistorys',
      JSON.stringify(transactionHistorys)
    );
    //}
  };

  return (
    <TransactionHistorysContext.Provider value={transactionHistorys}>
      <TransactionHistorysDispatchContext.Provider value={dispatch}>
        {children}
      </TransactionHistorysDispatchContext.Provider>
    </TransactionHistorysContext.Provider>
  );
}

export function useTransactionHistorys() {
  return useContext(TransactionHistorysContext);
}

export function useTransactionHistorysDispatch() {
  return useContext(TransactionHistorysDispatchContext);
}

function transactionHistoryReducer(transactionHistorys, action) {
  console.log(action);
  switch (action.type) {
    case 'add': {
      return [
        ...transactionHistorys,
        {
          id: Date.now(),
          date: action.date,
          name: action.name,
          amount: action.amount,
          remark: action.remark,
          creator: action.creator,
        },
      ];
    }
    case 'update': {
      return transactionHistorys.map((t) => {
        if (t.id === action.transactionHistory.id) {
          return action.transactionHistory;
        } else {
          return t;
        }
      });
    }
    case 'delete': {
      return transactionHistorys.filter((t) => t.id !== action.id);
    }
    case 'set': {
      return action.transactionHistorys;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
