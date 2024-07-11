// import Image from 'next/image'
import UnderTheHood from '../tokenization/under-the-hood'

export default async function Architecture({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <main className={"container px-2"}>
      <div
        className={`flex flex-wrap justify-center w-full text-xl md:text-3xl font-bold`}
        style={{
          marginTop: '32px',
          marginBottom: '12px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          borderBottom: '8px solid #375BD2',
          borderTop: '8px solid #375BD2',
          // borderLeft: '8px solid #375BD2',
          // borderRight: '8px solid #375BD2',
          borderRadius: '21px',
          padding: '12px',
          color: '#D3D3D3',
          cursor: 'pointer',
          backgroundColor: '#181D29',
        }}
      >
        {`How We Structure Chainlink Functions`}
      </div>
      <div className="justify grid justify-center w-full font-medium"
        style={{
          // marginTop: '24px',
          marginBottom: '18px',
          textAlign: 'center',
          borderLeft: '8px solid #375BD2',
          borderRight: '8px solid #375BD2',
          borderRadius: '21px',
          padding: '32px',
          color: '#D3D3D3',
          cursor: 'pointer',
          backgroundColor: '#181D29',
        }}
      >
        {/* <iframe 
          src="https://docs.google.com/presentation/d/e/2PACX-1vRNp65Fyk5s_GdEZAJrqhCMWcNvuvm_YZBzFb-0GO5tzcA01UyLqhBZMDdcxjr7IsoI0nuJSehG9em6/embed?start=true&loop=true&delayms=60000" 

        >
          </iframe> */}
          <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQQ9LlxOwCDyy_lJkJhUrKFyKPAJat5G5nCYC7tpCF0Qbl-wWtToqfJnsqX9jMMjYryzM_l3AW5AwLZ/embed?start=false&loop=false&delayms=3000"
            width="1280" 
            height="839"
            className={
              `flex-grow-1 h-[336px] md:h-[839px]`
            }
            style={{
              display: 'flex',
              maxWidth: '100%',
              // maxHeight: '100%',
              padding: '0px',
              color: '#D3D3D3',
              cursor: 'pointer',
              backgroundColor: '#181D29',
          }}
          ></iframe>
      </div>
      {/* <UnderTheHood /> */}
    </main>
  )
}