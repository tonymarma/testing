import { useColorModeValue, Flex, Spinner } from '@chakra-ui/react'
import Head from 'next/head'

export default function LoadingPage() {
  return (
    <>
      <Head>
        <title>Redbelly Explorer</title>
        <meta name="description" content="Redbelly Block Explorer For Namada Shielded-Expedition" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Flex
  minH={'100vh'}
  align={'center'}
  justify={'center'}
  w="100"
  bg="#FFFF00"
>
  <Spinner size="xl" />
</Flex>

    </>
  )
}
