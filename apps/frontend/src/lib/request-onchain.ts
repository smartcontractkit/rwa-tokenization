import 'server-only'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS_REAL_ESTATE, realEstateABI } from '@/config/contract'

/* RWA REQUEST */
export const getRealEstateContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.NETWORK_RPC_URL)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS_REAL_ESTATE,
    realEstateABI,
    signer,
  )
  return contract
}

export const getLatestRequestId = async (tokenId: string) => {
  const contract = getRealEstateContract()
  const requestId = await contract.latestRequestId(tokenId)
  console.log('getLatestRequestId: requestId: %s', requestId)

  if (!requestId) return

  return {
   requestId: requestId.toString()
  }
}

export const getHouseOnChain = async (requestId: string) => {
  const contract = getRealEstateContract()
  const result = await contract.requests(requestId)
  // console.log(result)

  if (!result.index || !result.tokenId || !result.response) return

  return {
    index: result.index.toString(),
    tokenId: result.tokenId,
    response: result.response.toString()
  }
}

export const requestHouseOnChain = async (tokenId: any) => {
  const contract = getRealEstateContract()
  const tx = await contract.requestLastPrice(
    tokenId,
    tokenId
  )
  const receipt = await tx.wait()
  console.log('requestHouseOnChain receipt:', receipt)
  
  const requestId = receipt?.logs[2].args[0] as string
  console.log('requestHouseOnChain requestId: ', requestId)
  return { 
    tx: receipt, 
    requestId: requestId 
  }
}