"use client";

import { Form, Formik } from "formik";
import { FormInput } from "../UI/FormInput";
import * as Yup from "yup";
import FormBased from "../UI/FormBased";
import { CircleHelp, Plus, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Settings() {
  const navs = useRouter();

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    repeat_password: Yup.string().oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),
  });

  const mutateUpdatePassword = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch(`/api/v1/ops/changepassword`, {
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
        throw new Error("Something went wrong while changing password.");
      }
    },
    onError: (error) => {
      toast.error("Error changing password.");
      return error;
    },
    onMutate: (values) => {},
    onSuccess: (data, variables, context) => {
      toast.success("Password changed successfully.");
      navs.push("/dashboard/settings");
      return data;
    },
  });

  return (
    <FormBased
      breadcrumbs={[
        { name: "Dashboard", link: "/dashboard" },
        { name: "Settings", link: "/dashboard/settings" },
      ]}
    >
      <Formik
        initialValues={{
          password: "",
          repeat_password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(e, action) => {
          mutateUpdatePassword.mutate(
            {
              new_password: e.password,
            },
            {
              onSuccess: () => action.resetForm(),
            }
          );
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
                  errors={errors.password}
                  touched={touched.password?.toString()}
                  tooltip="Enter your new password"
                  name="password"
                  placeholder="Enter your new password"
                  label="New Password"
                  type="password"
                />

                <FormInput
                  errors={errors.repeat_password}
                  touched={touched.repeat_password?.toString()}
                  tooltip="Repeat the new password"
                  name="repeat_password"
                  placeholder="Repeat the new password"
                  label="Repeat Password"
                  type="password"
                />
              </div>
            </div>

            <div className="flex flex-row justify-end mt-6 gap-x-6">
              <button
                type="submit"
                className={`btn btn-outline  ${
                  mutateUpdatePassword.isPending
                    ? "btn-disabled"
                    : "btn-primary"
                }`}
              >
                {mutateUpdatePassword.isPending ? (
                  <>
                    <span className="loading loading-sm"></span> Changing
                    Password...
                  </>
                ) : (
                  <>
                    <RefreshCcw /> Change Password
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
