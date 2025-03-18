import { gql } from "@apollo/client";

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

const DELETE_MUTATION = gql`
  mutation removeBook($id: Int!){ removeBook(id: $id) { name description} }
`;

const CREATE_BOOK_MUTATION = gql`
  mutation createBook($createBookInput: CreateBookInput) {
    createBook(createBookInput: $createBookInput) {
      id 
      name 
      description
    }
  }
`;

export { UPDATE_BOOK_MUTATION, DELETE_MUTATION, CREATE_BOOK_MUTATION }; 