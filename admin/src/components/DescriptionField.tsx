import ReactQuill from "react-quill";

export const DescriptionField = () => {
  const theme = "snow";
  const placeholder = "Type something here...";

  return <ReactQuill theme={theme} placeholder={placeholder} />;
};
