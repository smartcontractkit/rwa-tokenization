'use client'

import * as React from 'react'
import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          // className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Image
            src={open ? '/close.svg' : '/menu.svg'}
            height={20}
            width={20}
            alt={open ? 'close' : 'menu'}
            style={{
              transition: 'transform 0.3s ease-in-out',
              transform: open? 'rotate(90deg)' : 'rotate(0deg)'
            }}
          />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mt-3 lg:mr-[248px] max-w-[824px] w-screen rounded-t-none border-border bg-[#181D29] px-6 py-2"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          border: '4px solid #375BD2',
          backgroundColor: '#181D29',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="flex flex-col items-start space-y-2"
          style={{
            
          }}
        >
          <Link
            rel="noreferrer"
            href={siteConfig.paths.architecture}
            className={cn(
              buttonVariants({ variant: 'default' }),
              'space-x-2 bg-[#181D29] px-0 py-4 hover:bg-[#181D29]',
            )}
          >
            <Image src="/architecture.svg" width={18} height={18} alt="architecture" />
            <span className="text-base font-[450] leading-4 text-popover">
              Architecture
            </span>
          </Link>
          <Link
            rel="noreferrer"
            href={siteConfig.paths.design}
            className={cn(
              buttonVariants({ variant: 'default' }),
              'space-x-2 bg-[#181D29] px-0 py-4 hover:bg-[#181D29]',
            )}
          >
            <Image src="/design.svg" width={18} height={18} alt="design" 
              />
            <span className="text-base font-[450] leading-4 text-popover">
              Design
            </span>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
