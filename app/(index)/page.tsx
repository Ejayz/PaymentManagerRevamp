import BuilderPage from "@/components/UI/BuilderPage";
import LoginForm from "@/components/VIEW/LoginForm";
import Link from "next/link";
import Image from "next/image";
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
                  <Link href={"https://documenter.getpostman.com/view/25857384/2sAXqmB5wU"}>DOCS</Link>
                </li>
                <li>
                  <Link href={"/login"}>LOGIN</Link>
                </li>
              </ul>
            </div>
          </div>
          {/* Page content here */}
          <div className="grid w-full h-full grid-cols-2">
            <div className="card glass w-96 mx-auto my-auto">
              <figure>
                <Image
                  src="/IMG/data.png"
                  width={150}
                  height={150}
                  alt={"Data"}
                  className="p-4"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Track</h2>
                <p>Track transactions and site data you sent.</p>
              </div>
            </div>

            <div className="card glass w-96 mx-auto my-auto">
              <figure>
                <Image
                  src="/IMG/easy.png"
                  width={150}
                  height={150}
                  alt={"EASY"}
                  className="p-4"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Easy To Use</h2>
                <p>Easy to use . UI and Forms are made to be used easily.</p>
              </div>
            </div>

            <div className="card glass w-96 mx-auto my-auto">
              <figure>
                <Image
                  src="/IMG/management.png"
                  width={150}
                  height={150}
                  alt={"Management"}
                  className="p-4"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Manage</h2>
                <p>
                  Manage sites and transaction easily with multiple sites with
                  their own faucet pay api key.
                </p>
              </div>
            </div>

            <div className="card glass w-96 mx-auto my-auto">
              <figure>
                <Image
                  src="/IMG/vote.png"
                  width={150}
                  height={150}
                  alt={"Vote"}
                  className="p-4"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Multiple Sites</h2>
                <p>
                  Supports multiple sites with api and manual transaction . Send
                  payment to your user with custom api keys .
                </p>
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
              <Link href={"https://documenter.getpostman.com/view/25857384/2sAXqmB5wU"}>API</Link>
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
