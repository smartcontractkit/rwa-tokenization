import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";

export function Footer() {
    let numCols = 3;

    return (
        <footer className={`container grid grid-cols-${2} gap-2 px-6 py-2 md:px-0`}>
            <Link
                target="_blank"
                rel="noreferrer"
                href={siteConfig.links.github}
                className={cn(
                    buttonVariants({ variant: 'default' }),
                    'space-x-2 border-2 border-ring px-6 py-3 hover:bg-[#181D29] hover:border-[#375BD2]',
                )}
            >
                <Image src="/github.svg" width={16} height={16} alt="github" />
                <span className="text-base font-[450] md:font-[650] leading-4 text-popover">
                    GitHub
                </span>
            </Link>
            <Link
                target="_blank"
                rel="noreferrer"
                href={siteConfig.links.remixCode}
                className={cn(
                    buttonVariants({ variant: 'default' }),
                    'space-x-2 border-2 border-ring px-6 py-3 hover:bg-[#181D29] hover:border-[#375BD2]',
                )}
            >
                <Image 
                    src="/remix.png" 
                    width={16} height={16} alt="remix" />
                <span className="text-base font-[450] md:font-[650] leading-4 text-popover">
                    Remix
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
                <span className="text-base font-[450] md:font-[650] leading-4 text-popover">
                    Resources
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
                {/* @buns: update image */}
                <Image src="/faucet.svg" width={16} height={16} alt="docs" />
                <span className="text-base font-[450] md:font-[650] leading-4 text-popover">
                    Faucet
                </span>
            </Link>
        </footer>
    )
}