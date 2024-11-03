"use client"
import { signIn, useSession } from 'next-auth/react'
import { Button } from '../button'

const NavBar = ({extraClasses}: {extraClasses?: string}) => {
  const {data} = useSession()
  console.log(data?.user,'this is client session data')
  return (
    <div className={`flex justify-between py-8 px-10 ${extraClasses} `}>
        <div>logo</div>
        <div>links</div>
        <div>
          <Button onClick={() => signIn()}>Sign In</Button>
        </div>
    </div>
  )
}

export default NavBar