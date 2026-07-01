import type { NavigationMenuItem } from '@nuxt/ui';
export type SidebarItem = NavigationMenuItem & {
  roles?: string[]
}