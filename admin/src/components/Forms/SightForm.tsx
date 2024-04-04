import "react-quill/dist/quill.snow.css";
import { DescriptionField } from "../DescriptionField";
import {
  FieldValues,
  SubmitHandler,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import { nameRegExp, nameRegExpTitle } from "../../data/RegExpData";
import { Sight } from "../../models/SightModel";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Tag } from "../../models/Tagmodel";

interface Props {
  formKey: number;
  register: UseFormRegister<Sight>;
  handleSubmit: UseFormHandleSubmit<Sight, undefined>;
  reset: UseFormReset<Sight>;
  getValues: UseFormGetValues<Sight>;
  isSubmitting: boolean,
}

export const SightForm: React.FC<Props> = ({ formKey, register, handleSubmit, reset, getValues, isSubmitting }) => {
  const [tags, setTags] = useState<Array<Tag>>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetch("/api/fetchTags/sights?city_id=" + user?.city_id)
      .then(response => response.json())
      .then(data => setTags(data));
  }, []);

  const onSubmit: SubmitHandler<Sight> = async (data: FieldValues) => {
    console.log(data);

    // reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row g-3" key={formKey}>
      <section className="col-12">
        <label htmlFor="sight-name" className="form-label">
          Name
        </label>
        <input
          {...register("name")}
          type="text"
          required
          maxLength={60}
          pattern={nameRegExp}
          title={nameRegExpTitle}
          className="form-control"
        />
      </section>
      <section className="col-12 d-flex flex-wrap gap-3">
        <label htmlFor="tags" className="col-form-label">
          Tags
        </label>
        <div className="col-sm-3">
          <select id="tags" name="tags" className="form-select" defaultValue="-">
            <option disabled hidden>
              -
            </option>
            {tags.map((tag, index) => {
              return (
                <option key={index} value={tag.name}>
                  {tag.name}
                </option>
              );
            })}
          </select>
        </div>
        <a role="button" className="btn btn-text text-primary" id="tag-btn">
          Add
        </a>
        <div id="active-tags" className="d-flex align-items-center flex-wrap gap-2"></div>
      </section>
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
