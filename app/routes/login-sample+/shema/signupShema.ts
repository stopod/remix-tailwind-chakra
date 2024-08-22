import * as z from "zod";

export type SignupForm = z.infer<typeof signupFormSchema>;
export const signupFormSchema = z.object({
  username: z.string().min(2, "ユーザー名は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(
      /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
      "パスワードは半角英数字混合で入力してください"
    ),
});
