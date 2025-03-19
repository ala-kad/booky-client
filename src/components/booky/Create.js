// Hooks
import React, { useState } from 'react';
import { useMutation, useApolloClient } from "@apollo/client";
// Components
import AlerSuccessComponent from './AlertSucess';
import AlerErrorComponent from './AlertError';
import { Button, Dialog, Field, Input, Portal, HStack, Stack } from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";
// Utils
import { BOOKS_QUERY } from '../../utils/Queries';
import { CREATE_BOOK_MUTATION } from '../../utils/Mutations';

const CreateBookComponent = () => {
  const [inputs, setInputs] = useState({});
  const client = useApolloClient();
  const [showAlert, setShowAlert] = useState(false);
  
  // Create Book Mutation
  const [createBook, { data, loading, error }] = useMutation(CREATE_BOOK_MUTATION, {
    update(cache, { data: { createBook } }) {
      try {
        const existingBooks = cache.readQuery({ query: BOOKS_QUERY });
        if (existingBooks) {
          cache.writeQuery({
            query: BOOKS_QUERY,
            data: { books: [...existingBooks.books, createBook] },
          });
        }
      } catch (err) {
        alert("Error updating cache:", err);
      }
    },
  });

  // Detects form inputs values change 
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  }

  // Handles form submit event
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      await createBook({
        variables: {
          createBookInput: {
            name: inputs.name,
            description: inputs.description
          }
        },
        onCompleted: () => {
          setShowAlert(true);
        },
        onError: (err) => {
          setShowAlert(true);
        }
      });
      await client.refetchQueries({ include: ["BOOKS_QUERY"] });
    } catch (err) {
      setShowAlert(true);
    }
  };

  // Handle reset form event
  const handleReset = () => {
    setInputs({ name: '', description: '' });
  }

  return (
    <>
      <Dialog.Root colorPaltte='green'>
        <Dialog.Trigger asChild>
          <Button variant="outline" colorPalette="green" alignSelf="end">
            <RiAddFill /> Create new book
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content position="relative">
              {/* Alert Update Success */}
              { showAlert && data && (
                <AlerSuccessComponent showAlert={showAlert} setShowAlert={setShowAlert}/>
              )}
              {/* Alert Update Error */}
              { showAlert && error && (
                <AlerErrorComponent  showAlert={showAlert} setShowAlert={setShowAlert}/>
              )} 
              <Dialog.Header>
                <Dialog.Title>Create a new book</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4" >
                <form onSubmit={handleSubmit}>
                  <Stack gap="4">
                    <Field.Root>
                      <Field.Label>Book Name</Field.Label>
                      <Input
                        type='text'
                        name="name"
                        placeholder='Enter book name'
                        value={inputs.name || ''}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root >
                      <Field.Label>Description</Field.Label>
                      <Input
                        type='text'
                        name="description"
                        placeholder='Enter book description'
                        value={inputs.description || ''}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <HStack gap="2" alignSelf="end">
                      <Button type="submit" loading={loading} variant="outline" colorPalette="green">Submit</Button>
                      <Button type='reset' onClick={handleReset} variant="outline">Reset</Button>
                    </HStack>
                  </Stack>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" colorPalette="red">Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default CreateBookComponent;