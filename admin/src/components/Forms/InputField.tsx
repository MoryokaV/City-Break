import { UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  label: string;
  id: string;
  valueAsNumber: boolean;
  [x: string]: any;
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
