import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import type { MailForm } from "../../lib/mailFormSchema";
import { mailformSchema } from "../../lib/mailFormSchema";

import { json } from "@remix-run/node";
import { Resend } from "resend";
import { useMailForm } from "~/hooks/useMailForm";
const resend = new Resend(process.env.RESEND_API_KEY);

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);
  const result = mailformSchema.safeParse(rawData);
  if (!result.success) {
    return json({ success: false, errors: result.error.flatten() });
  }
  const validatedData = result.data;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [`${validatedData.email}`],
    subject: validatedData.subject,
    html: `<strong>${validatedData.content}</strong>`,
  });

  if (error) {
    return json({ success: false, error }, 400);
  }

  return json({ success: true, data }, 200);
};

export default function InquiryForm() {
  const toast = useToast();
  const form = useMailForm();

  const submit = useSubmit();
  const onSubmit = useCallback((data: MailForm) => {
    submit(data, { method: "post" });
  }, []);

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      toast({
        title: "送信成功",
        description: "メールが正常に送信されました。",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      form.reset();
    }
  }, [form.formState.isSubmitSuccessful]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className="font-semibold text-2xl mb-4">お問い合わせフォーム</h2>
      <Form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormControl isInvalid={!!form.formState.errors.username}>
          <FormLabel htmlFor="username">名前</FormLabel>
          <Input id="username" {...form.register("username")} />
          <FormErrorMessage>
            {form.formState.errors.username &&
              form.formState.errors.username.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!form.formState.errors.email} className="mt-3">
          <FormLabel htmlFor="email">メールアドレス</FormLabel>
          <Input id="email" type="text" {...form.register("email")} />
          <FormErrorMessage>
            {form.formState.errors.email && form.formState.errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!form.formState.errors.subject}
          className="mt-3"
        >
          <FormLabel htmlFor="subject">主題</FormLabel>
          <Input id="subject" {...form.register("subject")} />
          <FormErrorMessage>
            {form.formState.errors.subject &&
              form.formState.errors.subject.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!form.formState.errors.content}
          className="mt-3"
        >
          <FormLabel htmlFor="content">本文</FormLabel>
          <Textarea id="content" {...form.register("content")} />
          <FormErrorMessage>
            {form.formState.errors.content &&
              form.formState.errors.content.message}
          </FormErrorMessage>
        </FormControl>

        <Button type="submit" className="mt-3">
          {form.formState.isSubmitting ? "送信中" : "送信"}
        </Button>
      </Form>
    </main>
  );
}

function MailFormOnlyReactFookForm() {
  type MailFormInputs = {
    name: string;
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MailFormInputs>();
  const submit = useSubmit();

  const onSubmit: SubmitHandler<MailFormInputs> = (data) => {
    submit(data, { method: "post" });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor="name">名前</FormLabel>
        <Input
          id="name"
          {...register("name", { required: "名前は必須です" })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.email} className="mt-3">
        <FormLabel htmlFor="email">メールアドレス</FormLabel>
        <Input
          id="email"
          type="text"
          {...register("email", {
            required: "メールアドレスは必須です",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "有効なメールアドレスを入力してください",
            },
          })}
        />
        <FormErrorMessage>
          {errors.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>

      <Button type="submit" className="mt-3">
        送信
      </Button>
    </Form>
  );
}
