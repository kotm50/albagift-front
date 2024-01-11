export const modules = {
  toolbar: {
    container: [["bold", "underline", "italic", { color: [] }]],
  },
};

export const modulesB = {
  toolbar: [
    //[{ 'font': [] }],
    //[{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ align: [] }], // dropdown with defaults from theme
    ["clean"],
  ],
};

export const formats = [
  //'font',
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "align",
  "color",
  "background",
];
