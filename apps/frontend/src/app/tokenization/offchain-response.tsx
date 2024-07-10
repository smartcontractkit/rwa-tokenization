import CodeBlock from '@/components/code-block'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  fetchHouse,
  getCurrentPrice,
  getListPrice
} from '@/lib/fetch-house'
import { firaCode } from '@/lib/fonts'
import { cn } from '@/lib/utils'

type OffchainResponseProps = {
  tokenId: string
}

export const OffchainResponse = async ({
  tokenId,
}: OffchainResponseProps) => {
  const houseData = await fetchHouse(tokenId)

  // const rawData = houseData
  const rawData = JSON.stringify(houseData, null, 3)
  const latestPrice = getCurrentPrice(houseData)
  const parsedData = `${latestPrice}`

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
          Current Price
        </label>
        <div className="flex border-2 rounded bg-[#181D29] px-4 py-3 text-sm leading-4 text-muted-foreground justify-center">
          {Number(parsedData).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
        </div>
      </div>
    </>
  )
}
