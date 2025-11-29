import { useRef, useState, useContext, type ChangeEvent, type KeyboardEvent } from "react";
import "./Editor.css";
import { TodoDispatchContext } from "../App";

const Editor = () => {
  const { onCreate } = useContext(TodoDispatchContext);
  const [content, setContent] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeContent = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const onKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const onSubmit = () => {
    const trimmed = content.trim();
    if (trimmed === "") {
      inputRef.current?.focus();
      return;
    }
    onCreate(trimmed);
    setContent("");
  };

  return (
    <div className="Editor">
      <input
        ref={inputRef}
        value={content}
        onChange={onChangeContent}
        onKeyDown={onKeydown}
        placeholder="새로운 Todo를 입력하세요"
      />
      <button onClick={onSubmit}>추가</button>
    </div>
  );
};

export default Editor;
