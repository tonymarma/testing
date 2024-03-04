import Head from 'next/head'
import {
  useColorModeValue,
  FlexProps,
  Heading,
  Divider,
  HStack,
  Icon,
  Link,
  Text,
  SimpleGrid,
  Box,
  VStack,
  Skeleton,
} from '@chakra-ui/react'
import {
  FiHome,
  FiChevronRight,
  FiBox,
  FiClock,
  FiCpu,
  FiUsers,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getValidators } from '@/rpc/query'
import { selectTmClient } from '@/store/connectSlice'
import { selectNewBlock } from '@/store/streamSlice'
import { displayDate } from '@/utils/helper'
import { StatusResponse } from '@cosmjs/tendermint-rpc'

export default function Home() {
  const tmClient = useSelector(selectTmClient)
  const newBlock = useSelector(selectNewBlock)
  const [validators, setValidators] = useState<number>()
  const [isLoaded, setIsLoaded] = useState(false)
  const [status, setStatus] = useState<StatusResponse | null>()

  useEffect(() => {
    if (tmClient) {
      tmClient.status().then((response) => setStatus(response))
      getValidators(tmClient).then((response) => setValidators(response.total))
    }
  }, [tmClient])

  useEffect(() => {
    if ((!isLoaded && newBlock) || (!isLoaded && status)) {
      setIsLoaded(true)
    }
  }, [isLoaded, newBlock, status])

  return (
    <>
      <Head>
        <title>Home | Redbelly Explorer</title>
        <meta name="description" content="Home | Namada Explorer by Redbelly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HStack h="24px">
          <Heading size={'md'}>Home</Heading>
         <Divider borderColor={'gray'} size="10px" orientation="vertical" />
          <Link
            as={NextLink}
            href={'/'}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
            display="flex"
            justifyContent="center"
          >
            <Icon
              fontSize="16"
              color={useColorModeValue('light-theme', 'dark-theme')}
              as={FiHome}
            />
          </Link>
          <Icon fontSize="16" as={FiChevronRight} />
          <Text>Home</Text>
        </HStack>      
      </main>
    </>
  )
}

interface BoxInfoProps extends FlexProps {
  bgColor: string
  color: string
  icon: IconType
  name: string
  value: string | number | undefined
}
const BoxInfo = ({
  bgColor,
  color,
  icon,
  name,
  value,
  ...rest
}: BoxInfoProps) => {
  return (
    <VStack
      bg={useColorModeValue('light-container', 'dark-container')}
      shadow={'base'}
      borderRadius={4}
      p={4}
      height="150px"
    >
     <Box
      backgroundColor={bgColor} // Set background color to #FFFF00 (yellow)
      padding={2}
      height="40px"
      width="40px"
      borderRadius="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      mb={2}
    >
        <Icon fontSize="20" color={color} as={icon} />
      </Box>
      <Heading size={'md'}>{value}</Heading>
      <Text size={'sm'}>{name}</Text>
    </VStack>
  )
}
