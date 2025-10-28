import { IconDownload, IconMail, type Icon } from "@tabler/icons-react"
import { Link } from '@tanstack/react-router'

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const contactEmail = "vinhloc30796@gmail.com"
  const contactSubject = "m0_tollfinder Contact"
  const contactBody =
    "Hi Vinh Loc,\n\nI'm reaching out regarding m0_tollfinder.\n\n" +
    "Context: <briefly describe your project/use case>.\n" +
    "Questions: <list any specific questions>.\n\n" +
    "Thanks,\n<Your name>"

  const contactHref = `mailto:${contactEmail}?subject=${encodeURIComponent(
    contactSubject,
  )}&body=${encodeURIComponent(contactBody)}`
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Export CSV"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => window.dispatchEvent(new CustomEvent('export-csv'))}
              disabled
            >
              <IconDownload />
              <span>Export CSV</span>
            </SidebarMenuButton>
            <Button
              asChild
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <a href={contactHref}>
                <IconMail />
                <span className="sr-only">Contact</span>
              </a>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
