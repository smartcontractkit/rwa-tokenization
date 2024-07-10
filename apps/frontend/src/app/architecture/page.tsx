import Image from 'next/image'
import { ArchitectureButton } from '@/components/architecture-button'

export default async function Architecture({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <main className={"container px-2"}>
      <div className="justify grid justify-center w-full font-medium"
        style={{
          marginTop: '24px',
          marginBottom: '32px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          border: '2px solid #D3D3D3',
          borderRadius: '8px',
          padding: '16px',
          color: '#D3D3D3',
          cursor: 'pointer',
          backgroundColor: '#181D29',
          borderBottom: '2px solid #D3D3D3',
        }}
      >
          <Image
            src="/how-it-works.png"
            width={1926}
            height={1318}
            alt="how-it-works"
            className="mb-4 rounded-lg border border-border justify-center"
          />
        <ArchitectureButton />

          </div>
    </main>
  )
}
