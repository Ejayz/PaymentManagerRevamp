"use client";

import { Field, FormikErrors, FormikTouched } from "formik";
import { CircleHelp } from "lucide-react";

export default function FormInput({
  errors,
  touched,
  tooltip,
  name,
  placeholder,
  label,
  type,
}: {
  errors: string | undefined;
  touched: string | undefined;
  tooltip: string;
  name: string;
  placeholder: string;
  label: string;
  type?: string;
}) {
  return (
    <div>
      <label className="form-control w-96 max-w-lg">
        <div className="label">
          <span className="label-text font-bold gap-x-2 flex flex-row">
            {label}
            <span className="tooltip tooltip-right" data-tip={tooltip}>
              <CircleHelp className=" my-auto" size={20} strokeWidth={0.75} />
            </span>
          </span>
        </div>
        <Field
          type={type}
          placeholder={placeholder}
          name={name}
          className={`input input-bordered w-full max-w-md ${
            errors && touched ? "input-error" : ""
          }`}
        />
      </label>

      {errors && touched ? (
        <span className="text-error  flex flex-row">{errors}</span>
      ) : null}
    </div>
  );
}
