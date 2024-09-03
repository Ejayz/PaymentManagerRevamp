"use client";

import { Field, Form, Formik } from "formik";
import { CircleCheckBig, CircleHelp, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
export default function NewSiteForm() {
  const navigator = useRouter();

  const Add_Site_Validator = Yup.object().shape({
    site_name: Yup.string().required("Site Name is required"),
    site_link: Yup.string()
      .required("Site Link is required")
      .url("Invalid URL"),
    description: Yup.string(),
    faucetpay_api_key: Yup.string().required("FaucetPay API Key is required"),
    auto_payment: Yup.string(),
  });

  return (
    <div className="flex flex-col w-11/12 mx-auto ">
      <div className="breadcrumbs my-12 text-xl font-bold">
        <ul>
          <li>
            <a>Sites</a>
          </li>
          <li>
            <a>New</a>
          </li>
        </ul>
      </div>
      <Formik
        initialValues={{
          site_link: "",
          site_name: "",
          description: "",
          faucetpay_api_key: "",
          auto_payment: "true",
        }}
        validationSchema={Add_Site_Validator}
        onSubmit={async (e, actions) => {
          let headersList = {
            Accept: "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json",
          };

          let bodyContent = JSON.stringify({
            site_name: e.site_name,
            site_link: e.site_link,
            description: e.description,
            faucetpay_api_key: e.faucetpay_api_key,
            auto_payment: e.auto_payment == "true" ? true : false,
          });

          let response = await fetch("/api/v1/ops/createsite", {
            method: "POST",
            body: bodyContent,
            headers: headersList,
          });

          let data = await response.text();
          if (response.ok) {
            toast.success("Site Added Successfully");
            navigator.push("/dashboard/sites");
          } else {
            toast.error("Failed to add site");
          }
        }}
      >
        {({ errors, touched, values }) => (
          <Form>
            <div className="flex flex-col gap-y-6">
              <div className="border p-12 rounded-md bg-white">
                <h1 className="text-xl font-bold py-4">Site Details</h1>
                <div className="grid grid-cols-2 gap-6 w-full">
                  <div>
                    <label className="form-control w-96 max-w-lg">
                      <div className="label">
                        <span className="label-text font-bold gap-x-2 flex flex-row">
                          Site Name
                          <span
                            className="tooltip tooltip-right"
                            data-tip="Name of the site. This is required."
                          >
                            <CircleHelp
                              className=" my-auto"
                              size={20}
                              strokeWidth={0.75}
                            />
                          </span>
                        </span>
                      </div>
                      <Field
                        type="text"
                        placeholder="Site Name: Example: EzMiner"
                        name="site_name"
                        className={`input input-bordered w-full max-w-md ${
                          errors.site_name && touched.site_name
                            ? "input-error"
                            : ""
                        }`}
                      />
                    </label>

                    {errors.site_name && touched.site_name ? (
                      <span className="text-error  flex flex-row">
                        {errors.site_name}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <label className="form-control w-96 max-w-lg">
                      <div className="label">
                        <span className="label-text font-bold gap-x-2 flex flex-row">
                          Site Link
                          <span
                            className="tooltip tooltip-right"
                            data-tip="Site Link is the URL of the site. Example: https://ezminer.tech . This is required."
                          >
                            <CircleHelp
                              className=" my-auto"
                              size={20}
                              strokeWidth={0.75}
                            />
                          </span>
                        </span>
                      </div>
                      <Field
                        type="text"
                        placeholder="Site Link: Example: https://ezminer.tech"
                        name="site_link"
                        className={`input input-bordered w-full max-w-md ${
                          errors.site_link && touched.site_link
                            ? "input-error"
                            : ""
                        }`}
                      />
                    </label>
                    {errors.site_link && touched.site_link ? (
                      <span className="text-error gap-2 flex flex-row ">
                        {errors.site_link}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <label className="form-control w-96 max-w-lg">
                      <div className="label">
                        <span className="label-text font-bold gap-x-2 flex flex-row">
                          Description
                          <span
                            className="tooltip tooltip-right"
                            data-tip="Description of the site. This is optional."
                          >
                            <CircleHelp
                              className=" my-auto"
                              size={20}
                              strokeWidth={0.75}
                            />
                          </span>
                        </span>
                      </div>
                      <Field
                        type="text"
                        placeholder="Description: Example: Best Faucet Site"
                        name="description"
                        className={`input input-bordered w-full max-w-md ${
                          errors.description && touched.description
                            ? "input-error"
                            : ""
                        }`}
                      />
                    </label>
                    {errors.description && touched.description ? (
                      <span className="text-error gap-2 flex flex-row">
                        <TriangleAlert color="#ff0000" />
                        {errors.description}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="border p-12 rounded-md bg-white">
                <h1 className="text-xl font-bold py-4 gap-x-2 flex flex-row  ">
                  Configuration
                </h1>
                <div className="grid grid-cols-1 gap-6 w-full">
                  <div>
                    <label className="form-control w-96 max-w-lg">
                      <div className="label">
                        <span className="label-text font-bold gap-x-2 flex flex-row">
                          Faucet Pay API Key
                          <span
                            className="tooltip tooltip-right"
                            data-tip="API Key can be changed but cannot be seen for security concern. If you leaked your faucet pay API key, Please invalidate/refresh your API Key in faucet pay website. This is required."
                          >
                            <CircleHelp
                              className=" my-auto"
                              size={20}
                              strokeWidth={0.75}
                            />
                          </span>
                        </span>
                      </div>
                      <Field
                        type="password"
                        placeholder="Faucet Pay API Key"
                        name="faucetpay_api_key"
                        className={`input input-bordered w-full max-w-md ${
                          errors.faucetpay_api_key && touched.faucetpay_api_key
                            ? "input-error"
                            : ""
                        }`}
                      />
                    </label>
                    {errors.faucetpay_api_key && touched.faucetpay_api_key ? (
                      <span className="text-error  flex flex-row">
                        {errors.faucetpay_api_key}
                      </span>
                    ) : null}
                  </div>

                  <div className="gap-y-4 flex  flex-col">
                    <span className="label-text font-bold gap-x-2 flex flex-row">
                      Auto Payment
                      <span
                        className="tooltip tooltip-right"
                        data-tip="Enable or Disable Auto Payment. If enabled, Payment will be sent automatically to user. If disabled, Payment will be sent manually by admin."
                      >
                        <CircleHelp
                          className=" my-auto"
                          size={20}
                          strokeWidth={0.75}
                        />
                      </span>
                    </span>
                    <div className="flex flex-row gap-x-12 gap-y-4">
                      <div
                        className={`form-control border rounded-xl ${
                          values.auto_payment == "true" ? "border-success" : ""
                        }`}
                      >
                        <label className="label cursor-pointer  p-6 flex justify-items-start gap-x-4 flex-row">
                          <div className="flex flex-col">
                            <span className="font-bold text-xl ml-0 mr-auto ">
                              Enabled
                            </span>
                            <span className="text-xs">
                              Payment will be sent to user automatically.
                            </span>
                          </div>
                          <CircleCheckBig
                            className={`mx-auto ${
                              values.auto_payment == "true"
                                ? "text-success"
                                : "invisible"
                            }`}
                            size={32}
                            strokeWidth={0.75}
                          />
                          <Field
                            type="radio"
                            name="auto_payment"
                            value={"true"}
                            className="radio hidden"
                          />
                        </label>
                      </div>
                      <div
                        className={`form-control border rounded-xl ${
                          values.auto_payment == "false" ? "border-success" : ""
                        }`}
                      >
                        <label className="label cursor-pointer  p-6 flex justify-items-start gap-x-4 flex-row">
                          <div className="flex flex-col">
                            <span className="font-bold text-xl ml-0 mr-auto ">
                              Disabled
                            </span>
                            <span className="text-xs">
                              Payment will be sent to user manually via Manual
                              Payments.
                            </span>
                          </div>
                          <CircleCheckBig
                            className={`mx-auto ${
                              values.auto_payment == "false"
                                ? "text-success"
                                : "invisible"
                            }`}
                            size={32}
                            strokeWidth={0.75}
                          />
                          <Field
                            type="radio"
                            name="auto_payment"
                            value={"false"}
                            className="radio hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-action p-6">
              <button className="btn btn-primary btn-md">Save Site</button>
              <Link className="btn btn-ghost btn-md " href="/dashboard/sites">
                BACK
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
