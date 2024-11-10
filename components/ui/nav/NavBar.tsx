"use client"
import { signIn } from 'next-auth/react'
import { Button } from '../button'

const NavBar = ({extraClasses}: {extraClasses?: string}) => {
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