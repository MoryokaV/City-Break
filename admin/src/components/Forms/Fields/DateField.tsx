import { InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<any>;
  label: string;
  id: string;
  defaultDate?: Date;
}

export const DateField: React.FC<Props> = ({
  register,
  label,
  id,
  defaultDate,
  ...inputProps
}) => {
  const convert2LocalDate = (iso_date: Date) => {
    const date = new Date(iso_date);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 1000 * 60);

    return localDate.toISOString().slice(0, 16);
  };

  return (
    <>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        className="form-control"
        type="datetime-local"
        defaultValue={defaultDate && convert2LocalDate(defaultDate)}
        {...register(id, { valueAsDate: true })}
        {...inputProps}
      />
    </>
  );
};
