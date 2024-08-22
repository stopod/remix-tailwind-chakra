import { Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData, useSubmit } from "@remix-run/react";
import { useForm } from "react-hook-form";
import type { LoginForm } from "../shema/loginShema";
import { loginFormSchema } from "../shema/loginShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { json } from "@remix-run/node";
import Link from "~/components/atoms/link/Link";
import { supabase } from "../../../lib/supabaseClient";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);
  const result = loginFormSchema.safeParse(rawData);
  if (!result.success) {
    return json({ success: false, errors: result.error.flatten() });
  }
  const { email, password } = result.data;

  try {
    const { data, error: signinError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signinError) {
      if (signinError.message.includes("Invalid login credentials")) {
        return json({ success: false, message: "無効な認証情報です" });
      } else {
        throw signinError;
      }
    }
    console.log("login 成功");
    return redirect("/login-sample");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

export default function Login() {
  const data = useActionData<typeof action>();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = useSubmit();
  const onSubmit = useCallback((data: LoginForm) => {
    submit(data, { method: "post" });
  }, []);

  return (
    <div className="mx-auto max-w-sm my-14">
      <h2 className="text-center font-medium text-2xl mb-4">ログイン</h2>
      <h2 className="text-center text-red-500">{data?.success === false && data?.message}</h2>
      <Form onSubmit={loginForm.handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!loginForm.formState.errors.email}>
          <FormLabel htmlFor="email">MAIL</FormLabel>
          <Input id="email" type="text" {...loginForm.register("email")} />
          <FormErrorMessage>
            {loginForm.formState.errors.email && loginForm.formState.errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!loginForm.formState.errors.password}>
          <FormLabel htmlFor="password">パスワード</FormLabel>
          <Input id="password" type="password" {...loginForm.register("password")} />
          <FormErrorMessage>
            {loginForm.formState.errors.password && loginForm.formState.errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <Button type="submit" className="mt-4">
          ログイン
        </Button>
      </Form>
      <Link to="/login-sample/auth/signup" className="mt-4 block text-center text-blue-400">
        初めてご利用の方
      </Link>
    </div>
  );
}
