import { Button, CloseButton, Dialog, Portal, HStack } from "@chakra-ui/react"

const DeleteDialogComponent = () => {
  return (
    <HStack wrap="wrap" gap="4">
    <Dialog.Root role="alertdialog" placement='center' trapFocus='false'>
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
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red">Delete</Button>
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