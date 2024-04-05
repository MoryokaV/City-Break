import { useForm } from "react-hook-form";
import { Sight } from "../models/SightModel";
import { SightForm } from "../components/Forms/SightForm";

export default function SightPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<Sight>();

  const formProps = {
    register,
    handleSubmit,
    isSubmitting,
    reset,
    setValue,
    getValues,
    watch,
  };

  const sight = watch();

  return (
    <div className="d-flex">
      <div className="container-sm m-auto py-3">
        <div className="row justify-content-center gx-4 gy-3">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <h5 className="card-header">Insert sight</h5>
              <div className="card-body">
                <SightForm formKey={0} {...formProps} />
              </div>
            </div>
          </div>
          <div className="col-sm-10 col-lg-4">
            <p className="preview-title">Live preview</p>
            <div className="card">
              <img className="card-img-top" id="preview-primary-image" />
              <section className="card-body preview-body">
                <h4 className="card-title">{sight.name}</h4>
                <div className="d-flex align-items-center flex-wrap">
                  {sight.tags &&
                    sight.tags.map((tag, index) => {
                      return (
                        <p key={index}>
                          {tag}
                          {index != sight.tags.length - 1 ? ", " : " "}
                        </p>
                      );
                    })}
                </div>
                <div
                  id="preview-description"
                  className="card-text"
                  dangerouslySetInnerHTML={{ __html: sight.description }}
                ></div>
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
