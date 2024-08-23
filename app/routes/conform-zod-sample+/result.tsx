import { CheckIcon } from "@chakra-ui/icons";
import Link from "~/components/atoms/link/Link";

export default function ConformResult() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-slate-200">
      <h2 className="font-semibold text-2xl mb-4">送信成功</h2>
      <CheckIcon w={100} h={100} color={"green"} />
      <Link to={"/"}>TOPに戻る</Link>
    </main>
  );
}
