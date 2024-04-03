import { SightForm } from "../components/Forms/SightForm";

export default function Sight() {
  return (
    <div className="d-flex">
      <div className="container-sm m-auto py-3">
        <div className="row justify-content-center gx-4 gy-3">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <h5 className="card-header">Insert sight</h5>
              <div className="card-body">
                <SightForm formKey={0} />
              </div>
            </div>
          </div>
          <div className="col-sm-10 col-lg-4">
            <p className="preview-title">Live preview</p>
            <div className="card">
              <img className="card-img-top" id="preview-primary-image" />
              <section className="card-body preview-body">
                <h4 id="preview-name" className="card-title"></h4>
                <div
                  id="preview-tags"
                  className="d-flex align-items-center flex-wrap"
                ></div>
                <div id="preview-description" className="card-text"></div>
                <footer
                  className="d-flex align-items-center gap-2"
                  id="preview-images"
                ></footer>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
