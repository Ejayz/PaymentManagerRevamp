"use client";

export default function FormBased({
  children,
  breadcrumbs,
}: {
  children: React.ReactNode;
  breadcrumbs?: {
    name: string;
    link: string;
  }[];
}) {
  return (
    <div className="flex flex-col w-11/12 mx-auto ">
      <div className="breadcrumbs my-12 text-xl font-bold">
        <ul>
          {breadcrumbs?.map((breadcrumb, index) => (
            <li key={index}>
              <a href={breadcrumb.link}>{breadcrumb.name}</a>
            </li>
          ))}
        </ul>
      </div>
      {children}
    </div>
  );
}
