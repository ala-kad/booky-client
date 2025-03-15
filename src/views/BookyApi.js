import React from "react";
import TableComponent from '../components/booky/Table';
import CreateBookComponent from '../components/booky/Create';

export const BookyApiComponent = () => {

  return (
    <>
      <h2>Book List</h2>
      <CreateBookComponent />
      <TableComponent />
    </>
  );
}

export default BookyApiComponent;
