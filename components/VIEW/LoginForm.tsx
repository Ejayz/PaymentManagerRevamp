"use client";

import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
export default function LoginForm() {
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useRouter();
  return (
    <div className="card glass w-96 mx-auto">
      <figure></figure>
      <div className="card-body">
        <h2 className="card-title">Log In</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (e) => {
            setIsSubmitting(true);
            let headersList = {
              Accept: "*/*",
              "User-Agent": "Thunder Client (https://www.thunderclient.com)",
              Referer: "",
              "Content-Type": "application/json",
            };

            let bodyContent = JSON.stringify({
              email: e.email,
              password: e.password,
            });

            let response = await fetch("/api/auth", {
              method: "POST",
              body: bodyContent,
              headers: headersList,
            });

            let data = await response.json();
            if (response.ok) {
              toast.success("Logged in successfully");
              toast.success("Redirecting...");
              setTimeout(() => {
                navigation.push("/dashboard");
              }, 1000);
            } else {
              toast.error(data.error);
            }
            setIsSubmitting(false);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <p>Enter account information to login.</p>
              <label
                className={`input input-bordered flex items-center gap-2 ${
                  errors.email && touched.email ? "input-error" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <Field
                  name="email"
                  type="email"
                  className="grow"
                  placeholder="Email"
                />
              </label>
              <br />
              <label
                className={`input input-bordered flex items-center gap-2 ${
                  errors.password && touched.password ? "input-error" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <Field
                  type="password"
                  className="grow"
                  name="password"
                  placeholder="Password"
                />
              </label>
              <br />
              <div className="card-actions justify-center">
                <button
                  type="submit"
                  className={`${
                    isSubmitting ? "disabled btn-disabled" : "btn-primary"
                  } btn  btn-wide`}
                >
                  {isSubmitting ? (
                    <span className="loading loading-dots loading-lg"></span>
                  ) : (
                    "Log In"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
