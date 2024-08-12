import { Button } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import Link from "~/components/atoms/link/Link";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="mt-5 ml-5">
      <Link to={"/react/tutorial"} rounded={10} p={2} bg={"#e0ffff"}>
        move to react tutorialtutorial
      </Link>
    </div>
  );
}
