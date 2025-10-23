import React, { useEffect, useRef } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const quillInstance = useRef<Quill | null>(null)

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Start writing here...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link", "image"],
            ["clean"],
          ],
        },
      })

      // Listen for text changes
      quillInstance.current.on("text-change", () => {
        const html = editorRef.current?.querySelector(".ql-editor")?.innerHTML || ""
        onChange(html)
      })
    }
  }, [onChange])

  // Keep external value synced (like controlled input)
  useEffect(() => {
    const editor = quillInstance.current
    if (editor && value !== editor.root.innerHTML) {
      editor.root.innerHTML = value
    }
  }, [value])

  return (
    <div className="overflow-hidden shadow-xs">
      <div ref={editorRef} className="min-h-[250px] bg-white" />
    </div>
  )
}

export default TextEditor
