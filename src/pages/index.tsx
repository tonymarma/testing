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
        <h2>Redbelly explorer and analytics platform for the Namada Blockchain. It empowers users to delve into blocks, transactions, and addresses on the Namada network. We also have an Namada app carefully crafted for Namada Shielded Expedition players, where they can check their ranking, check transactions, blocks, governance proposals, and much more!</h2>
        <Box mt={8}>
          <SimpleGrid minChildWidth="200px" spacing="40px">
            <Skeleton isLoaded={isLoaded}>
              <BoxInfo
                bgColor="cyan.200"
                color="cyan.600"
                icon={FiBox}
                name="Latest Block Height"
                value={
                  newBlock?.header.height
                    ? newBlock?.header.height
                    : status?.syncInfo.latestBlockHeight
                }
              />
            </Skeleton>
            <Skeleton isLoaded={isLoaded}>
              <BoxInfo
                bgColor="green.200"
                color="green.600"
                icon={FiClock}
                name="Latest Block Time"
                value={
                  newBlock?.header.time
                    ? displayDate(newBlock?.header.time?.toISOString())
                    : status?.syncInfo.latestBlockTime
                    ? displayDate(
                        status?.syncInfo.latestBlockTime.toISOString()
                      )
                    : ''
                }
              />
            </Skeleton>

            <Skeleton isLoaded={isLoaded}>
              <BoxInfo
                bgColor="orange.200"
                color="orange.600"
                icon={FiCpu}
                name="Network"
                value={
                  newBlock?.header.chainId
                    ? newBlock?.header.chainId
                    : status?.nodeInfo.network
                }
              />
            </Skeleton>

            <Skeleton isLoaded={isLoaded}>
              <BoxInfo
                bgColor="purple.200"
                color="purple.600"
                icon={FiUsers}
                name="Validators"
                value={validators}
              />
            </Skeleton>
          </SimpleGrid>
        </Box>
         <div class="space-y-4 text-white">
      <h2 class="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl/relaxed">About Redbelly</h2>
      <p class="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
        We are a team of blockchain experts with years of experience in running and maintaining secure and reliable
        blockchain nodes and validators. Our mission is to make blockchain infrastructure accessible to everyone by
        providing easy-to-use, scalable, and secure solutions.
      </p>
    </div>
    <div class="space-y-4 text-white">
      <h2 class="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl/relaxed">Our Services On Namada</h2>
      <div class="grid gap-4 md:gap-6">
        <div class="flex items-center space-x-4">
          <div class="font-semibold">Public RPC</div>
          <p>
            Our high quality rpc endpoint is ready to serve on Namada Shielded-Expedition testnet. RPC Endpoint:
            <a class="text-blue-600 hover:underline" href="#" rel="ugc">
              https://namada.redbelly.xyz
            </a>
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <div>
            <div class="font-semibold">Block Explorer</div>
          </div>
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
