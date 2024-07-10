export type HouseHistoryEntry = {
  txHash: string
  tokenId: string
  listPrice: string
  latestValue: string
  homeAddress: string
  squareFootage: string
}

export type HouseResponse = {
  id: string
  homeAddress: string
  listPrice: string
  latestValue: string
  squareFootage: string
  needsUpdate: string
}

export type MediaData = {
  media_key: string
  type: 'animated_gif' | 'photo' | 'video'
  url?: string
  preview_image_url?: string
}
