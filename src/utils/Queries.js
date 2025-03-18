import { gql } from "@apollo/client";

const BOOKS_QUERY = gql`
  query {books {id name description }}
`;

const BOOK_QUERY = gql`
  query book($id: Int!) {
    book(id: $id) {
      id
      name
      description
    }
  }
`;

export { BOOKS_QUERY, BOOK_QUERY };