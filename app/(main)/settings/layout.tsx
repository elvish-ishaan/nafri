import SettingsNav from '@/components/ui/nav/SettingsNav'
import React from 'react'

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <section>
        <SettingsNav/>
        { children }
    </section>
  )
}

export default layout