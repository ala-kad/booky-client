

import { HStack, Button, Stack, Table } from "@chakra-ui/react";
import DeleteDialogComponent from "./Delete";

import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../ui/pagination";

import { useQuery, gql } from "@apollo/client";


const TableComponent = () => {

  const BOOKS_QUERY = gql`
    {books {id name description }}
  `;

  const { data, loading, error } = useQuery(BOOKS_QUERY);

 if (loading) return <p>Loading...</p>;
 if (error) return <p>Error: {error.message}</p>;


  return (
    <Stack width="full" gap="5">
      <Table.Root size="sm" >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.books?.map((book) => (
            <Table.Row key={book?.id}>
              <Table.Cell>{book?.name}</Table.Cell>
              <Table.Cell>{book?.description}</Table.Cell>
              <DeleteDialogComponent />
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <PaginationRoot count={data.books.length} pageSize={3} page={1}>
      <HStack wrap="wrap">
        <PaginationPrevTrigger />
        <PaginationItems />
        <PaginationNextTrigger />
      </HStack>
      </PaginationRoot>
    </Stack>
    
  )
}

export default TableComponent;