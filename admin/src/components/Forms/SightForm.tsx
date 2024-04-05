import "react-quill/dist/quill.snow.css";
import { DescriptionField } from "./DescriptionField";
import {
  FieldValues,
  SubmitHandler,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  latitudeRegExp,
  latitudeRegExpTitle,
  longitudeRegExp,
  longitudeRegExpTitle,
} from "../../data/RegExpData";
import { Sight } from "../../models/SightModel";
import { TagsField } from "./TagsField";
import { InputField } from "./InputField";
import { PrimaryImageField } from "./PrimaryImageField";
import { ImagesField } from "./ImagesField";
import { useAuth } from "../../hooks/useAuth";

type FormType<T> = Omit<T, "images"> & { images: FileList };

interface Props {
  formKey: number;
  register: UseFormRegister<FieldValues>;
  handleSubmit: UseFormHandleSubmit<FormType<Sight>, undefined>;
  reset: UseFormReset<FormType<Sight>>;
  setValue: UseFormSetValue<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  isSubmitting: boolean;
  watch: UseFormWatch<FieldValues>;
}

export const SightForm: React.FC<Props> = ({
  formKey,
  register,
  handleSubmit,
  reset,
  setValue,
  watch,
  isSubmitting,
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

  const files: FileList = watch("images");

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
      <TagsField collection="sights" register={register} setValue={setValue} />
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
        <button type="submit" className="btn btn-primary">
          <span>Save</span>
        </button>
      </section>
    </form>
  );
};
