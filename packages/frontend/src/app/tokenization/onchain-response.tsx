import CodeBlock from '@/components/code-block'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  fetchHouse,
  fetchOnChainHouse,
  getCurrentPrice,
  getListPrice
} from '@/lib/fetch-house'
import { firaCode } from '@/lib/fonts'
import { cn } from '@/lib/utils'

type OnchainResponseProps = {
  tokenId: string
}

export const OnchainResponse = async ({
  tokenId,
}: OnchainResponseProps) => {
  const onchainData = await fetchOnChainHouse(tokenId)
  const offchainData = await fetchHouse(tokenId)

  const rawData = JSON.stringify(onchainData, null, 3)
  const listPrice = getListPrice(onchainData)
  const currentPrice = getCurrentPrice(offchainData)
  const needsUpdate = listPrice !== currentPrice

  return (
    <>
      <label className="text-base font-[550] text-card-foreground">
        Raw Data
      </label>
      <ScrollArea
        className={cn('mb-6 mt-2 h-[116px] rounded border-2', firaCode.variable)}
        >
        <CodeBlock codeString={rawData} />
      </ScrollArea>
        <div className="grid grid-cols-2 justify-center">
          <label className="flex justify-center py-2 text-base font-[550] text-card-foreground">
           Stored Price
          </label>
          <div className={`flex rounded border-2 ${needsUpdate ? `border-[#FF3131]` : `border-[#39FF14]`} bg-[#181D29] px-4 py-3 text-sm leading-4 text-muted-foreground justify-center`}>
            {Number(listPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
          </div>
        </div>
    </>
  )
}
