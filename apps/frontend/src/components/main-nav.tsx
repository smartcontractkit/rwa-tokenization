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
        {/* <Image src="/github.svg" width={16} height={16} alt="github" /> */}
        <span className="text-base font-[450] leading-4 text-popover">
          { `Architecture` }
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
        {/* <Image src="/github.svg" width={16} height={16} alt="github" /> */}
        <span className="text-base font-[450] leading-4 text-popover">
          { `Design` }
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
        {/* <Image src="/github.svg" width={16} height={16} alt="github" /> */}
        <span className="text-base font-[450] leading-4 text-popover">
          { `Houses` }
        </span>
      </Link>
      <Link
        target="_blank"
        rel="noreferrer"
        href={siteConfig.links.docs}
        className={cn(
          buttonVariants({ variant: 'default' }),
          'space-x-2 border-2 border-ring px-6 py-3 hover:bg-[#181D29] hover:border-[#375BD2]',
        )}
      >
        <Image src="/docs.svg" width={16} height={16} alt="docs" />
        <span className="text-base font-[450] leading-4 text-popover">
          { `Functions Architecture` }
        </span>
      </Link>
    </div>
  )
}
