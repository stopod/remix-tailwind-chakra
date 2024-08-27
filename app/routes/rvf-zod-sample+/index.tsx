import { withZod } from "@rvf/zod";
import * as z from "zod";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { useForm } from "@rvf/remix";
import { Form, useSubmit } from "@remix-run/react";

const validator = withZod(
  z.object({
    username: z.string().min(2, "ユーザー名は2文字以上で入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    subject: z.string().min(2, "主題は2文字以上でにゅうりょくしてください"),
    content: z.string().min(10, "本文は10文字以上で入力してください").max(160, "本文は160文字以内で入力してください"),
  })
);

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await validator.validate(await request.formData());
  console.log(result);
  return null;
};

export default function InquiryForm() {
  const submit = useSubmit();
  const onSubmit = (data: any) => {
    submit(data, { method: "post" });
  };
  const form = useForm({
    validator,
    handleSubmit: onSubmit,
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className="font-semibold text-2xl mb-4">お問い合わせフォーム</h2>
      <Form {...form.getFormProps()} method="post" className="w-full">
        <FormControl isInvalid={!!form.error("username")}>
          <FormLabel htmlFor="username">名前</FormLabel>
          <Input id="username" {...form.getInputProps("username")} />
          <FormErrorMessage>{form.error("username")}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!form.error("email")} className="mt-3">
          <FormLabel htmlFor="email">メールアドレス</FormLabel>
          <Input id="email" type="text" {...form.getInputProps("email")} />
          <FormErrorMessage>{form.error("email")}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!form.error("subject")} className="mt-3">
          <FormLabel htmlFor="subject">主題</FormLabel>
          <Input id="subject" {...form.getInputProps("subject")} />
          <FormErrorMessage>{form.error("subject")}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!form.error("content")} className="mt-3">
          <FormLabel htmlFor="content">本文</FormLabel>
          <Textarea id="content" {...form.getInputProps("content")} />
          <FormErrorMessage>{form.error("content")}</FormErrorMessage>
        </FormControl>
        <Button type="submit" className="mt-3">
          {form.formState.isSubmitting ? "送信中" : "送信"}
        </Button>
      </Form>
    </main>
  );
}
