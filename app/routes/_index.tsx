import type { MetaFunction } from "@remix-run/node";
import Link from "~/components/atoms/link/Link";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  return (
    <>
      <div className="mt-5 ml-5">
        <Link to={"/react/reducer"} rounded={10} p={2} bg={"#e0ffff"}>
          move to react reducer
        </Link>
      </div>
      <div className="mt-5 ml-5">
        <Link to={"/react/context"} rounded={10} p={2} bg={"#e0ffff"}>
          move to react context
        </Link>
      </div>
      <div className="mt-5 ml-5">
        <Link to={"/react/reducer-context"} rounded={10} p={2} bg={"#e0ffff"}>
          move to react reducer-context
        </Link>
      </div>
      <div className="mt-5 ml-5">
        <Link to={"/react/effect"} rounded={10} p={2} bg={"#e0ffff"}>
          move to react effect
        </Link>
      </div>

      <div className="mt-5 ml-5">
        <Link to={"/react-hook-form-zod-sample"} rounded={10} p={2} bg={"#e0ff00"}>
          move to react-hook-form-zod-sample
        </Link>
      </div>

      <div className="mt-5 ml-5">
        <Link to={"/remix-hook-form-zod-sample"} rounded={10} p={2} bg={"#e0ff00"}>
          move to remix-hook-form-zod-sample
        </Link>
      </div>

      <div className="mt-5 ml-5">
        <Link to={"/conform-zod-sample"} rounded={10} p={2} bg={"#e0ff00"}>
          move to conform-zod-sample
        </Link>
      </div>

      <div className="mt-5 ml-5">
        <Link to={"/conform-yup-sample"} rounded={10} p={2} bg={"#e0ff00"}>
          move to conform-yup-sample
        </Link>
      </div>

      <div className="mt-5 ml-5">
        <Link to={"/rvf-zod-sample"} rounded={10} p={2} bg={"#e0ff00"}>
          move to rvf-zod-sample
        </Link>
      </div>

      <div className="mt-5 ml-5">
        <Link to={"/login-sample"} rounded={10} p={2} bg={"#e0bb00"}>
          move to login-sample
        </Link>
      </div>
    </>
  );
}
