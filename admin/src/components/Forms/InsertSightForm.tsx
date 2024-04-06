import "react-quill/dist/quill.snow.css";
import { DescriptionField } from "./Fields/DescriptionField";
import {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import {
  latitudeRegExp,
  latitudeRegExpTitle,
  longitudeRegExp,
  longitudeRegExpTitle,
} from "../../data/RegExpData";
import { Sight } from "../../models/SightModel";
import { TagsField } from "./Fields/TagsField";
import { InputField } from "./Fields/InputField";
import { PrimaryImageField } from "./Fields/PrimaryImageField";
import { ImagesField } from "./Fields/ImagesField";
import { useAuth } from "../../hooks/useAuth";
import { FormType } from "../../models/FormModel";
import { createImagesFormData } from "../../utils/images";
import { useEffect } from "react";

interface Props {
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<FormType<Sight>, undefined>;
  setValue: UseFormSetValue<any>;
  resetForm: () => void;
  isSubmitting: boolean;
  images: Array<string>;
  files: File[];
  activeTags: Array<string>;
}

export const InsertSightForm: React.FC<Props> = ({
  register,
  handleSubmit,
  resetForm,
  setValue,
  isSubmitting,
  images,
  files,
  activeTags,
}) => {
  const onSubmit: SubmitHandler<FormType<Sight>> = async data => {
    const formData = new FormData();
    const { files, ...sight } = data;

    console.log(data);

    createImagesFormData(formData, files);

    await fetch("/api/uploadImages/sights", {
      method: "POST",
      body: formData,
    }).then(response => {
      if (response.status === 413) {
        alert("Files size should be less than 15MB");
      }
    });

    await fetch("/api/insertSight", {
      method: "POST",
      body: JSON.stringify(sight),
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    });

    resetForm();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
      <section className="col-12">
        <InputField
          id="name"
          label="Name"
          register={register}
          type="text"
          required
          valueAsNumber={false}
          maxLength={60}
        />
      </section>
      <TagsField
        collection="sights"
        register={register}
        setValue={setValue}
        activeTags={activeTags}
      />
      <section className="col-12">
        <label className="form-label">Description</label>
        <DescriptionField register={register} setValue={setValue} />
      </section>
      <ImagesField
        register={register}
        images={images}
        files={files}
        collection="sights"
        setValue={setValue}
      />
      <section className="col-12">
        <PrimaryImageField register={register} max={files && files.length} />
      </section>
      <section className="col-sm-6">
        <InputField
          id="latitude"
          label="Latitude"
          register={register}
          type="text"
          required
          valueAsNumber={true}
          pattern={latitudeRegExp}
          title={latitudeRegExpTitle}
        />
      </section>
      <section className="col-sm-6">
        <InputField
          id="longitude"
          label="Longitude"
          register={register}
          type="text"
          required
          valueAsNumber={true}
          pattern={longitudeRegExp}
          title={longitudeRegExpTitle}
        />
      </section>
      <section className="col-12">
        <InputField
          id="external_link"
          label="External link"
          register={register}
          type="url"
          required
          valueAsNumber={false}
        />
        <div className="form-text">Note: it must be a website URL</div>
      </section>
      <section className="col-12">
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting && "loading-btn"}`}
        >
          <span>Save</span>
        </button>
      </section>
    </form>
  );
};