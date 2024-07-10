'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { OnchainData } from '@/app/tokenization/onchain-data'

type UpdateButtonProps = {
    tokenId: string
}

export const UpdateButton = ({ tokenId }: UpdateButtonProps) => {
    const [update, setUpdate] = useState(false)
    const [message, setMessage] = useState(`Update Contract`)

    const handleClick = async () => {
      await setMessage('')
      await setUpdate(true)
    }

  return (
    <>
      <Button
        disabled={!tokenId || update}
        onClick={async () => await handleClick()}
        className="h-[46px] w-full bg-[#375BD2] py-3 text-xl font-medium leading-[26px] hover:bg-[#375BD2]/90 mb-2"
      >
       {message}
       {update && <OnchainData tokenId={tokenId} />}
      </Button>
    </>
  )
}
