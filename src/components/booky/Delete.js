// Hooks
import { useMutation } from "@apollo/client";
import { useState } from "react";
// Components
import { Button, Dialog, Portal } from "@chakra-ui/react";
import { RiDeleteBinFill } from "react-icons/ri";
// Utils
import { DELETE_MUTATION } from '../../utils/Mutations'

const DeleteDialogComponent = ({ bookId, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Delete Book Mutation
  const [deleteBook, { loading }] = useMutation(DELETE_MUTATION, {
    onCompleted: () => {
      refetch();
      alert('Book successfully deleted');
    },
    onError: (error) => {
      alert('Error deleting book', error.message);
    }
  });

  const closeDialog = () => setIsOpen(false);
  // Delete a book function
  const handleDelete = () => {
    deleteBook({ variables: { id: bookId } });
  };

  return (
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
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default DeleteDialogComponent;