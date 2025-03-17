import { Button, CloseButton, Dialog, Portal, Stack } from "@chakra-ui/react";
import { RiDeleteBinFill } from "react-icons/ri";
import { useMutation, gql } from "@apollo/client";
import { useState } from "react";

const DELETE_MUTATION = gql`
  mutation removeBook($id: Int!){ removeBook(id: $id) { name description} }
`;

const DeleteDialogComponent = ({ bookId, refetch }) => {

  const [isOpen, setIsOpen] = useState(false);

  const [deleteBook, {loading}]  = useMutation(DELETE_MUTATION, {
    onCompleted: () => {
      refetch();
      closeDialog();
    },
    onError: (error) => {
      alert('Error deleting book', error);
    }
  });

  const closeDialog = () => setIsOpen(false);

  const handleDelete = () => {
    deleteBook({ variables: { id: bookId } });
  };

  return (
    <Stack width="full" gap="4">
      <Dialog.Root isOpen={isOpen} onClose={closeDialog} role="alertdialog" placement="center" trapFocus={false}>
        <Dialog.Trigger asChild >
          <Button colorPalette='red' variant="outline">
            <RiDeleteBinFill /> Delete book
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
                <Button variant="outline" colorPalette="red" onClick={handleDelete} loading={loading}>Delete</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton colorPalette='red' variant='outline'/>
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Stack>


)
}

export default DeleteDialogComponent;