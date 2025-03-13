import { Button, CloseButton, Dialog, Portal, HStack } from "@chakra-ui/react";
import { useMutation, gql } from "@apollo/client";
import { useState } from "react";

const DELETE_MUTATION = gql`
  mutation removeBook($id: Int!){ removeBook(id: $id) { name description} }
`;

const DeleteDialogComponent = ({ bookId, refetch }) => {

  const [isOpen, setIsOpen] = useState(false);

  const [deleteBook]  = useMutation(DELETE_MUTATION, {
    onCompleted: () => {
      refetch();
      closeDialog();
    },
    onError: (error) => {
      console.error('Error deleting book', error);
    }
  });

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleDelete = () => {
    deleteBook({ variables: { id: bookId } });
  };

  return (
    <HStack wrap="wrap" gap="4">
      <Dialog.Root isOpen={isOpen} onClose={closeDialog} role="alertdialog" placement="center" trapFocus={false}>
        <Dialog.Trigger asChild >
          <Button colorPalette='red' variant="outline">
            Delete
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Are you sure?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>
                  This action cannot be undone. This will permanently delete this
                  book and remove it from our systems.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="red" onClick={handleDelete}>Delete</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  )
}

export default DeleteDialogComponent;