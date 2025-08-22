import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import Button from '@/components/ui/button'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
    return (
        <html lang="en" className={inter.className}>
            <body className='flex flex-col gap-4 my-4 justify-center items-center'>
                <h1>404 - Page Not Found</h1>
                <p>This page does not exist.</p>
                <Link href="/" passHref><Button asChild><p>Go Home</p></Button></Link>
            </body>
        </html>
    )
}