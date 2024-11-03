import SideBar from '@/components/ui/space/SideBar'
import { ReactNode } from 'react'

interface SidebarLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <div className="h-full overflow-y-aut">
            <SideBar/>
        </div>
      </aside>
      
      {/* Main content area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}