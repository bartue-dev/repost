import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CommentTextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<Quill | null>(null);
  const [onFocus, setOnFocus] = useState(false);

  useEffect(() => {
    if (editorRef.current && toolbarRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Add comment",
        modules: {
          toolbar: toolbarRef.current, // Use custom toolbar element
        },
      });

      // Listen for text changes
      quillInstance.current.on("text-change", () => {
        const html = editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
        onChange(html);
      });
    }
  }, [onChange]);

  // Keep external value synced
  useEffect(() => {
    const editor = quillInstance.current;
    if (editor && value !== editor.root.innerHTML) {
      editor.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div 
      ref={editorContainerRef} 
      className={`quill-wrapper flex flex-col justify-between border rounded-md w-full ${
          onFocus && "h-[250px] !overflow-y-auto"
        }`}
    >
      {/* Editor area */}
      <div 
        ref={editorRef} 
        onFocus={() => setOnFocus(true)}
        className={`ql-container ql-snow transition-all duration-200 !border-none !text-base ${
          onFocus ? "max-h-[250px] !overflow-y-auto" : "h-[50px]"
        }`}
      />

      {/* Toolbar goes BELOW */}
      <div 
        ref={toolbarRef} 
        className={`ql-toolbar ql-snow border-gray-300 !border-l-0 !border-r-0 !border-b-0 !border-t-1 ${onFocus ? "block" : "hidden"}`}
      >
        <span className="ql-formats">
          <select className="ql-header" defaultValue="">
            <option value="1" />
            <option value="2" />
            <option value="3" />
            <option value="" />
          </select>
          <select className="ql-size" />
        </span>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote" />
          <button className="ql-code-block" />
        </span>
        <span className="ql-formats">
          <button className="ql-link" />
          <button className="ql-image" />
        </span>
        <span className="ql-formats">
          <button className="ql-clean" />
        </span>
      </div>
    </div>
  );
};

export default CommentTextEditor;
