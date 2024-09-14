"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { Save, Trash2 } from "lucide-react";
import Link from "next/link";
import {FormInput} from "../UI/FormInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import * as yup from "yup";
export default function EditTokenForm({ token_id }: { token_id: string }) {
  const navs = useRouter();

  const validationSchemaToken = yup.object().shape({
    currency_name: yup.string().required("Currency Name is required"),
    currency_code: yup.string().required("Currency Code is required "),
  });

  const { data, error, isFetching, isLoading, isError } = useQuery({
    queryKey: ["token", token_id],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/ops/gettoken?token_id=${token_id}`,
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
        throw new Error("Something went wrong while fetching token.");
      }
    },
    retry: 1,
  });

  const mutateToken = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch("/api/v1/ops/updatetoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        throw new Error("Something went wrong while updating token.");
      }
    },
    onError: (error) => {
      toast.error("Error updating token");
    },
    onMutate: (values) => {
     
    },
    onSuccess: (data, variables, context) => {
      toast.success("Token updated successfully !");
      navs.push("/dashboard/tokens");
    },
  });

  const removeToken = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch("/api/v1/ops/removetoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        throw new Error("Something went wrong while removing token.");
      }
    },
    onError: (error) => {
      toast.error("Error removing token");
    },
    onMutate: (values) => {
 
    },
    onSuccess: (data, variables, context) => {
      toast.success("Token removed successfully !");
      navs.push("/dashboard/tokens");
    },
  });

  return (
    <>
      <div className="flex flex-col w-11/12 mx-auto ">
        <div className="breadcrumbs my-12 text-xl font-bold flex flex-row justify-between items-center">
          <ul>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/dashboard/tokens">Tokens</Link>
            </li>
            <li>
              <Link href={`/dashboard/tokens/edit/${token_id}`}>
                {isLoading || isFetching ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : isError ? (
                  <span className="text-error">Error</span>
                ) : data.length > 0 ? (
                  data[0].currency_name
                ) : (
                  <span>Token</span>
                )}
              </Link>
            </li>
          </ul>
          <button
            onClick={() => {
              removeToken.mutate({ token_id: token_id });
            }}
            className={`btn ${
              removeToken.isPending ? "btn-disabled" : "btn-error"
            } max-w-sm btn-outline`}
          >
            {removeToken.isPending ? (
              <>
                <span className="loading loading-dots loading-sm"></span>
                Removing...
              </>
            ) : (
              <>
                <Trash2 /> Remove Token
              </>
            )}
          </button>
        </div>
        {isLoading || isFetching ? (
          <div className="w-full flex flex-row justify-center items-center">
            <span className="loading loading-dots loading-md"></span>
          </div>
        ) : isError ? (
          <div className="w-full flex flex-row justify-center items-center">
            <span className="text-error">Error</span>
          </div>
        ) : data.length > 0 ? (
          <Formik
            initialValues={{
              currency_name: data[0].currency_name || "",
              currency_code: data[0].currency_code || "",
            }}
            onSubmit={(e, actions) => {
              mutateToken.mutate({
                token_id: token_id,
                currency_name: e.currency_name,
                currency_code: e.currency_code,
              });
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form>
                <div className="border bg-white p-12 flex flex-col rounded-lg">
                  <h1 className="text-xl font-bold py-4">Token Details</h1>
                  <div className="flex flex-row gap-6">
                    <FormInput
                      errors={errors.currency_name?.toString()}
                      touched={touched.currency_name?.toString()}
                      tooltip="Currency Name of the token"
                      name="currency_name"
                      placeholder="Currency Name"
                      label="Currency Name"
                      type="text"
                    />
                    <FormInput
                      errors={errors.currency_code?.toString()}
                      touched={touched.currency_code?.toString()}
                      tooltip="Currency Code of the token"
                      name="currency_code"
                      placeholder="Currency Code"
                      label="Currency Code"
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-end gap-4 mt-4">
                  <button
                    type="submit"
                    className={`btn btn-outline ${
                      mutateToken.isPending ? "btn-disabled" : "btn-primary"
                    } `}
                  >
                    {mutateToken.isPending ? (
                      <>
                        <span className="loading loading-dots loading-sm"></span>
                        Updating token...
                      </>
                    ) : (
                      <>
                        <Save />
                        Update Token
                      </>
                    )}
                  </button>
                  <Link
                    href="/dashboard/tokens"
                    className="btn btn-ghost btn-md"
                  >
                    Back
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="w-full flex flex-row justify-center items-center">
            <span className="text-error">Token not found</span>
          </div>
        )}
      </div>
    </>
  );
}
