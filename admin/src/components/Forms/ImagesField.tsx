import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";

interface Props {
  register: UseFormRegister<FieldValues>;
  files: FileList;
  setValue: UseFormSetValue<FieldValues>;
}

export const ImagesField: React.FC<Props> = ({ register, files, setValue }) => {
  const removeImage = (filename: string) => {
    setValue(
      "images",
      Array.from(files).filter(file => file.name !== filename),
    );
  };

  return (
    <section className="col-12 d-flex gap-3">
      <label htmlFor="images" style={{ cursor: "pointer" }}>
        Images
        <input
          type="file"
          className="hidden-input"
          id="images"
          accept="image/*"
          multiple
          required={!files || files.length === 0}
          {...register("images")}
        />
      </label>
      <ul className="img-container">
        {files &&
          Array.from(files).map((file, index) => {
            return (
              <li key={index} className="highlight-onhover">
                <a className="group">
                  <IoCloudUploadOutline />
                  {file.name}
                </a>
                <button
                  type="button"
                  className="btn btn-icon remove-img-btn"
                  onClick={() => removeImage(file.name)}
                >
                  <IoCloseOutline />
                </button>
              </li>
            );
          })}
      </ul>
    </section>
  );
};
