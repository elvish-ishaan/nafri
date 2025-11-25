import { Sparkle } from 'lucide-react'
import React from 'react'

const Notch = () => {
  return (
    <div className=' rounded-lg  flex items-center justify-center'>
        <p className="flex gap-1 items-center text-center bg-zinc-600 text-sm text-slate-100 p-2 rounded-lg shadow-sm shadow-slate-400">
        <Sparkle className=' text-blue-600 size-5'/>Get Free 20 GB Of Storage</p>
    </div>
  )
}

export default Notch