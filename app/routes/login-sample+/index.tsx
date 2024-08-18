import Link from "~/components/atoms/link/Link";

export default function LoginSample() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className="font-medium mb-5">Login Sample</h2>
      <div className="flex gap-3">
        <Link
          to={"/login-sample/auth/signup"}
          className="bg-red-500 py-2 px-6 rounded-md text-white hover:bg-red-600 duration-200"
        >
          新規登録
        </Link>

        <Link
          to={"/login-sample/auth/login"}
          className="bg-blue-500 py-2 px-6 rounded-md text-white hover:bg-blue-600 duration-200"
        >
          ログイン
        </Link>
      </div>
    </main>
  );
}
