"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { Pencil, Search, View } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export default function ManualPaymentList() {
  const [page, setPage] = useState(1);
  const searchInput = useRef<HTMLInputElement>(null);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [site, setSite] = useState("all");
  const [status, setStatus] = useState("all");
  
  const { data, error, isFetching, isLoading, refetch, isError } = useQuery({
    queryKey: ["transaction_list", page, search, limit, site, status],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/ops/gettransactionlist?page=${page}&search=${search}&limit=${limit}&site=${site}&status=${status}`,
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
        throw new Error("Something went wrong while fetching site list.");
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

  return (
    <div className="overflow-x-auto mt-4 w-11/12 mx-auto">
      <div className="w-11/12 flex flex-col mx-auto gap-y-12 h-full">
        <div className="w-full flex flex-row  justify-between items-center">
          <div className="flex flex-row w-full gap-x-6">
            <label className="input pr-0 input-bordered flex flex-row justify-center items-center">
              <input
                type="text"
                ref={searchInput}
                className="grow w-full"
                placeholder="Search"
              />
              <button
                onClick={() => {
                  setSearch(searchInput.current?.value || "");
                  setPage(1);
                }}
                className="btn btn-sm h-full drop-shadow-2xl flex items-center gap-2"
              >
                <Search color="#000000" /> Search
              </button>
            </label>

            <select
              onChange={(e) => {
                setSite(e.target.value);
                setPage(1);
              }}
              value={site}
              className="select select-bordered w-full max-w-xs"
            >
              <option disabled>SITE</option>
              <option value="all">All Sites</option>
              {siteFetching || siteLoading ? (
                <option>Loading...</option>
              ) : siteError ? (
                <option>Error</option>
              ) : (
                siteData?.map((site: any, index: any) => (
                  <option
                    className="flex flex-row "
                    key={index}
                    value={site.site_id}
                  >
                    {site.site_name}
                  </option>
                ))
              )}
            </select>

            <select
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              value={status}
              className="select select-bordered w-full max-w-xs"
            >
              <option disabled>STATUS</option>
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Sent">Sent</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
          <Link
            href="/dashboard/transactions/new"
            className="btn btn-primary btn-outline"
          >
            Add Transaction
          </Link>
        </div>

        <table className="table table-xs text-center">
          <thead>
            <tr className="">
              <th></th>
              <th>TRANSACTION ID</th>
              <th>CURRENCY</th>
              <th>TO USER</th>
              <th>SITE ID</th>
              <th>SITE NAME</th>
              <th>AMOUNT</th>
              <th>TYPE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={10}>
                  <span className="loading loading-dots loading-md"></span>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td className="text-error font-bold" colSpan={10}>
                  Something went wrong while fetching site list.
                </td>
              </tr>
            ) : data.length > 0 ? (
              data?.map((transaction: any, index: any) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td className="text-ellipsis text-wrap">
                    {transaction.transaction_id}
                  </td>
                  <td>{transaction.tbl_token.currency_code}</td>
                  <td>{transaction.to_user}</td>
                  <td>{transaction.tbl_site.site_id}</td>
                  <td>{transaction.tbl_site.site_name}</td>
                  <td>{transaction.amount} Satoshi</td>
                  <td>{transaction.type == "auto" ? "Automatic" : "Manual"}</td>
                  <td>
                    <div
                      className={`badge  badge-outline ${
                        transaction.status == "Sent"
                          ? "badge-success"
                          : transaction.status == "Pending"
                          ? "badge-warning"
                          : transaction.status == "Declined"
                          ? "badge-error"
                          : ""
                      }`}
                    >
                      {transaction.status}
                    </div>
                  </td>
                  <td className="justify-center items-center flex gap-4">
                    {transaction.status == "Pending" ? (
                      <Link
                        href={`/dashboard/transactions/edit/${transaction.transaction_id}`}
                      >
                        <button className="btn btn-sm btn-warning btn-outline">
                          <Pencil size={16} className="text-warning" />
                        </button>
                      </Link>
                    ) : transaction.status == "Sent" ||
                      transaction.status == "Declined" ? (
                      <Link
                        href={`/dashboard/transactions/view/${transaction.transaction_id}`}
                      >
                        <button className="btn btn-sm btn-info btn-outline disabled">
                          <View size={16} className="text-info" />
                        </button>
                      </Link>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="font-bold" colSpan={10}>
                  No transaction found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="join mx-auto">
          <button
            onClick={() => {
              if (page !== 1) {
                setPage(page - 1);
              }
            }}
            className="join-item btn"
          >
            «
          </button>
          <button className="join-item btn">Page {page}</button>
          <button
            onClick={() => {
              if (!isLoading && !isFetching && data?.length == limit) {
                setPage(page + 1);
              }
            }}
            className={`join-item btn ${
              data?.length != limit ? "disabled" : ""
            }`}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
