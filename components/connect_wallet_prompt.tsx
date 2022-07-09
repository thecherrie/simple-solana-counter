import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

interface ConnectWalletPromptProps {
  isOpen: boolean;
  onClose?: () => void;
  connectWallet: () => void;
  showUninstalledSolanaError: boolean;
}

export const ConnectWalletPrompt = ({
  isOpen,
  connectWallet,
  showUninstalledSolanaError,
}: ConnectWalletPromptProps) => {
  const cancelRef = React.useRef();

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Connect Wallet
            </AlertDialogHeader>

            <AlertDialogBody>
              <p>Please connect your Solana wallet.</p>
              {showUninstalledSolanaError && (
                <Alert mt={3} status="error">
                  <AlertIcon />
                  You don't have a Solana wallet installed. Please
                  install a compatible wallet and try again.
                </Alert>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="blue" onClick={connectWallet} ml={3}>
                Connect your Wallet
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
