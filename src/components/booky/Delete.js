// Hooks
import { useMutation } from "@apollo/client";
import { useState } from "react";
// Components
import AlerSuccessComponent from './AlertSucess';
import AlerErrorComponent from './AlertError';
import { Button, Dialog, Portal } from "@chakra-ui/react";
import { RiDeleteBinFill } from "react-icons/ri";
// Utils
import { DELETE_MUTATION } from '../../utils/Mutations'

const DeleteDialogComponent = ({ bookId, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  // Delete Book Mutation
  const [deleteBook, { data, loading, error }] = useMutation(DELETE_MUTATION, {
    onCompleted: () => {
      setShowAlert(true);
      refetch();
      setTimeout(() => {
        closeDialog();
      }, 5000);
    },
    onError: () => {
      setShowAlert(true);
    }
  });
  
  // Delete a book function
  const handleDelete = async(event) => {
    event.preventDefault();
    await deleteBook({ variables: { id: bookId } });
  };

  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog.Root isOpen={isOpen}  role="alertdialog" placement="center" trapFocus={false}>
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
            {/* Success deletion */}
            {showAlert && data && (
              <AlerSuccessComponent showAlert={showAlert} setShowAlert={setShowAlert} />
            )} 
            {/* Deletion fails alert */}
            {showAlert && error && (
              <AlerErrorComponent showAlert={showAlert} setShowAlert={setShowAlert} />
            )}
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