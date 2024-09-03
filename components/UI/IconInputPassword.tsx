import { Field } from "formik";

export default function InputFieldWithLabel(
  {
      
    topRightLabel,
    topLeftLabel,
    bottomLeftLabel,
    bottomRightLabel,
  }: Readonly<{
    topRightLabel: string;
    topLeftLabel: string;
    bottomLeftLabel: string;
    bottomRightLabel: string
  }>
  
){
    return (
      <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">{topLeftLabel}</span>
        <span className="label-text-alt">{topRightLabel}</span>
      </div>
      <Field 
       type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
      <div className="label">
        <span className="label-text-alt">{bottomLeftLabel}</span>
        <span className="label-text-alt">{bottomRightLabel}</span>
      </div>
    </label>
    )
}