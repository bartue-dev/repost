import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  commentAuthor: string
}

const ChildCommentTextEditor: React.FC<TextEditorProps> = ({ value, onChange, commentAuthor }) => {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && toolbarRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Add comment",
        modules: {
          toolbar: toolbarRef.current, // Use custom toolbar element
        },
      });

      if (commentAuthor) {
        const mentionText = `@${commentAuthor} `;
        quillInstance.current.root.innerHTML = mentionText;
        onChange(mentionText);
      }

      // Listen for text changes
      quillInstance.current.on("text-change", () => {
        const html = editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
        onChange(html);
      });
    }
  }, [onChange, commentAuthor]);

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
      className="quill-wrapper flex flex-col justify-between border rounded-md w-full  !overflow-y-auto h-50"
    >
      {/* Editor area */}
      <div 
        ref={editorRef} 
        className="ql-container ql-snow transition-all duration-200 !border-none !text-base overflow-hidden"
      />

      {/* Toolbar goes BELOW */}
      <div 
        ref={toolbarRef} 
        className="ql-toolbar ql-snow border-gray-300 !border-l-0 !border-r-0 !border-b-0 !border-t-1"
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

export default ChildCommentTextEditor;
