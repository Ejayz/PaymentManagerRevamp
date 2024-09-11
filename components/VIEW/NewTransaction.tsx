"use client";

import { Formik, Form, Field } from "formik";
import { Plus, CircleHelp } from "lucide-react";
import FormBased from "../UI/FormBased";
import { FormInput, FormInputCheckBox } from "../UI/FormInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";

export default function NewTransaction() {
  const navs = useRouter();

  const {
    data: siteData,
    error: siteError,
    isFetching: siteFetching,
    isLoading: siteLoading,
  } = useQuery({
    queryKey: ["site_list"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/ops/getsitelistoption`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        },
        redirect: "follow",
      });
      const result = await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error("Something went wrong while fetching site list.");
      }
    },
    retry: 1,
  });

  const {
    data: tokenData,
    error: tokenError,
    isFetching: tokenFetching,
    isLoading: tokenLoading,
  } = useQuery({
    queryKey: ["token_list"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/ops/gettokenlistoptions`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        },
        redirect: "follow",
      });
      const result = await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error("Something went wrong while fetching token list.");
      }
    },
    retry: 1,
  });

  const mutateTransaction = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch(`/api/v1/ops/createtransaction`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        },
        body: JSON.stringify(values),
        redirect: "follow",
      });
      const result = await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error("Something went wrong while creating transaction.");
      }
    },
    onError: (error) => {
      toast.error("Error creating transaction.");
    },
    onMutate: (values) => {},
    onSuccess: (data, variables, context) => {
      toast.success("Transaction created successfully.");
      navs.push("/dashboard/transactions");
    },
  });

  const validationSchema = Yup.object().shape({
    wallet_address: Yup.string().required("Wallet address is required"),
    amount: Yup.number().required("Amount is required"),
    currency_id: Yup.string().required("Currency is required"),
    site_id: Yup.string().required("Site is required"),
  });

  return (
    <FormBased
      breadcrumbs={[
        { name: "Dashboard", link: "/dashboard" },
        { name: "Transactions", link: "/dashboard/transactions" },
        { name: "New Transaction", link: "/dashboard/transactions/new" },
      ]}
    >
      <Formik
        initialValues={{
          currency_id: "",
          wallet_address: "",
          amount: "",
          refferal: true,
          site_id: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(e, action) => {
          mutateTransaction.mutate(e);
        }}
      >
        {({ isSubmitting, errors, touched, values }) => (
          <Form>
            <div className="bordered  rounded-sm bg-white p-12">
              <div>
                <h1 className="text-lg font-bold">Transaction Details</h1>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <FormInput
                  errors={errors.wallet_address}
                  touched={touched.wallet_address?.toString()}
                  tooltip="Enter the wallet address you want to send the token to"
                  name="wallet_address"
                  placeholder="Enter the wallet address"
                  label="Wallet Address"
                />
                <div>
                  <label className="form-control w-96 max-w-lg">
                    <div className="label">
                      <span className="label-text font-bold gap-x-2 flex flex-row">
                        Site
                        <span
                          className="tooltip tooltip-right"
                          data-tip={
                            "Select a site you want to use to send the transaction."
                          }
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
                      as="select"
                      name="site_id"
                      className="input input-bordered"
                    >
                      <option value="">Select Site</option>
                      {siteLoading && siteFetching ? (
                        <option>Loading...</option>
                      ) : siteError ? (
                        <option>Error</option>
                      ) : (
                        siteData?.map((site: any, index: any) => (
                          <option key={site.site_id} value={site.site_id}>
                            {site.site_name}
                          </option>
                        ))
                      )}
                    </Field>
                  </label>

                  {errors.site_id && touched.site_id ? (
                    <span className="text-error  flex flex-row">
                      {errors.site_id}
                    </span>
                  ) : null}
                </div>

                <FormInput
                  errors={errors.amount}
                  touched={touched.amount?.toString()}
                  tooltip="Enter the amount of token you want to send in Satoshi"
                  name="amount"
                  placeholder="Amount in Satoshi"
                  label="Amount(Satoshi)"
                  type="number"
                />
                <div>
                  <label className="form-control w-96 max-w-lg">
                    <div className="label">
                      <span className="label-text font-bold gap-x-2 flex flex-row">
                        Currency
                        <span
                          className="tooltip tooltip-right"
                          data-tip={
                            "Select a token you want to use to send the transaction."
                          }
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
                      as="select"
                      name="currency_id"
                      className="input input-bordered"
                    >
                      <option value="">Select Currency</option>
                      {tokenLoading && tokenFetching ? (
                        <option>Loading...</option>
                      ) : tokenError ? (
                        <option>Error</option>
                      ) : (
                        tokenData?.map((token: any, index: any) => (
                          <option key={token.id} value={token.id}>
                            {token.currency_name}
                          </option>
                        ))
                      )}
                    </Field>
                  </label>

                  {errors.currency_id && touched.currency_id ? (
                    <span className="text-error  flex flex-row">
                      {errors.currency_id}
                    </span>
                  ) : null}
                </div>

                <FormInputCheckBox
                  errors={errors.refferal}
                  touched={touched.refferal?.toString()}
                  tooltip="Check if you have refferal code"
                  name="refferal"
                  placeholder="Check if you have refferal code"
                  label="Refferal Code"
                  type="checkbox"
                />
              </div>
            </div>

            <div className="flex flex-row justify-end mt-6 gap-x-6">
              <button
                type="submit"
                className={`btn btn-outline  ${
                  mutateTransaction.isPending ? "btn-disabled" : "btn-primary"
                }`}
              >
                {mutateTransaction.isPending ? (
                  <>
                    <span className="loading loading-sm"></span> Adding Token...
                  </>
                ) : (
                  <>
                    <Plus /> Send Transaction
                  </>
                )}
              </button>

              <Link href="/dashboard/transactions" className="btn btn-ghost">
                Cancel
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </FormBased>
  );
}
