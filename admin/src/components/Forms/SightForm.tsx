import "react-quill/dist/quill.snow.css";
import { DescriptionField } from "./Fields/DescriptionField";
import {
  SubmitHandler,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
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

interface Props {
  formKey: number;
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<FormType<Sight>, undefined>;
  reset: UseFormReset<FormType<Sight>>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  isSubmitting: boolean;
  files: FileList;
  activeTags: Array<string>;
}

export const SightForm: React.FC<Props> = ({
  formKey,
  register,
  handleSubmit,
  reset,
  setValue,
  isSubmitting,
  files,
  activeTags,
}) => {
  const { user } = useAuth();

  const onSubmit: SubmitHandler<FormType<Sight>> = async data => {
    const formData = new FormData();

    console.log(data);

    Array.from(data.images).forEach(file => {
      formData.append("files[]", file);
    });

    const images = Array.from(data.images).map(
      image => `${"/static/media/sights/" + user?.city_id}/${image.name}`,
    );

    const sight: Sight = { ...data, images: images };

    console.log(sight);
    console.log(formData);

    // reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row g-3" key={formKey}>
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
      <TagsField collection="sights" register={register} setValue={setValue} activeTags={activeTags} />
      <section className="col-12">
        <label className="form-label">Description</label>
        <DescriptionField register={register} setValue={setValue} />
      </section>
      <ImagesField register={register} files={files} setValue={setValue} />
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
        <button type="submit" className={`btn btn-primary ${isSubmitting && "loading-btn"}`}>
          <span>Save</span>
        </button>
      </section>
    </form>
  );
};
