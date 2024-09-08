"use client";

import { useQuery } from "@tanstack/react-query";
import { Field, Form, Formik, FormikHelpers } from "formik";
import {
  CircleHelp,
  Pencil,
  Search,
  Settings2,
  Trash2,
  TriangleAlert,
  View,
} from "lucide-react";
import Link from "next/link";
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  LegacyRef,
  useEffect,
  useRef,
  useState,
} from "react";

export default function TokenList() {
  const [page, setPage] = useState(1);
  const searchInput = useRef<HTMLInputElement>(null);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, error, isFetching, isLoading, refetch, isError } = useQuery({
    queryKey: ["site_list", page, search, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/ops/gettokenlist?page=${page}&search=${search}&limit=${limit}`,
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

  return (
    <div className="overflow-x-auto mt-4 w-11/12 mx-auto">
      <div className="w-11/12 flex flex-col mx-auto gap-y-12 h-full">
        <div className="w-full flex flex-row  justify-between items-center">
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

          <Link
            href="/dashboard/tokens/new"
            className="btn btn-primary btn-outline"
          >
            Add Token
          </Link>
        </div>

        <table className="table text-center">
          <thead>
            <tr className="">
              <th></th>
              <th>CURRENCY NAME</th>
              <th>CURRENCY CODE</th>
              <th>OPTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={7}>
                  <span className="loading loading-dots loading-md"></span>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td className="text-error font-bold" colSpan={7}>
                  Something went wrong while fetching site list.
                </td>
              </tr>
            ) : data.length > 0 ? (
              data?.map((token: any, index: any) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{token.currency_name}</td>
                  <td>{token.currency_code}</td>

                  <td className="justify-center items-center flex gap-4">
                    <Link
                      href={`/dashboard/tokens/edit/${token.id}`}
                      className="flex flex-row gap-x-2 link"
                    >
                      <Pencil className="text-warning" /> Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="font-bold" colSpan={7}>
                  NO DATA FOUND.
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
