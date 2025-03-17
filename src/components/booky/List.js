import { Stack, Table, IconButton, ButtonGroup, Pagination } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
// Components
import EditBookComponent from "./Edit";
import DeleteDialogComponent from "./Delete";
import {
  PaginationItems,
  PaginationRoot,
} from "../ui/pagination"; // Pagination CHAKR-UI COMPONENT


const BOOKS_QUERY = gql`
  {books {id name description }}
`;

const ListBooksComponent = () => {

  const { data, loading, error, refetch } = useQuery(BOOKS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Stack width="full" gap="5">
      <Table.Root interactive colorPalette='blue' variant='outline' size='sm' showColumnBorder={true}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader colSpan={2} textAlign="center">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.books?.map((book) => (
            <Table.Row key={book?.id}>
              <Table.Cell>{book?.name}</Table.Cell>
              <Table.Cell>{book?.description}</Table.Cell>
              <Table.Cell textAlign="center">
                <EditBookComponent book={book} />
              </Table.Cell>
              <Table.Cell textAlign="center">
                <DeleteDialogComponent bookId={book.id} refetch={refetch} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <PaginationRoot count={data.books.length } pageSize={3} defaultPage={1}>
      <ButtonGroup variant="ghost" size="sm" wrap="wrap">
        <Pagination.PrevTrigger asChild>
            <IconButton>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>
          <PaginationItems 
            render={(page) => (
              <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                {page.value}
              </IconButton>
            )}
          />
           <Pagination.NextTrigger asChild>
            <IconButton>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </PaginationRoot>
    </Stack>

  )
}

export default ListBooksComponent;