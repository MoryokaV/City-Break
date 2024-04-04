import "react-quill/dist/quill.snow.css";
import { DescriptionField } from "../DescriptionField";
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
import { TagsField } from "../TagsField";

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
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          type="text"
          required
          maxLength={60}
          className="form-control"
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
        <div className="row gx-3 gy-0">
          <label htmlFor="sight-primary-image" className="col-auto col-form-label">
            Primary image index
          </label>
          <div className="col">
            <input
              className="form-control"
              {...register("primary_image", { valueAsNumber: true })}
              type="number"
              min="1"
              max="1"
              defaultValue="1"
              required
            />
          </div>
        </div>
      </section>
      <section className="col-sm-6">
        <label className="form-label" htmlFor="sight-latitude">
          Latitude
        </label>
        <input
          type="text"
          className="form-control"
          {...register("latitude", { valueAsNumber: true })}
          pattern={latitudeRegExp}
          title={latitudeRegExpTitle}
          required
        />
      </section>
      <section className="col-sm-6">
        <label className="form-label" htmlFor="sight-longitude">
          Longitude
        </label>
        <input
          type="text"
          className="form-control"
          {...register("longitude", { valueAsNumber: true })}
          pattern={longitudeRegExp}
          title={longitudeRegExpTitle}
          required
        />
      </section>
      <section className="col-12">
        <label className="form-label" htmlFor="sight-external-link">
          External link
        </label>
        <input
          type="url"
          className="form-control"
          {...register("external_link")}
          required
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
