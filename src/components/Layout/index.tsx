import { ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Connect from '../Connect'
import LoadingPage from '../LoadingPage'
import Navbar from '../Navbar'
import {
  selectConnectState,
  selectTmClient,
  setConnectState,
  setTmClient,
  setRPCAddress,
} from '@/store/connectSlice'
import { subscribeNewBlock } from '@/rpc/subscribe'
import {
  setNewBlock,
  selectNewBlock,
  setSubsNewBlock,
} from '@/store/streamSlice'
import { NewBlockEvent } from '@cosmjs/tendermint-rpc'
import { LS_RPC_ADDRESS } from '@/utils/constant'
import { validateConnection, connectWebsocketClient } from '@/rpc/client'

export default function Layout({ children }: { children: ReactNode }) {
  const connectState = useSelector(selectConnectState)
  const tmClient = useSelector(selectTmClient)
  const newBlock = useSelector(selectNewBlock)
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (tmClient && !newBlock) {
      const subscription = subscribeNewBlock(tmClient, updateNewBlock)
      dispatch(setSubsNewBlock(subscription))
    }
  }, [tmClient, newBlock, dispatch])

  useEffect(() => {
    if (isLoading) {
      const address = window.localStorage.getItem(LS_RPC_ADDRESS)
      if (!address) {
        setIsLoading(false)
        return
      }

      connect(address)
    }
  }, [isLoading])

  const updateNewBlock = (event: NewBlockEvent): void => {
    dispatch(setNewBlock(event))
  }

  const connect = async (address: string) => {
    try {
      const isValid = await validateConnection(address)
      if (!isValid) {
        window.localStorage.removeItem(LS_RPC_ADDRESS)
        setIsLoading(false)
        return
      }

      const tmClient = await connectWebsocketClient(address)
      if (!tmClient) {
        window.localStorage.removeItem(LS_RPC_ADDRESS)
        setIsLoading(false)
        return
      }

      dispatch(setConnectState(true))
      dispatch(setTmClient(tmClient))
      dispatch(setRPCAddress(address))

      setIsLoading(false)
    } catch (err) {
      console.error(err)
      window.localStorage.removeItem(LS_RPC_ADDRESS)
      setIsLoading(false)
      return
    }
  }

  return (
    <>
      {isLoading ? <LoadingPage /> : null}
      {connectState && !isLoading ? <Navbar /> : null}
      {children}
      {!connectState && !isLoading ? <Connect /> : null}
    </>
  )
}
