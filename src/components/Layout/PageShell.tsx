import type { ReactNode } from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

type PageShellProps = {
  children: ReactNode
  className?: string
}

export default function PageShell({ children, className }: PageShellProps) {
  const rootClassName = ['min-h-screen px-6 py-12 sm:px-10', className]
    .filter(Boolean)
    .join(' ')

  return (
    <main className={rootClassName}>
      <Header />
      {children}
      <Footer />
    </main>
  )
}
