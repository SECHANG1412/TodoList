import "./App.css";
import { useRef, useReducer, useCallback, useMemo, createContext } from "react";
import Header from "./components/Header";
import Editor from "./components/Editor";
import List from "./components/List";
import type { Todo } from "./types";

type TodoAction =
  | {
      type: "CREATE";
      data: Todo;
    }
  | {
      type: "UPDATE" | "DELETE";
      targetId: number;
    };

const mockData: Todo[] = [
  {
    id: 0,
    isDone: false,
    content: "React 공부하기",
    date: new Date().getTime(),
  },
  {
    id: 1,
    isDone: false,
    content: "빨래하기",
    date: new Date().getTime(),
  },
  {
    id: 2,
    isDone: false,
    content: "주말 연습하기",
    date: new Date().getTime(),
  },
];

function reducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "CREATE":
      return [action.data, ...state];
    case "UPDATE":
      return state.map((item) => (item.id === action.targetId ? { ...item, isDone: !item.isDone } : item));
    case "DELETE":
      return state.filter((item) => item.id !== action.targetId);
    default:
      return state;
  }
}

export type TodoDispatch = {
  onCreate: (content: string) => void;
  onUpdate: (targetId: number) => void;
  onDelete: (targetId: number) => void;
};

const missingDispatch = (actionName: keyof TodoDispatch) => () => {
  throw new Error(`TodoDispatchContext is missing while calling ${actionName}.`);
};

export const TodoStateContext = createContext<Todo[]>([]);
export const TodoDispatchContext = createContext<TodoDispatch>({
  onCreate: missingDispatch("onCreate"),
  onUpdate: missingDispatch("onUpdate"),
  onDelete: missingDispatch("onDelete"),
});

function App() {
  const [todos, dispatch] = useReducer(reducer, mockData);
  const idRef = useRef<number>(mockData.length);

  const onCreate = useCallback((content: string) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        isDone: false,
        content: content,
        date: new Date().getTime(),
      },
    });
  }, []);

  const onUpdate = useCallback((targetId: number) => {
    dispatch({
      type: "UPDATE",
      targetId: targetId,
    });
  }, []);

  const onDelete = useCallback((targetId: number) => {
    dispatch({
      type: "DELETE",
      targetId: targetId,
    });
  }, []);

  const memoizedDispatch = useMemo(
    () => ({
      onCreate,
      onUpdate,
      onDelete,
    }),
    [onCreate, onUpdate, onDelete]
  );

  return (
    <div className="App">
      <Header />
      <TodoStateContext.Provider value={todos}>
        <TodoDispatchContext.Provider value={memoizedDispatch}>
          <Editor />
          <List />
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
    </div>
  );
}

export default App;
