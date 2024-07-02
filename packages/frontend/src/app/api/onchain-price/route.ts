import { NextRequest, NextResponse } from 'next/server'

import { getHouseOnChain, getLatestRequestId, requestHouseOnChain } from '@/lib/request-onchain'
// import { addToHouseHistory } from '@/lib/history'

export async function POST(request: NextRequest) {
  const params = await request.json()
  if (!params || !params.tokenId) return NextResponse.error()

  const { tokenId } = params

  // submits: transaction to the blockchain.
  const { tx, requestId } = await requestHouseOnChain(tokenId)

  if (!tx) return NextResponse.error()

  return NextResponse.json({ tx, requestId })
}

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   // const requestId = searchParams.get('requestId') || ''
//   const tokenId = searchParams.get('tokenId') || ''
//   console.log('GET: tokenId: %s', tokenId)
//   const requestId = await getLatestRequestId(tokenId)
//   console.log('GET: requestId: %s', requestId)

//   if (!requestId) return NextResponse.error()

//   const data = await getHouseOnChain(requestId.toString())
//   console.log('GET: data: %s', data)
//   const index = data?.index
//   const response = data?.response
//   console.log('GET: index: %s; tokenId: %s; response: %s;', index, tokenId, response)

//   return NextResponse.json({ index, tokenId, response })
// }