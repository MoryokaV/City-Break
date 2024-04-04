import { UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
}

export const PrimaryImageField: React.FC<Props> = ({ register }) => (
  <div className="row gx-3 gy-0">
    <label htmlFor="primary_image" className="col-auto col-form-label">
      Primary image index
    </label>
    <div className="col">
      <input
        id="primary_image"
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
);
