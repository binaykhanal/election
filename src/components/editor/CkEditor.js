"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Get your API base URL from env
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("upload", file);

          fetch(`${API_BASE_URL}/api/upload`, {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              if (!response.ok) throw new Error("Network response was not ok");
              return response.json();
            })
            .then((result) => {
              resolve({ default: result.url });
            })
            .catch((error) => {
              reject(error.message || "Upload failed");
            });
        }),
    );
  }

  abort() {}
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

const CkEditor = ({ editorData, handleEditorChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={editorData}
      config={{
        licenseKey: "GPL",
        extraPlugins: [MyCustomUploadAdapterPlugin],

        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "|",
          "link",
          "uploadImage",
          "insertTable",
          "blockQuote",
          "|",
          "fontColor",
          "fontBackgroundColor",
          "highlight",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "outdent",
          "indent",
          "sourceEditing",
          "|",
          "alignment",
          "horizontalLine",
        ],

        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },

        image: {
          resizeOptions: [
            {
              name: "resizeImage:original",
              label: "Default image width",
              value: null,
            },
            { name: "resizeImage:50", label: "50% page width", value: "50" },
            { name: "resizeImage:75", label: "75% page width", value: "75" },
          ],
          toolbar: [
            "imageTextAlternative",
            "toggleImageCaption",
            "|",
            "imageStyle:inline",
            "imageStyle:wrapText",
            "imageStyle:breakText",
            "|",
            "resizeImage",
          ],
        },

        fontColor: {
          colors: [
            { color: "hsl(0, 0%, 0%)", label: "Black" },
            { color: "hsl(0, 0%, 30%)", label: "Dim grey" },
            { color: "hsl(0, 0%, 60%)", label: "Grey" },
            { color: "hsl(0, 0%, 90%)", label: "Light grey" },
            { color: "hsl(0, 0%, 100%)", label: "White", hasBorder: true },
            { color: "hsl(0, 75%, 60%)", label: "Red" },
            { color: "hsl(30, 75%, 60%)", label: "Orange" },
            { color: "hsl(60, 75%, 60%)", label: "Yellow" },
            { color: "hsl(90, 75%, 60%)", label: "Light green" },
            { color: "hsl(120, 75%, 60%)", label: "Green" },
          ],
        },

        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
        },

        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },

        initialData: editorData,
      }}
      onChange={(_event, editor) => {
        handleEditorChange(editor.getData());
      }}
    />
  );
};

export default CkEditor;
