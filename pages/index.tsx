import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Divider,
  Flex,
  Heading,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stat,
  StatNumber,
  Tag,
  Text,
  Textarea,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ConnectWalletPrompt } from "../components/connect_wallet_prompt";
import styles from "../styles/Home.module.css";
import idl from "../idl/counter.json";
import {
  increment,
  getNumberAccount,
  initCounter,
  decrement,
} from "../helpers/counter_client";

const Home: NextPage = () => {
  const [number, setNumber] = useState(null);
  const [address, setAddress] = useState(null);
  const [useModifier, setUseModifier] = useState(false);
  const [modifierValue, setModifierValue] = useState(0);
  const [showUninstalledSolanaError, setShowUninstalledSolanaError] = useState(false)

  const connectWallet = async (): Promise<void> => {
    setShowUninstalledSolanaError(false)
    const { solana } = window as any;
    if (solana) {
      const response = await solana.connect();
      setAddress(response.publicKey.toString());
    } else {
      setShowUninstalledSolanaError(true)
      return console.error("You do not have a Solana wallet installed.")
    }
  };

  const truncate = (str: string | null): string | null => {
    if (str) {
      return (
        str.substring(0, 5) + "..." + str.substring(str.length - 3, str.length)
      );
    }
    return null;
  };

  const _getNumberAccount = async () => {
    const account = await getNumberAccount();
    if (account) {
      console.log(number);
      console.log("account is founnd!", account);
      return setNumber(account.value.toString());
    }
    return setNumber(null);
  };

  useEffect(() => {
    if(!window.solana) return console.warn("You do not appear to have a Solana wallet installed.")
    _getNumberAccount();
  }, []);

  // Wrapper functions for incremeent/decrement
  const handleIncrement = async () => {
    const incrementedNumber = await increment(modifierValue);
    setNumber(incrementedNumber);
  };

  const handleDecrement = async () => {
    const decrementedNumber = await decrement(modifierValue);
    setNumber(decrementedNumber);
  };

  return (
    <div style={{ backgroundColor: "#1A2238" }}>
      <Box p={2} position="absolute" width="100%">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading color="#fff">counter</Heading>
          <Button colorScheme="blue" size="md">
            {truncate(address) ?? "Not connected"}
          </Button>
        </Flex>
        <Divider mt={2} />
      </Box>
      <Center style={{ height: "100vh" }}>
        {!address && (
          <ConnectWalletPrompt
            isOpen={address === null}
            connectWallet={connectWallet}
            showUninstalledSolanaError={showUninstalledSolanaError}
          />
        )}
        <Box maxW={400}>
          <Box>
            <Heading color="#fff">Solana Counter</Heading>
            <Text my={4} color="#fff" fontSize="1xl">
              Simple counter smart contract written in Rust and Anchor.
            </Text>
            <Stat>
              <StatNumber color="#fff" fontSize="6xl">
                {number ?? "Uninitialised"}
              </StatNumber>
            </Stat>
          </Box>
          <Flex>
            {number ? (
              <>
                <Button
                  onClick={handleIncrement}
                  disabled={!address || modifierValue > 10}
                  mr={2}
                >
                  Increment
                </Button>
                <Button
                  mr={2}
                  onClick={handleDecrement}
                  disabled={number === 0 || !address || modifierValue > 10}
                >
                  Decrement
                </Button>
                <NumberInput
                  disabled={!useModifier}
                  onChange={(val: number) => setModifierValue(val)}
                  max={10}
                  min={0}
                >
                  <NumberInputField
                    placeholder="Modifier (2 - 10)"
                    color="#fff"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper color="#fff" />
                    <NumberDecrementStepper color="#fff" />
                  </NumberInputStepper>
                </NumberInput>
              </>
            ) : (
              <Button
                onClick={async () => {
                  await initCounter();
                  const account = await getNumberAccount();
                  if (account) setNumber(account.value.toString());
                }}
                disabled={!address}
              >
                One time initialise
              </Button>
            )}
          </Flex>
          <Checkbox
            onChange={() => {
              setUseModifier(!useModifier);
              if (useModifier) setModifierValue(0);
            }}
            isChecked={useModifier}
            color="#fff"
            mt={4}
          >
            Use modifier
          </Checkbox>
        </Box>
      </Center>
      <Box position="absolute" p={3} bottom={0} width="100%" color="#fff">
        <Divider />
        <Center>
          <Text mt={2}>Made with ❤️ by Cherrie</Text>
        </Center>
      </Box>
    </div>
  );
};

export default Home;
