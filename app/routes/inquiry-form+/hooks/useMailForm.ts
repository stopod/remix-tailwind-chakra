import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { MailForm } from "../shema/mailFormSchema";
import { mailformSchema } from "../shema/mailFormSchema";

export const useMailForm = () => {
  const form = useForm<MailForm>({
    resolver: zodResolver(mailformSchema),
    defaultValues: {
      username: "",
      email: "",
      subject: "",
      content: "",
    },
  });

  return form;
};
