import { useEffect } from "react";
import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import ReactQuill from "react-quill";

interface Props {
  value?: string;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

export const DescriptionField: React.FC<Props> = ({ value, register, setValue }) => {
  const theme = "snow";
  const placeholder = "Type something here...";

  useEffect(() => {
    register("description");
    setValue("description", "");
  }, [register, setValue]);

  const onEditorStateChanged = (editorState: string) => {
    setValue("description", editorState);
  };

  return (
    <ReactQuill theme={theme} placeholder={placeholder} onChange={onEditorStateChanged} />
  );
};
