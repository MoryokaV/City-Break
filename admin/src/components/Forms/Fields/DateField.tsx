import { InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<any>;
  label: string;
  id: string;
}

export const DateField: React.FC<Props> = ({ register, label, id, ...inputProps }) => {
  return (
    <>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        className="form-control"
        type="datetime-local"
        {...register(id, { valueAsDate: true })}
        {...inputProps}
      />
    </>
  );
};
