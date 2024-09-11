"use client";
import { Formik, Form } from "formik";
import FormBased from "../UI/FormBased";
import {FormInput} from "../UI/FormInput";
import * as Yup from "yup";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
export default function NewTokenForm() {
  const navs = useRouter();

  const ValidationSchemaToken = Yup.object().shape({
    currency_name: Yup.string().required("Token Name is required"),
    currency_code: Yup.string().required("Token Code is required"),
  });

  const mutateNewToken = useMutation({
    mutationFn: async (values: {
      currency_name: string;
      currency_code: string;
    }) => {
      const response = await fetch(`/api/v1/ops/createtoken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      return result;
    },
    onError: (error) => {
      toast.error("Failed to add token");
    },
    onSuccess: (data) => {
      toast.success("Token added successfully");
      navs.push("/dashboard/tokens");
    },
    onMutate: async (values) => {
      return values;
    },
  });

  return (
    <FormBased
      breadcrumbs={[
        { name: "Dashboard", link: "/dashboard" },
        { name: "Tokens", link: "/dashboard/tokens" },
        { name: "New Token", link: "/dashboard/tokens/new" },
      ]}
    >
      <Formik
        initialValues={{
          currency_name: "",
          currency_code: "",
        }}
        validationSchema={ValidationSchemaToken}
        onSubmit={(e, action) => {
          mutateNewToken.mutate({
            currency_name: e.currency_name,
            currency_code: e.currency_code,
          });
        }}
      >
        {({ isSubmitting, errors, touched, values }) => (
          <Form>
            <div className="bordered  rounded-sm bg-white p-12">
              <div>
                <h1 className="text-lg font-bold">Token Details</h1>
              </div>
              <div className="flex flex-row gap-6">
                <FormInput
                  errors={errors.currency_name}
                  touched={touched.currency_name?.toString()}
                  tooltip="Enter the name of the token"
                  name="currency_name"
                  placeholder="Enter the name of the token"
                  label="Token Name"
                />
                <FormInput
                  errors={errors.currency_code}
                  touched={touched.currency_code?.toString()}
                  tooltip="Enter the code of the token"
                  name="currency_code"
                  placeholder="Enter the code of the token"
                  label="Token Code"
                />
              </div>
            </div>

            <div className="flex flex-row justify-end mt-6 gap-x-6">
              <button
                type="submit"
                className={`btn btn-outline  ${
                  mutateNewToken.isPending ? "btn-disabled" : "btn-primary"
                }`}
              >
                {mutateNewToken.isPending ? (
                  <>
                    <span className="loading loading-sm"></span> Adding Token...
                  </>
                ) : (
                  <>
                    <Plus /> Add Token
                  </>
                )}
              </button>
              <Link href="/dashboard/tokens" className="btn btn-ghost">
                Cancel
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </FormBased>
  );
}
