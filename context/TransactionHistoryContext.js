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
    //const result = JSON.stringify(initialTransactionHistorys);
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
    saveTransactionHistorys();
    //AsyncStorage.clear();
  }, [transactionHistorys]);

  const saveTransactionHistorys = async () => {
    if (isFirstTimeOpenApp === false) {
      console.log('Save');
      console.log(transactionHistorys);
      await AsyncStorage.setItem(
        'transactionHistorys',
        JSON.stringify(transactionHistorys)
      );
    }
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
          relatedFriends: action.relatedFriends,
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

//test data
const initialTransactionHistorys = [
  {
    id: 0,
    date: '2023/07/07',
    name: 'Harrison',
    amount: 200,
    remark: 'car',
    relatedFriends: ['Ben', 'Ken', 'Sam'],
    creator: 'harrison',
  },
  {
    id: 1,
    date: '2023/07/08',
    name: 'Ben',
    amount: 40,
    remark: 'grid',
    relatedFriends: ['Ben','Sam'],
    creator: 'harrison',
  },
  {
    id: 2,
    date: '2023/07/09',
    name: 'Ken',
    amount: 88.8,
    remark: 'floor',
    relatedFriends: ['Ben', 'Ken'],
    creator: 'harrison',
  },
];
