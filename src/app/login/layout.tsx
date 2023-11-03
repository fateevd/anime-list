import type {Metadata} from 'next'
import GraphProvider from "@/graphql/GraphProvider";


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
      {/*//TODO: Сделать нормальный компонент*/}
      <main className="h-[100vh] w-full">
        <GraphProvider>{children}</GraphProvider>
      </main>
      </body>
    </>
    </html>
  )
}