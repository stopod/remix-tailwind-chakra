import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  useSubmit,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { SubmitHandler, useForm } from "react-hook-form";

import type { MailForm } from "../../lib/mailFormSchema";
import { mailformSchema } from "../../lib/mailFormSchema";
import { useCallback, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

import { json } from "@remix-run/node";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);
  const result = mailformSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten() };
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
  // 直近のactionの返却を受け取る、ない場合はundefined
  const actionData = useActionData<typeof action>();

  // 保留中のページナビゲーションに関する情報を取得する
  // POSTだと「idle → submitting → loading → idle」となる
  const navigation = useNavigation();

  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MailForm>({
    resolver: zodResolver(mailformSchema),
    defaultValues: {
      username: "",
      email: "",
      subject: "",
      content: "",
    },
  });

  const submit = useSubmit();
  const onSubmit = useCallback((data: MailForm) => {
    submit(data, { method: "post" });
  }, []);

  useEffect(() => {
    if (navigation.state === "idle" && actionData?.success) {
      toast({
        title: "送信成功",
        description: "メールが正常に送信されました。",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      reset();
    }
  }, [navigation.state, actionData]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className="font-semibold text-2xl mb-4">お問い合わせフォーム</h2>
      <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <FormControl isInvalid={!!errors.username}>
          <FormLabel htmlFor="username">名前</FormLabel>
          <Input id="username" {...register("username")} />
          <FormErrorMessage>
            {errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email} className="mt-3">
          <FormLabel htmlFor="email">メールアドレス</FormLabel>
          <Input id="email" type="text" {...register("email")} />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.subject} className="mt-3">
          <FormLabel htmlFor="subject">主題</FormLabel>
          <Input id="subject" {...register("subject")} />
          <FormErrorMessage>
            {errors.subject && errors.subject.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.content} className="mt-3">
          <FormLabel htmlFor="content">本文</FormLabel>
          <Textarea id="content" {...register("content")} />
          <FormErrorMessage>
            {errors.content && errors.content.message}
          </FormErrorMessage>
        </FormControl>

        <Button type="submit" className="mt-3">
          送信
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
