import React from 'react';
import { Alert, CloseButton, } from "@chakra-ui/react";

const AlerErrorComponent = ({ showAlert, setShowAlert }) => {
  
  return (
    <>
    <Alert.Root status="error" variant="solid"
      position="absolute"
      top="-10px"
      left="50%"
      transform="translateX(-50%)"
      zIndex="10"
      width="90%"
    >
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Error !</Alert.Title>
      </Alert.Content>
      <CloseButton onClick={() => setShowAlert(false)} pos="relative" top="-2" insetEnd="-2" />
    </Alert.Root>
    </>
  )
}

export default AlerErrorComponent;