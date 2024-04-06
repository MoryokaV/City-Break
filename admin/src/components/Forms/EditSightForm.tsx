import { SubmitHandler, useForm } from "react-hook-form";
import { InputField } from "./Fields/InputField";
import { FormType } from "../../models/FormModel";
import { Sight } from "../../models/SightModel";
import { createImagesFormData } from "../../utils/images";
import { TagsField } from "./Fields/TagsField";
import { DescriptionField } from "./Fields/DescriptionField";
import { ImagesField } from "./Fields/ImagesField";
import { PrimaryImageField } from "./Fields/PrimaryImageField";
import {
  latitudeRegExp,
  latitudeRegExpTitle,
  longitudeRegExp,
  longitudeRegExpTitle,
} from "../../data/RegExpData";

interface Props {
  sight: Sight;
}

export const EditSightForm: React.FC<Props> = ({ sight }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormType<Sight>>();

  const files = watch("files", []);
  const images = watch("images", sight.images);
  const activeTags = watch("tags", sight.tags);

  const onSubmit: SubmitHandler<FormType<Sight>> = async data => {
    const formData = new FormData();
    const { files, ...updatedSight } = data;

    console.log(data);

    createImagesFormData(formData, files);

    if (files.length !== 0) {
      await fetch("/api/uploadImages/sights", {
        method: "POST",
        body: formData,
      }).then(response => {
        if (response.status === 413) {
          alert("Files size should be less than 15MB");
        }
      });
    }

    await fetch("/api/editSight", {
      method: "PUT",
      body: JSON.stringify({
        images_to_delete: [],
        _id: sight._id,
        sight: updatedSight,
      }),
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    });

    // reset();
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
          defaultValue={sight.name}
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
        <DescriptionField
          register={register}
          setValue={setValue}
          defaultValue={sight.description}
        />
      </section>
      <ImagesField
        register={register}
        images={images}
        files={files}
        setValue={setValue}
        collection="sights"
      />
      <section className="col-12">
        <PrimaryImageField register={register} max={images && images.length} />
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
          defaultValue={sight.latitude}
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
          defaultValue={sight.longitude}
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
          defaultValue={sight.external_link}
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