import "./List.css";
import TodoItem from "./TodoItem";
import { useState, useMemo, useContext, type ChangeEvent } from "react";
import { TodoStateContext } from "../App";
import type { Todo } from "../types";

const List = () => {
  const todos = useContext(TodoStateContext);
  const [search, setSearch] = useState<string>("");

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredTodos = useMemo(() => {
    if (search.trim() === "") {
      return todos;
    }
    const lowerCased = search.toLowerCase();
    return todos.filter((todo: Todo) => todo.content.toLowerCase().includes(lowerCased));
  }, [search, todos]);

  const { totalCount, doneCount, notDoneCount } = useMemo(() => {
    const totalCount = todos.length;
    const doneCount = todos.filter((todo) => todo.isDone).length;
    const notDoneCount = totalCount - doneCount;

    return {
      totalCount,
      doneCount,
      notDoneCount,
    };
  }, [todos]);

  return (
    <div className="List">
      <h4>Todo List</h4>
      <div>
        <div>total: {totalCount}</div>
        <div>done: {doneCount}</div>
        <div>notDone: {notDoneCount}</div>
      </div>
      <input value={search} onChange={onChangeSearch} placeholder="검색어를 입력하세요" />
      <div className="todos_wrapper">
        {filteredTodos.map((todo) => {
          return <TodoItem key={todo.id} {...todo} />;
        })}
      </div>
    </div>
  );
};

export default List;
