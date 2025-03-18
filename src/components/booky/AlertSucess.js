import React from 'react';
import { Alert, CloseButton, } from "@chakra-ui/react";

const AlerSuccessComponent = ({ showAlert, setShowAlert }) => {

  return (
    <>
      <Alert.Root status="success" variant="solid"
        position="absolute"
        top="10px"
        left="50%"
        transform="translateX(-50%)"
        zIndex="10"
        width="90%"
        height="fit-content"
      >
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Success !</Alert.Title>
        </Alert.Content>
        <CloseButton onClick={() => setShowAlert(false)} pos="relative" top="-2" insetEnd="-2" />
      </Alert.Root>
    </>
  )
}

export default AlerSuccessComponent;