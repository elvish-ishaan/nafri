'use client'

import { Button } from '../button'
import { Cloud } from 'lucide-react'
import { landNavLinks } from '@/data/landingNavLinks'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const NavBar = ({ extraClasses }: { extraClasses?: string }) => {
  const router = useRouter()

  return (
    <div className={`flex justify-between items-center py-8 px-10 ${extraClasses} `}>
      <div>
        <Cloud className="size-8 hover:text-muted-foreground" />
      </div>
      <div className="flex gap-3">
        {landNavLinks.map((link) => (
          <Link
            className="hover:text-muted-foreground"
            key={link.id}
            href={link.path}
          >
            {link.title}
          </Link>
        ))}
      </div>
      <div>
        <Button onClick={() => router.push('/auth/sign-in')}>Sign In</Button>
      </div>
    </div>
  )
}

export default NavBar
