"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { DateTime } from "luxon";
import {
  ArrowBigLeft,
  CircleCheckBig,
  CircleHelp,
  Dices,
  Save,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { randomBytes } from "crypto";
import { useState } from "react";

export default function EditSiteForm(site_id: any) {
  console.log(site_id);
  const navs = useRouter();
  const [api_key, setApiKey] = useState(randomBytes(32).toString("hex"));
  const { data, error, isFetching, isLoading, refetch, isError } = useQuery({
    queryKey: ["site", site_id],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/ops/getsite?site_id=${site_id.site_id}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          },
          redirect: "follow",
        }
      );
      const result = await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error(
          "Something went wrong while fetching site information."
        );
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const mutateApiKey = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/v1/ops/update_site_api", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onMutate: async (data) => {
      return data;
    },
    onError: (error, variables, context) => {
      toast.error("Failed to update API Key");
    },
    onSuccess: (data, variables, context) => {
      toast.success("API Key Updated Successfully");
    },
  });

  const mutateSite = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/v1/ops/update_site", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onMutate: async (data) => {
      return data;
    },
    onError: (error, variables, context) => {
      toast.error("Failed to update Site");
    },
    onSuccess: (data, variables, context) => {
      toast.success("Site Updated Successfully");
      navs.push("/dashboard/sites");
    },
  });

  const mutateRemoveSite = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/v1/ops/removesite", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onMutate: async (data) => {
      return data;
    },
    onError: (error, variables, context) => {
      toast.error("Failed to remove site");
    },
    onSuccess: (data, variables, context) => {
      toast.success("Site Removed Successfully");
      navs.push("/dashboard/sites");
    },
  });

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
    <div className="flex flex-col w-11/12 mx-auto gap-y-6">
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box max-w-xl flex flex-col gap-y-6 text-center">
          <h3 className="font-bold text-lg">API KEY GENERATED</h3>
          <input
            type="password"
            value={api_key}
            className="input input-bordered w-full"
            readOnly
            onClick={(e) => {
              e.currentTarget.select();
              e.currentTarget.setAttribute("type", "text");
              navigator.clipboard.writeText(e.currentTarget.value);
              toast.success("API Key Copied");
            }}
          />
          <p className="text-sm">
            API Key has been generated.Click the text box to reveal the key and
            copy it.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-sm mx-auto max-w-sm"
            onClick={() => {
              let modal = document.getElementById(
                "my_modal_2"
              ) as HTMLDialogElement;

              modal.close();
            }}
          >
            CLOSE
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="breadcrumbs my-12 text-xl font-bold flex flex-row justify-between items-center">
        <ul>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/dashboard/sites">Sites</Link>
          </li>
          <li>
            <Link href={`/dashboard/sites/edit/${site_id.site_id}`}>
              {isLoading || isFetching ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : isError ? (
                <span className="text-error">Error</span>
              ) : data.length > 0 ? (
                data[0].site_name
              ) : (
                <span>Site</span>
              )}
            </Link>
          </li>
        </ul>
        <button
          onClick={() => {
            mutateRemoveSite.mutate({ site_id: site_id.site_id });
          }}
          className={`btn ${
            mutateRemoveSite.isPending ? "btn-disabled" : "btn-error"
          } max-w-sm btn-outline`}
        >
          {mutateRemoveSite.isPending ? (
            <>
              <span className="loading loading-dots loading-sm"></span>
              Removing...
            </>
          ) : (
            <>
              <Trash2 /> Remove Site
            </>
          )}
        </button>
      </div>

      {isLoading || isFetching ? (
        <>
          <div className="flex flex-col mx-auto gap-x-4 items-center ">
            <div className="loading loading-lg"></div>
            <span>Loading Site Information</span>
          </div>
        </>
      ) : isError ? (
        <>
          <div className="flex flex-col mx-auto gap-x-4 items-center ">
            <TriangleAlert color="#ff0000" />
            <span>Failed to fetch site information</span>
            <button
              onClick={() => {
                refetch();
              }}
              className="btn btn-primary"
            >
              Retry
            </button>
          </div>
        </>
      ) : data.length > 0 ? (
        <>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-md font-bold flex flex-col">Site ID</p>
              <span className="text-sm "> {data[0].site_id}</span>
            </div>
            <div className="flex flex-row gap-8">
              <div>
                <p className="text-md font-bold flex flex-col">Created At</p>
                <span className="text-sm ">
                  {DateTime.fromISO(data[0].created_at).toFormat(
                    "M/d/yyyy hh:mm a"
                  )}
                </span>
              </div>

              <div>
                {" "}
                <p className="text-md font-bold flex flex-col">Updated</p>
                <span className="text-sm ">
                  {DateTime.fromISO(data[0].updated_at).toFormat(
                    "M/d/yyyy hh:mm a"
                  )}
                </span>
              </div>
              <div>
                <p className="text-md font-bold flex flex-col">Status</p>
                <span
                  className={`badge text-sm  ${
                    data[0].is_exist ? "badge-success" : "badge-error"
                  }`}
                >
                  {data[0].is_exist ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <Formik
            initialValues={{
              site_link: data[0].site_link || "",
              site_name: data[0].site_name || "",
              description: data[0].description || "",
              faucetpay_api_key: "faucet-pay-api-key",
              auto_payment: `${data[0].auto_payment}` || "true",
              api_key: "api-key-sample",
            }}
            validationSchema={Add_Site_Validator}
            onSubmit={async (e, actions) => {
              console.log(e);
              mutateSite.mutate({
                site_id: site_id.site_id,
                site_name: e.site_name,
                site_link: e.site_link,
                description: e.description,
                auto_payment: e.auto_payment,
                faucetpay_api_key: e.faucetpay_api_key,
              });
            }}
          >
            {({ errors, touched, values, setValues }) => (
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
                            {errors.site_name.toString()}
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
                            {errors.site_link.toString()}
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
                            {errors.description.toString()}
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
                              errors.faucetpay_api_key &&
                              touched.faucetpay_api_key
                                ? "input-error"
                                : ""
                            }`}
                          />
                        </label>
                        {errors.faucetpay_api_key &&
                        touched.faucetpay_api_key ? (
                          <span className="text-error  flex flex-row">
                            {errors.faucetpay_api_key.toString()}
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
                              values.auto_payment == "true"
                                ? "border-success"
                                : ""
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
                              values.auto_payment == "false"
                                ? "border-success"
                                : ""
                            }`}
                          >
                            <label className="label cursor-pointer  p-6 flex justify-items-start gap-x-4 flex-row">
                              <div className="flex flex-col">
                                <span className="font-bold text-xl ml-0 mr-auto ">
                                  Disabled
                                </span>
                                <span className="text-xs">
                                  Payment will be sent to user manually via
                                  Manual Payments.
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
                        <div>
                          <label className="form-control w-96 max-w-lg">
                            <div className="label">
                              <span className="label-text font-bold gap-x-2 flex flex-row">
                                Faucet Pay API Key
                                <span
                                  className="tooltip tooltip-right"
                                  data-tip="Generate a new API Key for the site. You will not be able to see the key again. If you forgot or leaked the key, you can regenerate a new key here."
                                >
                                  <CircleHelp
                                    className=" my-auto"
                                    size={20}
                                    strokeWidth={0.75}
                                  />
                                </span>
                              </span>
                            </div>
                            <label className="input pr-0 input-bordered flex flex-row justify-center items-center">
                              <Field
                                type="password"
                                name="api_key"
                                className={`input input-bordered w-full max-w-md input-disabled ${
                                  errors.api_key && touched.api_key
                                    ? "input-error"
                                    : ""
                                }`}
                                disabled={true}
                                placeholder="API KEY"
                              />
                              <button
                                onClick={() => {
                                  let key = randomBytes(32).toString("hex");
                                  setApiKey(key);
                                  setValues({ ...values, api_key: key });
                                  mutateApiKey.mutate({
                                    site_id: site_id.site_id,
                                    api_key: key,
                                  });
                                  let modal = document?.getElementById(
                                    "my_modal_2"
                                  ) as HTMLDialogElement;
                                  modal.showModal();
                                }}
                                type="button"
                                className={`btn btn-sm h-full drop-shadow-2xl flex items-center gap-2`}
                              >
                                {mutateApiKey.isPending ? (
                                  <>
                                    <Dices
                                      className={`${
                                        mutateApiKey.isPending
                                          ? "animate-spin"
                                          : "animate-none"
                                      }`}
                                    />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Dices /> Generate API Key
                                  </>
                                )}
                              </button>
                            </label>
                          </label>
                          {errors.api_key && touched.api_key ? (
                            <span className="text-error  flex flex-row">
                              {errors.api_key.toString()}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-action p-6">
                  <button
                    className={`btn btn-outline ${
                      mutateSite.isPending ? "btn-disabled" : "btn-primary"
                    } btn-md`}
                  >
                    {mutateSite.isPending ? (
                      <>
                        <span className="loading loading-dots loading-sm"></span>{" "}
                        Please wait...
                      </>
                    ) : (
                      <>
                        <Save /> Save Site
                      </>
                    )}
                  </button>
                  <Link
                    className="btn btn-ghost btn-md "
                    href="/dashboard/sites"
                  >
                    BACK
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
