"use client";

import { Formik, Form, Field } from "formik";
import { Plus, CircleHelp, Trash2 } from "lucide-react";
import FormBased from "../UI/FormBased";
import { DisplayFormData, FormInput, FormInputCheckBox } from "../UI/FormInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
export default function ViewTransaction({
  transaction_id,
}: {
  transaction_id: string;
}) {
  const navs = useRouter();

  const {
    data: transactionData,
    error: transactionError,
    isFetching: transactionFetching,
    isLoading: transactionLoading,
  } = useQuery({
    queryKey: ["transaction_list", transaction_id],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/ops/gettransaction?transaction_id=${transaction_id}`,
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
          "Something went wrong while fetching transaction list."
        );
      }
    },
    retry: 1,
  });

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

  const mutateUpdateTransaction = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch(`/api/v1/ops/updatetransaction`, {
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
    <>
      <div className="flex flex-col w-11/12 mx-auto ">
        <div className="breadcrumbs my-12 text-xl font-bold flex flex-row justify-between items-center">
          <ul>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/dashboard/transactions">Transactions</Link>
            </li>
            <li>
              <Link href={`/dashboard/transactions/edit/${transaction_id}`}>
                {transaction_id}
              </Link>
            </li>
          </ul>
        </div>
        {transactionLoading || siteLoading || tokenLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-96">
            <span className="loading loading-lg"></span>
          </div>
        ) : transactionError || siteError || tokenError ? (
          <div className="flex flex-col items-center justify-center w-full h-96">
            <span className="text-red-500 text-lg">Error fetching data.</span>
          </div>
        ) : transactionData.length == 1 ? (
          <Formik
            initialValues={{
              currency_id: transactionData[0].currency || 0,
              wallet_address: transactionData[0].to_user || "",
              amount: transactionData[0].amount || 0,
              refferal: transactionData[0].refferal || false,
              site_id: transactionData[0].site_id || 0,
            }}
            validationSchema={validationSchema}
            onSubmit={(e, action) => {
              mutateUpdateTransaction.mutate({
                currency_id: e.currency_id,
                wallet_address: e.wallet_address,
                amount: e.amount,
                refferal: e.refferal,
                site_id: e.site_id,
                transaction_id: transaction_id,
              });
            }}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form>
                <div className="bordered  rounded-sm bg-white p-12">
                  <div>
                    <h1 className="text-lg font-bold">Transaction Details</h1>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <DisplayFormData
                      label="Transaction ID"
                      value={transactionData[0].transaction_id}
                      tooltip="Transaction Identifier"
                    />

                    <DisplayFormData
                      label="Site"
                      value={transactionData[0].tbl_site.site_name}
                      tooltip="Site Name"
                    />

                    <DisplayFormData
                      label="Currency"
                      value={transactionData[0].tbl_token.currency_name}
                      tooltip="Currency Name"
                    />

                    <DisplayFormData
                      label="Amount"
                      value={`${transactionData[0].amount} Satoshi`}
                      tooltip="Amount"
                    />

                    <DisplayFormData
                      label="Wallet Address"
                      value={transactionData[0].to_user}
                      tooltip="Wallet Address"
                    />

                    <DisplayFormData
                      label="Type"
                      value={
                        transactionData[0].type == "auto"
                          ? "Automatic"
                          : "Manual"
                      }
                      tooltip="Transaction Type"
                    />

                    <DisplayFormData
                      label="Status"
                      value={transactionData[0].status}
                      tooltip="Transaction Status"
                    />

                    <DisplayFormData
                      label="Created At"
                      value={transactionData[0].created_at}
                      tooltip="Transaction Created At"
                    />

                    <DisplayFormData
                      label="Updated At"
                      value={transactionData[0].updated_at}
                      tooltip="Transaction Updated At"
                    />

                    <DisplayFormData
                      label="Payout ID"
                      value={transactionData[0].payout_id}
                      tooltip="Payout ID"
                    />

                    <DisplayFormData
                      label="Payout User Hash"
                      value={transactionData[0].payout_user_hash}
                      tooltip="Payout User Hash"
                    />

                    <DisplayFormData
                      label="Current Balance"
                      value={transactionData[0].current_balance}
                      tooltip="Current Balance"
                    />

                    <DisplayFormData
                      label="Refferal"
                      value={transactionData[0].refferal ? "Yes" : "No"}
                      tooltip="Refferal"
                    />

                    <DisplayFormData
                      label="User ID"
                      value={transactionData[0].user_id}
                      tooltip="User ID"
                    />

                    <DisplayFormData
                      label="Site ID"
                      value={transactionData[0].site_id}
                      tooltip="Site ID"
                    />

                    <DisplayFormData
                      label="Balance"
                      value={transactionData[0].current_balance}
                      tooltip="Balance"
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-end mt-6 gap-x-6 mb-6">
                  <Link
                    href="/dashboard/transactions"
                    className="btn btn-primary"
                  >
                    Back
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-96">
            <span className="text-red-500 text-lg">No transaction found.</span>
          </div>
        )}
      </div>
    </>
  );
}
