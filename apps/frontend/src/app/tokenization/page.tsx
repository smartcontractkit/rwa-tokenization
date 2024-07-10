import UnderTheHood from './under-the-hood'
import Image from 'next/image'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/loading-spinner'
// import History from './history'
import { OffchainResponse } from './offchain-response'
import { TokenInput } from '@/components/token-input'

export default async function Tokenization({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const tokenId = searchParams['tokenId'] as string

  // let tokenId: string | undefined

  return (
    <main className="container px-6 md:px-10">
      <div className="grid gap-10 border-b border-b-border py-10 md:grid-cols-[1fr_4px_1fr_4px_1fr]">
        {!tokenId && (
          <>
            <div>
              <h2 className="mb-4 text-2xl font-medium tracking-[-0.24px] md:mb-8 md:text-[32px] md:leading-[42px] md:tracking-[-0.64px]">
                Tokenize Real Estate with Chainlink Functions
              </h2>
              <p className="text-base text-muted-foreground md:text-xl">
                Perform custom computation off-chain using Web2 data in your
                smart contract.
              </p>
            </div>
            <div />
          </>
        )}
        <div>
          <label className="text-base font-[550] text-card-foreground">
            Token ID
          </label>
          <TokenInput />
        </div>
        {tokenId && (
          <>
            <div className="flex h-[13px] items-start md:hidden">
              <div className="mr-[-1px] grow border-t border-t-border" />
              <div className="h-[13px] w-[26px] shrink-0">
                <Image
                  src="/angle.svg"
                  width={13}
                  height={26}
                  alt="angle"
                  className="translate-x-[6px] translate-y-[-9px] rotate-90"
                />
              </div>
              <div className="ml-[-1px] grow border-t border-t-border" />
            </div>
            <div className="hidden w-[13px] flex-col md:flex">
              <div className="mb-[-2px] grow border-l border-l-border" />
              <Image
                src="/angle.svg"
                width={13}
                height={26}
                alt="angle"
                className="shrink-0 -translate-x-px"
              />
              <div className="mt-[-2px] grow border-l border-l-border" />
            </div>
            <div>
              <div className="mb-7 flex items-center space-x-2">
                <Image src="/code.svg" width={20} height={20} alt="globe" />
                <h3 className="text-2xl font-medium tracking-[-0.24px]">
                  Offchain Data
                </h3>
              </div>
              <Suspense
                key={`offchain-${tokenId}`}
                fallback={
                  <div className="flex h-[252px] flex-col items-center justify-center space-y-2 rounded bg-[#181D29]">
                    <LoadingSpinner />
                    <span className="text-sm font-[450] text-card-foreground">
                      Data currently loading...
                    </span>
                  </div>
                }
              >
                <OffchainResponse tokenId={tokenId} />
              </Suspense>
            </div>
            <div className="flex h-[13px] items-start md:hidden">
              <div className="mr-[-1px] grow border-t border-t-border" />
              <div className="h-[13px] w-[26px] shrink-0">
                <Image
                  src="/angle.svg"
                  width={13}
                  height={26}
                  alt="angle"
                  className="translate-x-[6px] translate-y-[-9px] rotate-90"
                />
              </div>
              <div className="ml-[-1px] grow border-t border-t-border" />
            </div>
            <div className="hidden w-[13px] flex-col md:flex">
              <div className="mb-[-2px] grow border-l border-l-border" />
              <Image
                src="/angle.svg"
                width={13}
                height={26}
                alt="angle"
                className="shrink-0 -translate-x-px"
              />
              <div className="mt-[-2px] grow border-l border-l-border" />
            </div>
          </>
        )}
      </div>
      <UnderTheHood />
    </main>
  )
}
