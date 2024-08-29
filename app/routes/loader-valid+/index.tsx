import { getContacts } from "../../data";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import Link from "~/components/atoms/link/Link";

export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

export default function LoaderValid() {
  const { contacts } = useLoaderData<typeof loader>();
  return (
    <div>
      <TableContainer className="w-4/5 rounded-lg mx-auto bg-blue-50 mt-5 mb-5">
        <Table variant="simple">
          <Thead>
            <Tr className="bg-blue-200">
              <Th>id</Th>
              <Th>first</Th>
              <Th>last</Th>
              <Th>twitter</Th>
            </Tr>
          </Thead>
          <Tbody>
            {contacts.map((contact) => (
              <Tr key={contact.id}>
                <Td className="bg-blue-200 hover:cursor-pointer">
                  <Link to={`/loader-valid/${contact.id}`}>{contact.id}</Link>
                </Td>
                <Td>{contact.first}</Td>
                <Td>{contact.last}</Td>
                <Td>{contact.twitter}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}
