import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getBase64 } from "../utils/images";
import { FormType } from "../models/FormModel";
import { Tour } from "../models/TourModel";
import { InsertTourForm } from "../components/Forms/InsertTourForm";

export default function TourPage() {
  const [previewBlobs, setPreviewBlobs] = useState<Array<string>>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormType<Tour>>();

  const tour = watch();

  const resetForm = () => {
    setPreviewBlobs([]);
    reset();
  };

  const formProps = {
    register,
    handleSubmit,
    isSubmitting,
    resetForm,
    setValue,
    watch,
    files: tour.files,
    images: tour.images,
    stages: tour.stages,
  };
  useEffect(() => {
    if (tour.files) {
      processPreviewImages();
    }
  }, [tour.files]);

  const processPreviewImages = async () => {
    const blobs: Array<string> = await Promise.all(
      Array.from(tour.files).map(file => getBase64(file)),
    );

    setPreviewBlobs(blobs);
  };

  return (
    <div className="d-flex">
      <div className="container-sm m-auto py-3">
        <div className="row justify-content-center gx-4 gy-3">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <h5 className="card-header">Insert tour</h5>
              <div className="card-body">
                <InsertTourForm {...formProps} />
              </div>
            </div>
          </div>
          <div className="col-sm-10 col-lg-4">
            <p className="preview-title">Live preview</p>
            <div className="card">
              <img
                className="card-img-top"
                src={previewBlobs && previewBlobs[tour.primary_image - 1]}
              />
              <section className="card-body preview-body">
                <h4 className="card-title">{tour.name}</h4>
                {/* <div className="d-flex align-items-center flex-wrap">
                  {tour.tags &&
                    tour.tags.map((tag, index) => {
                      return (
                        <p key={index}>
                          {tag}
                          {index != tour.tags.length - 1 ? ", " : " "}
                        </p>
                      );
                    })}
                </div> */}
                <div
                  id="preview-description"
                  className="card-text"
                  dangerouslySetInnerHTML={{ __html: tour.description }}
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
