import 'server-only'
import { cache } from 'react'
import { HouseResponse } from '@/types'

const API_URL = `https://api.chateau.voyage/house`

const fetchRealEstateData = cache(
  async <T>(
    tokenId: string = '0', // URLSearchParams,
    // revalidate = 10,
  ): Promise<T> => {
    const response = await fetch(
      `${API_URL}/${tokenId.toString()}`,
      {
        headers: {
        },
        // next: {
        //   revalidate,
        // },
        cache: 'no-store',
      },
    )
    if (response.status !== 200) {
      console.log(response)
      throw new Error(`Status ${response.status}`)
    }
    return response.json()
  },
)

export const fetchHouse = async (tokenId: string) => {
  const onchainData = await fetchRealEstateData<HouseResponse>(
    tokenId
  )
  return JSON.parse(`{
    "id": "${onchainData.id}", 
    "latestValue": "${onchainData?.latestValue}"
    }`) as HouseResponse
}

export const fetchOnChainHouse = async (tokenId: string) => {
  const data = await fetchRealEstateData<HouseResponse>(
    tokenId
  )
  return JSON.parse(`{
    "id": "${data.id}", 
    "listPrice": "${data?.listPrice}"
  }`) as HouseResponse
}

export const getTokenId = (houseReponse: HouseResponse) => {
  const tokenId = houseReponse?.id ?? '0'
  return tokenId
}

export const getListPrice = (houseReponse: HouseResponse) => {
  const listPrice = houseReponse?.listPrice ?? '0'
  return listPrice
}

export const getCurrentPrice = (houseReponse: HouseResponse) => {
  const latestValue = houseReponse?.latestValue ?? '0'
  return latestValue
}

export const getHomeAddress = (houseReponse: HouseResponse) => {
  const homeAddress = houseReponse?.homeAddress ?? ''
  return homeAddress
}

export const getSquareFootage = (houseReponse: HouseResponse) => {
  const squareFootage = houseReponse?.squareFootage ?? '0'
  return squareFootage
}