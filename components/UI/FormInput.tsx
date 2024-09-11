"use client";

import { Field, FormikErrors, FormikTouched } from "formik";
import { CircleHelp } from "lucide-react";

export function FormInput({
  errors,
  touched,
  tooltip,
  name,
  placeholder,
  label,
  type,
  readonly,
}: {
  errors: string | undefined;
  touched: string | undefined;
  tooltip: string;
  name: string;
  placeholder: string;
  label: string;
  type?: string;
  readonly?: boolean;
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
          disabled={readonly}
        />
      </label>

      {errors && touched ? (
        <span className="text-error  flex flex-row">{errors}</span>
      ) : null}
    </div>
  );
}

export function FormInputCheckBox({
  errors,
  touched,
  tooltip,
  name,
  placeholder,
  label,
  type,
  readonly,
}: {
  errors: string | undefined;
  touched: string | undefined;
  tooltip: string;
  name: string;
  placeholder: string;
  label: string;
  type?: string;
  readonly?: boolean;
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
          className={`checkbox ${errors && touched ? "checkbox-error" : ""}`}
          disabled={readonly}
        />
      </label>

      {errors && touched ? (
        <span className="text-error  flex flex-row">{errors}</span>
      ) : null}
    </div>
  );
}

export function DisplayFormData({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: string;
  tooltip: string;
}) {
  return (
    <div className="">
      <label className="form-control w-96 max-w-lg">
        <div className="label">
          <span className="label-text font-bold gap-x-2 flex flex-row">
            {label}
            <span className="tooltip tooltip-right" data-tip={tooltip}>
              <CircleHelp className=" my-auto" size={20} strokeWidth={0.75} />
            </span>
          </span>
        </div>
        <div className="input input-bordered flex flex-row ">
          <span className=" my-auto">{value}</span>
        </div>
      </label>
    </div>
  );
}
