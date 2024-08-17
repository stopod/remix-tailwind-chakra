import * as z from "zod";

export type MailForm = z.infer<typeof mailformSchema>;
export const mailformSchema = z.object({
  username: z.string().min(2, "ユーザー名は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z.string().min(2, "主題は2文字以上でにゅうりょくしてください"),
  content: z
    .string()
    .min(10, "本文は10文字以上で入力してください")
    .max(160, "本文は160文字以内で入力してください"),
});
