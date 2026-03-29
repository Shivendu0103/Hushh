import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "../animate-ui/components/radix/sidebar"
import { Home, MessageCircle, User, Settings } from "lucide-react"

const navItems = [
  { path: '/', icon: Home, label: 'Feed' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' }
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/10 glass">
      <SidebarHeader className="h-16 flex items-center px-6">
        <h1 className="text-2xl font-black neon-text">Hushh ✨</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild className="text-gray-300 hover:text-white hover:bg-white/10">
                    <a href={item.path}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
