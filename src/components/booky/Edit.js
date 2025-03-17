import React, { useState, useEffect } from 'react';
import { Button, Dialog, Field, Input, Portal, Stack, HStack } from "@chakra-ui/react";
import { RiEditFill } from "react-icons/ri";
import { useMutation, useQuery, gql } from "@apollo/client";

// GraphQL Query: Fetch Book Details
const BOOK_QUERY = gql`
  query book($id: Int!) {
    book(id: $id) {
      id
      name
      description
    }
  }
`;

// GraphQL Mutation: Update Book
const UPDATE_BOOK_MUTATION = gql`
  mutation updateBook($updateBookInput: UpdateBookInput!) {
    updateBook(updateBookInput: $updateBookInput) {
      id
      name
      description
    }
  }
`;

const EditBookComponent = ({ book }) => {
  const { data, loading, error } = useQuery(BOOK_QUERY, {
    variables: { id: book.id },
    skip: !book.id, // Skip query if bookId is not provided
  });

  // Initialize inputs state with default values for name and description
  const [inputs, setInputs] = useState({
    name: '',
    description: ''
  });

  // Update state when data is loaded
  useEffect(() => {
    if (data && data.book) {
      setInputs({
        name: data.book.name || '', // Use empty string if data is missing
        description: data.book.description || '', // Use empty string if data is missing
      });
    }
  }, [data]);

  // Mutation Hook: Update Book
  const [updateBook] = useMutation(UPDATE_BOOK_MUTATION, {
    update(cache, { data: { updateBook } }) {
      cache.modify({
        fields: {
          book(existingBooks = []) {
            // Ensure existingBooks is always an array
            if (!Array.isArray(existingBooks)) {
              existingBooks = [];
            }
            return existingBooks.map((b) =>
              b.id === updateBook.id ? updateBook : b
            );
          },
        },
      });
    },
    onCompleted: () => alert("Book updated successfully!"),
    onError: (err) => alert(`Error: ${err.message}`),
  });


  // Handle Input Change
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  };

  // Handle Form Submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateBook({
        variables: {
          updateBookInput: {
            id: book.id, // Ensure the id is included
            name: inputs.name,
            description: inputs.description,
          },
        },
      });
    } catch (err) {
      alert("Error updating book:", err);
    }
  };

  // Handle Reset
  const handleReset = () => {
    if (data && data.book) {
      setInputs({
        name: data.book.name,
        description: data.book.description,
      });
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>Error loading book: {error.message}</p>;

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="outline">
            <RiEditFill /> Edit Book
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Book</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4">
                <form onSubmit={handleSubmit}>
                  <Stack gap="4">
                    <Field.Root>
                      <Field.Label>Book Name</Field.Label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Enter book name"
                        value={inputs.name}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Description</Field.Label>
                      <Input
                        type="text"
                        name="description"
                        placeholder="Enter book description"
                        value={inputs.description}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <HStack alignSelf='end'>
                      <Button type="submit" variant='outline' colorPalette='green' loading={loading}>Update</Button>
                      <Button type="reset" onClick={handleReset} variant='outline'>Reset</Button>
                    </HStack>
                  </Stack>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" colorPalette='red'>Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default EditBookComponent;
