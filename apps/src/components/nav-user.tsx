import {
  IconDotsVertical,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react"
import { useMemo } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

function getBaseDomain(hostname: string): string {
  if (!hostname) return "unknown"
  // IPv4 or localhost
  if (hostname === "localhost" || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return hostname
  }
  const parts = hostname.split(".")
  if (parts.length <= 2) return hostname
  const etlds = new Set([
    "co.uk",
    "com.au",
    "co.jp",
    "com.br",
    "co.in",
    "co.nz",
    "com.sg",
    "com.hk",
    "co.kr",
    "com.tr",
  ])
  const lastTwo = parts.slice(-2).join(".")
  const lastThree = parts.slice(-3).join(".")
  if (etlds.has(lastTwo)) return lastThree
  return lastTwo
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  const baseDomain = useMemo(() => {
    if (typeof window === "undefined") return "unknown"
    return getBaseDomain(window.location.hostname)
  }, [])

  const withUtm = (url: string) => {
    try {
      const u = new URL(url)
      u.searchParams.set("utm_source", baseDomain)
      return u.toString()
    } catch {
      return url
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">LN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Author
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href={withUtm("https://github.com/vinhloc30796")} target="_blank" rel="noopener noreferrer">
                  <IconBrandGithub />
                  GitHub
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={withUtm("https://linkedin.com/in/vinhloc30796")} target="_blank" rel="noopener noreferrer">
                  <IconBrandLinkedin />
                  LinkedIn
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={withUtm("https://x.com/vl307")} target="_blank" rel="noopener noreferrer">
                  <IconBrandX />
                  X
                </a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
