import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getContact } from "../../data";
import { useLoaderData } from "@remix-run/react";
import * as z from "zod";

const paramsSchema = z.object({
  contactId: z.string(),
});

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const result = paramsSchema.safeParse(params);
  if (!result.success) throw json(result.error?.format().contactId?._errors.join(", "), { status: 400 });

  const contact = await getContact(result.data.contactId);
  if (!contact) throw json("Not Found", { status: 404 });

  return json({ contact });
};

export default function LoaderValidContactId() {
  const { contact } = useLoaderData<typeof loader>();
  console.log(contact);
  return (
    <div>
      <h1>LoaderValidContactId</h1>
    </div>
  );
}
