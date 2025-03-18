// Hooks
import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from "@apollo/client";
// Components
import AlerSuccessComponent from './AlertSucess';
import AlerErrorComponent from './AlertError';
import { Button, Dialog, Field, Input, Portal, Stack, HStack, Spinner } from "@chakra-ui/react";
import { RiEditFill } from "react-icons/ri";
// Queries & Mutations
import { UPDATE_BOOK_MUTATION } from '../../utils/Mutations';
import { BOOK_QUERY } from '../../utils/Queries';

const EditBookComponent = ({ book }) => {
  // Initialize inputs state with default values for name and description
  const [inputs, setInputs] = useState({
    name: '',
    description: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  // Query Book Details
  const  [fetchBookDetails, { data, loading, error }] = useLazyQuery(BOOK_QUERY);

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
  const [updateBook, { loading: updating, error: updateError, data: updateData }] = useMutation(UPDATE_BOOK_MUTATION, {
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
      setShowAlert(true); // Show success alert
    } catch (err) {
      console.log("Error updating book:", err);
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

  const handleOpen = () => {
    setIsOpen(true);
    fetchBookDetails({ variables: { id: book.id } });
  };

  const handleClose = () => { 
    setIsOpen(false);
  }

  if (loading) return <Spinner />;
  if (error) return <p>Error loading book:</p>;

  return (
    <>
      <Dialog.Root placement='center' open={isOpen} onOpenChange={handleOpen}>
        <Dialog.Trigger asChild>
          <Button variant="outline">
            <RiEditFill /> Edit Book
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content position="relative" maxW="500px">
              <Dialog.Header>
                <Dialog.Title>Edit Book</Dialog.Title>
              </Dialog.Header>
              {/* Alert Update Success */}
              { showAlert && updateData && (
                <AlerSuccessComponent showAlert={showAlert} setShowAlert={setShowAlert}/>
              )}
              {/* Alert Update Error */}
              { showAlert && updateError && (
                <AlerErrorComponent  showAlert={showAlert} setShowAlert={setShowAlert}/>
              )} 
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
                      <Button type="submit" variant='outline' colorPalette='green' loading={updating}>Update</Button>
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
