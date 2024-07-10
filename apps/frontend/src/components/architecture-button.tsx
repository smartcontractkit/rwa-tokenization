'use client'

// import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

type ShowProps = {
  show?: string
}

export const ArchitectureButton = ({ show }: ShowProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const submit = (show: string) => {
    router.push(`${pathname}${'architecture'}`)
  }
  return (
    <>
    {show ?
      <Button
        onClick={() => submit(show)}
        className="h-[46px] w-full bg-[#375BD2] py-3 text-xl font-medium leading-[26px] hover:bg-[#375BD2]/90 mb-2"
      >
        Functions Architecture
      </Button>
      : 
      <a href="/" className="flex max-w-[1440px] items-center space-x-2">
      <Button
        className="h-[46px] w-full bg-[#375BD2] py-3 text-xl font-medium leading-[26px] hover:bg-[#375BD2]/90 mb-2"
      >
        {'Return'}
      </Button>
      </a>
      }
    </>
  )
}