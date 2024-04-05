import { InputHTMLAttributes } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<FieldValues>;
  label: string;
  id: string;
  valueAsNumber: boolean;
}

export const InputField: React.FC<Props> = ({
  register,
  label,
  id,
  valueAsNumber,
  ...inputProps
}) => {
  return (
    <>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        className="form-control"
        {...register(id, { valueAsNumber })}
        {...inputProps}
      />
    </>
  );
};
