export const SightForm = ({formKey}: {formKey: number}) => {
  return (
    <form className="row g-3" key={formKey}>
      <section className="col-12">
        <label htmlFor="sight-name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="sight-name"
          className="form-control"
          name="name"
          maxLength={60}
          required
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
          </select>
        </div>
        <a role="button" className="btn btn-text text-primary" id="tag-btn">
          Add
        </a>
        <div id="active-tags" className="d-flex align-items-center flex-wrap gap-2"></div>
      </section>
      <section className="col-12">
        <label className="form-label">Description</label>
        <div id="sight-description"></div>
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
              id="sight-primary-image"
              name="primary-image"
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
          id="sight-latitude"
          name="latitude"
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
          id="sight-longitude"
          name="longitude"
          required
        />
      </section>
      <section className="col-12">
        <label className="form-label" htmlFor="sight-external-link">
          External link
        </label>
        <input
          type="url"
          id="sight-external-link"
          className="form-control"
          name="external-link"
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
