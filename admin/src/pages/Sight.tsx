import { useForm } from "react-hook-form";
import { Sight } from "../models/SightModel";
import { SightForm } from "../components/Forms/SightForm";
import { useEffect, useState } from "react";
import { getBase64 } from "../utils/images";
import { FormType } from "../models/FormModel";

export default function SightPage() {
  const [previewBlobs, setPreviewBlobs] = useState<Array<string>>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<FormType<Sight>>();

  const sight = watch();

  const formProps = {
    register,
    handleSubmit,
    isSubmitting,
    reset,
    setValue,
    getValues,
    watch,
    files: sight.images,
    activeTags: sight.tags,
  };

  useEffect(() => {
    if (sight.images) {
      processPreviewImages();
    }
  }, [sight.images]);

  const processPreviewImages = async () => {
    const blobs: Array<string> = await Promise.all(
      Array.from(sight.images).map(image => getBase64(image)),
    );

    setPreviewBlobs(blobs);
  };

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
              <img
                className="card-img-top"
                src={previewBlobs && previewBlobs[sight.primary_image - 1]}
              />
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
                <footer className="d-flex align-items-center gap-2">
                  {previewBlobs.map((blob, index) => (
                    <img key={index} src={blob} />
                  ))}
                </footer>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
