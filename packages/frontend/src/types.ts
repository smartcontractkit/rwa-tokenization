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

export type UserData = {
  id: string
  username: string
  name: string
  profile_image_url: string
}

export type UserError = {
  value: string
  detail: string
  title: string
  resource_type: string
  parameter: string
  resource_id: string
  type: string
}

export type DataResponse = {
  errors?: UserError[]
  user?: UserData
  media?: string[]
}

export type UserDataResponse = {
  data?: UserData
  errors?: UserError[]
}

export type MediaData = {
  media_key: string
  type: 'animated_gif' | 'photo' | 'video'
  url?: string
  preview_image_url?: string
}
