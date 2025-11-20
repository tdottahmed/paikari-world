import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
    return (
        <div className="text-white">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                className="bg-[#0C1311] text-white rounded-lg"
                modules={{
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                        ["clean"],
                    ],
                }}
                formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "list",
                    "bullet",
                    "link",
                    "image",
                ]}
            />
            <style>
                {`
          .ql-toolbar {
            background: #0C1311;
            border-color: #1E2826 !important;
          }
          .ql-container {
            background: #0C1311;
            border-color: #1E2826 !important;
          }
          .ql-editor {
            color: white !important;
            min-height: 180px;
          }
          .ql-editor.ql-blank::before {
            color: #aaa;
          }
          .ql-toolbar button:hover svg,
          .ql-toolbar button.ql-active svg {
            stroke: #2DE3A7 !important;
          }
        `}
            </style>
        </div>
    );
}
