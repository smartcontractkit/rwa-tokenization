import Link from 'next/link'
import Image from 'next/image'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function MainNav() {
  return (
    <div className="hidden space-x-4 md:flex">
      <Link
        rel="noreferrer"
        href={siteConfig.paths.architecture}
        className={cn(
          buttonVariants({ variant: 'default' }),
          'space-x-2 border-2 border-ring px-6 py-3 hover:bg-[#181D29] hover:border-[#375BD2]',
        )}
      >
        <Image src="/architecture.svg" width={18} height={18} alt="architecture" />
        <span className="text-base font-[450] leading-4 text-popover">
          {`Architecture`}
        </span>
      </Link>
      <Link
        rel="noreferrer"
        href={siteConfig.paths.design}
        className={cn(
          buttonVariants({ variant: 'default' }),
          'space-x-2 border-2 border-ring px-6 py-3 hover:bg-[#181D29] hover:border-[#375BD2]',
        )}
      >
        <Image src="/design.svg" width={18} height={18} alt="design" />
        <span className="text-base font-[450] leading-4 text-popover">
          {`Design`}
        </span>
      </Link>
      <Link
        rel="noreferrer"
        href={siteConfig.paths.search}
        className={cn(
          buttonVariants({ variant: 'default' }),
          'space-x-2 border-2 border-ring px-6 py-3 hover:bg-[#181D29] hover:border-[#375BD2]',
        )}
      >
        <Image src="/house.svg" width={18} height={18} alt="house" />
        <span className="text-base font-[450] leading-4 text-popover">
          {`Houses`}
        </span>
      </Link>
    </div>
  )
}
