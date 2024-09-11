"use client";

import { useQuery } from "@tanstack/react-query";
import DashboardNavigation from "../UI/DashboardNavigation";
import "chart.js/auto";
import dynamic from "next/dynamic";
import { config } from "dotenv";
import { DateTime } from "luxon";

export default function Charts() {
  const { data, error, isError, isFetching, isLoading } = useQuery({
    queryKey: ["charts"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/ops/getcharts`, {
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
        throw new Error("Something went wrong while fetching charts.");
      }
    },
    retry: 1,
  });

  const {
    data: statusData,
    error: statusError,
    isError: statusIsError,
    isFetching: statusIsFetching,
    isLoading: statusIsLoading,
  } = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/ops/getstatusstats`, {
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
        throw new Error("Something went wrong while fetching status stats.");
      }
    },
    retry: 1,
  });

  const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
    ssr: false,
  });

  const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
    ssr: false,
  });

  const statusLabels = statusData?.map((row: any) => row.status);
  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        label: "No. of Transactions",
        data: statusData?.map((row: any) => row.total_count),
        fill: false,
        tension: 2,
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const labels = data?.map((row: any) => row.date);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "No. of Transactions",
        data: data?.map((row: any) => row.total_rows),
        fill: false,
        tension: 2,
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderWidth: 1,
      },
    ],

    options: {
      layout: {
        padding: 20,
      },
      legend: {
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 18,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "7 Days Transactions",
        },
      },
    },
  };
  return (
    <>
      {(isLoading && isFetching) || (statusIsFetching && statusIsLoading) ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : isError || statusIsError ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">
            Something went wrong while fetching charts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 w-11/12 gap-6 mx-auto mt-6">
          <div className="flex flex-col   mx-auto p-6 bg-white w-3/4 rounded-md">
            <h1 className="text-3xl font-bold ">7 Days Transactions</h1>
            <h4 className=" text-xl font-light">
              {`This are transaction done for the last 7 days . From ${DateTime.fromISO(
                data[0].date
              ).toFormat("LLL dd , yyyy")} - ${DateTime.fromISO(
                data[6].date
              ).toFormat("LLL dd , yyyy")}`}{" "}
            </h4>
            <Bar data={chartData} className="font-bold text-xl" />
          </div>
          <div className="flex flex-col  mx-auto p-6 bg-white w-3/4 rounded-md">
            <h1 className="text-3xl font-bold ">
              Total Transaction Per Status
            </h1>
            <h4 className=" text-xl font-light">
              {`This chart shows total transaction per status.`}
            </h4>
            <Pie data={statusChartData} className="font-bold text-xl" />
          </div>
          <div></div>
          <div></div>
        </div>
      )}
    </>
  );
}
