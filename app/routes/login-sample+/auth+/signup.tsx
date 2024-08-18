import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, redirect, useActionData, useSubmit } from "@remix-run/react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "~/components/atoms/link/Link";
import type { SignupForm } from "../../../lib/signupShema";
import { signupFormSchema } from "../../../lib/signupShema";
import { supabase } from "../../../lib/supabaseClient";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);
  const result = signupFormSchema.safeParse(rawData);
  if (!result.success) {
    return json({ success: false, errors: result.error.flatten() });
  }
  const validatedData = result.data;

  try {
    const { data, error: signupError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (signupError) {
      console.log(signupError);
      throw signupError;
    }

    const { error: userError } = await supabase.from("User").insert([
      {
        id: data.user?.id,
        username: validatedData.username,
        email: validatedData.email,
      },
    ]);

    if (userError) {
      if (
        userError.message.includes(
          'duplicate key value violates unique constraint "User_pkey"'
        )
      ) {
        return json({ success: false, message: "既に存在するユーザーです" });
      } else {
        console.log(userError);
        throw userError;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  return redirect("/login-sample/auth/login");
};

export default function Signup() {
  const data = useActionData<typeof action>();

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const submit = useSubmit();
  const onSubmit = useCallback((data: SignupForm) => {
    submit(data, { method: "post" });
  }, []);

  return (
    <div className="mx-auto max-w-sm my-14">
      <h2 className="text-center font-medium text-2xl mb-4">新規登録</h2>
      <h2 className="text-center text-red-500">
        {data?.success === false && data?.message}
      </h2>
      <Form onSubmit={signupForm.handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!signupForm.formState.errors.username}>
          <FormLabel htmlFor="username">ユーザー名</FormLabel>
          <Input
            id="username"
            type="text"
            {...signupForm.register("username")}
          />
          <FormErrorMessage>
            {signupForm.formState.errors.username &&
              signupForm.formState.errors.username.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!signupForm.formState.errors.email}>
          <FormLabel htmlFor="email">MAIL</FormLabel>
          <Input id="email" type="text" {...signupForm.register("email")} />
          <FormErrorMessage>
            {signupForm.formState.errors.email &&
              signupForm.formState.errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!signupForm.formState.errors.password}>
          <FormLabel htmlFor="password">パスワード</FormLabel>
          <Input
            id="password"
            type="password"
            {...signupForm.register("password")}
          />
          <FormErrorMessage>
            {signupForm.formState.errors.password &&
              signupForm.formState.errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <Button type="submit" className="mt-4">
          新規登録
        </Button>
      </Form>
      <Link
        to="/login-sample/auth/login"
        className="mt-4 block text-center text-blue-400"
      >
        既に登録済みの方はこちら
      </Link>
    </div>
  );
}
