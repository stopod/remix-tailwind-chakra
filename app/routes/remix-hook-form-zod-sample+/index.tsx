import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import { Form } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Textarea } from "@chakra-ui/react";

const schema = z.object({
  username: z.string().min(2, "ユーザー名は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z.string().min(2, "主題は2文字以上でにゅうりょくしてください"),
  content: z.string().min(10, "本文は10文字以上で入力してください").max(160, "本文は160文字以内で入力してください"),
});
type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("action");
  const { errors, data } = await getValidatedFormData<FormData>(request, resolver);

  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json(errors);
  }

  // Do something with the data
  return json(data);
};

export default function InquiryForm() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className="font-semibold text-2xl mb-4">お問い合わせフォーム</h2>
      <Form onSubmit={handleSubmit} method="POST" className="w-full">
        <FormControl isInvalid={!!errors.username}>
          <FormLabel htmlFor="username">名前</FormLabel>
          <Input id="username" {...register("username")} />
          <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email} className="mt-3">
          <FormLabel htmlFor="email">メールアドレス</FormLabel>
          <Input id="email" type="text" {...register("email")} />
          <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.subject} className="mt-3">
          <FormLabel htmlFor="subject">主題</FormLabel>
          <Input id="subject" {...register("subject")} />
          <FormErrorMessage>{errors.subject && errors.subject.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.content} className="mt-3">
          <FormLabel htmlFor="content">本文</FormLabel>
          <Textarea id="content" {...register("content")} />
          <FormErrorMessage>{errors.content && errors.content.message}</FormErrorMessage>
        </FormControl>
        <Button type="submit" className="mt-3">
          {isSubmitting ? "送信中" : "送信"}
        </Button>
      </Form>
    </main>
  );
}
