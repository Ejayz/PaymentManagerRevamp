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
import toast from "react-hot-toast";
import * as Yup from "yup";
export default function SiteList() {
  const [page, setPage] = useState(1);
  const searchInput = useRef<HTMLInputElement>(null);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, error, isFetching, isLoading, refetch, isError } = useQuery({
    queryKey: ["site_list", page, search, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/ops/getsitelist?page=${page}&search=${search}&limit=${limit}`,
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

          <Link href="/dashboard/sites/new" className="btn btn-primary ">
            Add Site
          </Link>
        </div>

        <table className="table text-center">
          <thead>
            <tr className="">
              <th></th>
              <th>SITE_ID</th>
              <th>SITE NAME</th>
              <th>SITE LINK</th>
              <th>DESCRIPTION</th>
              <th>AUTO PAYMENT</th>
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
              data?.map((site: any, index: any) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{site.site_id}</td>
                  <td>{site.site_name}</td>
                  <td>
                    <Link className="link" href={site.site_link}>
                      {site.site_link}
                    </Link>
                  </td>
                  <td>{site.description}</td>
                  <td>
                    <div
                      className={`badge  badge-outline ${
                        site.auto_payment ? "badge-success" : "badge-error"
                      }`}
                    >
                      {site.auto_payment ? "Enabled" : "Disabled"}
                    </div>
                  </td>
                  <td className="justify-center items-center flex gap-4">
                    <Link
                      href={`/dashboard/sites/edit/${site.site_id}`}
                      className=""
                    >
                      <View size={30} strokeWidth={1} />
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
