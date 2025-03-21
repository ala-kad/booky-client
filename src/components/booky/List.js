import { useQuery } from "@apollo/client";
// Components
import EditBookComponent from "./Edit";
import DeleteDialogComponent from "./Delete";
import { Table, IconButton, ButtonGroup, Pagination } from "@chakra-ui/react";
import { PaginationItems, PaginationRoot } from "../ui/pagination";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
// Queries & Mutations
import { BOOKS_QUERY } from '../../utils/Queries';

const ListBooksComponent = () => {
  const { data, loading, error, refetch } = useQuery(BOOKS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (data.books.length==0) return <p>No books found</p>;
  return (
    <>
      <Table.Root interactive variant='outline' size='sm' showColumnBorder={true}>
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
      {/* Pagination component */}
      <PaginationRoot count={data.books.length} pageSize={3} defaultPage={1} my="2">
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
    </>
  )
}

export default ListBooksComponent;