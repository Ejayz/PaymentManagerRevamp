import BuilderPage from "@/components/UI/BuilderPage";
import LoginForm from "@/components/VIEW/LoginForm";
import Link from "next/link";

export default function Home() {
  return (
    <main
      data-theme="light"
      className={`flex min-h-screen   justify-between bg-[url('/SVGS/bg.svg')] bg-cover bg-center`}
    >
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-white shadow-md w-full">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2 font-bold">
              OdNetwork Payment Manager
            </div>
            <div className="hidden flex-none lg:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
                <li>
                  <Link href={"/"}>HOME</Link>
                </li>
                <li>
                  <Link href={"/docs"}>DOCS</Link>
                </li>
                <li>
                  <Link href={"/login"}>LOGIN</Link>
                </li>
              </ul>
            </div>
          </div>
          {/* Page content here */}
          <div className="w-full flex flex-row">
            <div className="bg-white border w-11/12 rounded-md mx-auto">
              <div>
                <h1 className="text-3xl font-bold text-center">
                  sendtransacton
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <Link href={"/"}>HOME</Link>
            </li>
            <li>
              <Link href={"/docs"}>API</Link>
            </li>
            <li>
              <Link href={"/login"}>LOGIN</Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
