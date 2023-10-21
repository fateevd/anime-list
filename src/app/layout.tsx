"use client";


import './globals.css'
import type {Metadata} from 'next'
import GraphProvider from "@/graphql/GraphProvider";
import Script from 'next/script';


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}


export default async function RootLayout({children}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
    <>
      <body>
      <GraphProvider>{children}</GraphProvider>
      </body>
    </>
    </html>
  )
}
