import { Button, FormControl, FormErrorMessage, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { type ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData } from "@remix-run/react";
import * as yup from "yup";

import { Resend } from "resend";

import { getYupConstraint, parseWithYup } from "@conform-to/yup";
import { useForm, getFormProps, getInputProps, getTextareaProps } from "@conform-to/react";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  subject: yup.string().required(),
  content: yup.string().max(160, "Message is too long").required(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithYup(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const validatedData = submission.value;

  const { error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [`${validatedData.email}`],
    subject: validatedData.subject,
    html: `<strong>${validatedData.content}</strong>`,
  });

  if (error) {
    return submission.reply({
      formErrors: ["Failed to send the message. Please try again later."],
    });
  }

  return redirect("/conform-zod-sample/result");
};

export default function ConformSample() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getYupConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate: ({ formData }) => parseWithYup(formData, { schema }),
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-slate-200">
      <h2 className="font-semibold text-2xl mb-4">お問い合わせフォーム</h2>
      <Form method="post" {...getFormProps(form)} className="bg-white p-3 w-4/6 rounded-lg">
        <div className="text-red-500 text-center">{form.errors}</div>
        <FormControl isInvalid={!!fields.username.errors?.length}>
          <FormLabel htmlFor={fields.username.id}>名前</FormLabel>
          <Input {...getInputProps(fields.username, { type: "text" })} key={fields.username.key} />
          <FormErrorMessage id={fields.username.errorId}>{fields.username.errors}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!fields.email.errors?.length}>
          <FormLabel htmlFor={fields.email.id}>メールアドレス</FormLabel>
          <Input {...getInputProps(fields.email, { type: "email" })} />
          <FormErrorMessage id={fields.email.errorId}>{fields.email.errors}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!fields.subject.errors?.length}>
          <FormLabel htmlFor={fields.subject.id}>主題</FormLabel>
          <Input {...getInputProps(fields.subject, { type: "text" })} />
          <FormErrorMessage id={fields.subject.errorId}>{fields.subject.errors}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!fields.content.errors?.length}>
          <FormLabel htmlFor={fields.content.id}>本文</FormLabel>
          <Textarea {...getTextareaProps(fields.content)} />
          <FormErrorMessage id={fields.content.errorId}>{fields.content.errors}</FormErrorMessage>
        </FormControl>

        <Button type="submit" className="mt-3">
          送信
        </Button>
      </Form>
    </main>
  );
}
