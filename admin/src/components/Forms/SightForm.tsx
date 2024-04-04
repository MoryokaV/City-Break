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
} from "react-hook-form";
import {
  latitudeRegExp,
  latitudeRegExpTitle,
  longitudeRegExp,
  longitudeRegExpTitle,
} from "../../data/RegExpData";
import { Sight } from "../../models/SightModel";
import { useEffect, useState } from "react";
import { TagsField } from "./TagsField";
import { InputField } from "./InputField";
import { PrimaryImageField } from "./PrimaryImageField";

interface Props {
  formKey: number;
  register: UseFormRegister<Sight>;
  handleSubmit: UseFormHandleSubmit<Sight, undefined>;
  reset: UseFormReset<Sight>;
  setValue: UseFormSetValue<Sight>;
  getValues: UseFormGetValues<Sight>;
  isSubmitting: boolean;
}

export const SightForm: React.FC<Props> = ({
  formKey,
  register,
  handleSubmit,
  reset,
  setValue,
  isSubmitting,
}) => {
  const onSubmit: SubmitHandler<Sight> = async (data: FieldValues) => {
    console.log(data);

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
      <TagsField collection="sights" register={register} setValue={setValue} />
      <section className="col-12">
        <label className="form-label">Description</label>
        <DescriptionField />
      </section>
      <section className="col-12 d-flex gap-3">
        <label htmlFor="sight-images" style={{ cursor: "pointer" }}>
          Images
          <input
            type="file"
            className="hidden-input"
            id="sight-images"
            name="images"
            accept="image/*"
            multiple
          />
        </label>
        <ul className="img-container"></ul>
      </section>
      <section className="col-12">
        <PrimaryImageField register={register} />
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
