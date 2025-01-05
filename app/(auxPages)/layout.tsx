import NavBar from '@/components/ui/nav/NavBar'
import { getServerSession } from 'next-auth'
import React, { ReactNode } from 'react'

const Layout = async ({children}:{children: ReactNode}) => {
  //show navbar only if user is logged out
  const session = await getServerSession()
  return (
    <section>
        {
          !session?.user && <NavBar/>
        }
        {children}
    </section>
  )
}

export default Layout