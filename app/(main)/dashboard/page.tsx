import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'

const Page = () => {
  return (
    <section>
      <div className=' flex flex-col items-center gap-4  w-full'>
         <h1 className=' text-muted-foreground text-3xl'>Welcome To Next Cloud</h1>
         <div className=' flex justify-center gap-2 w-full'>
           <Input className=' w-1/2' placeholder='search in cloud'/>
           <Button><Search/></Button>
         </div>
      </div>
    </section>
  )
}

export default Page