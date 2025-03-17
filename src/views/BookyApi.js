import React from "react";
import { Stack } from "@chakra-ui/react";
// Components
import ListBooksComponent from '../components/booky/List';
import CreateBookComponent from '../components/booky/Create';

export const BookyApiComponent = () => {

  return (
    <>

      <h2>Book List</h2>
      <Stack wrap="wrap" gap="5" align="center" justify="center">
        <CreateBookComponent />
        <ListBooksComponent />
      </Stack>
     
    </>
  );
}

export default BookyApiComponent;
