import { currentProfile } from '@/lib/current-pofile'
import db from '@/lib/db'
import { redirect } from 'next/navigation'
import NavigationAction from './navigation-action'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { NavigationItem } from './navigation-item'
import { ModeToggle } from '../mode-toggle'
import { UserButton } from '@clerk/nextjs'

const NavigationSidebar = async () => {
  const profile = await currentProfile()
  if (!profile) {
    return redirect('/')
  }
  const server = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })
  return (
    <div className="flex flex-col space-y-4 py-2 items-center h-full text-primary w-full bg-gray-200 dark:bg-[#1e1f22]">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {server.map(server => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]',
            },
          }}
        />
      </div>
    </div>
  )
}

export default NavigationSidebar
