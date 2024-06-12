import type { ReactNode } from 'react'
import { MoveUpRightIcon } from 'lucide-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMusic } from '../hooks/use-music';

type Props = {
  music: {
    artists: Array<{ name: string }>;
    background: string;
    cover: string;
    name: string;
    url: string;
  },
  children: ReactNode
}

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: 'always',
    }
  }
})

function AppProvider({ children }: Omit<Props, 'music'>) {
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}

export function Widget() {
  const { data, status } = useMusic()

  if (status !== 'success' || !data) {
    return null
  }

  return (
    <div className="fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full md:max-w-sm border-4 flex border-zinc-900 rounded-ss-lg rounded-se-lg md:rounded-lg overflow-hidden p-2 gap-6 bg-white shadow-solig">
      <img src={data.cover} alt={data.name} className="rounded-md size-28 h-full aspect-square shadow-lg" />

      <div className="min-w-44 leading-tight flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-md font-mono">{data.name}</h3>
          <p className="text-sm font-medium text-orange-500 font-mono">
            {data.artists.map(({ name }) => name).join(', ')}
          </p>
        </div>

        <a href={data.url} className="bg-orange-200 font-mono mt-auto w-fit inline-flex items-center gap-2 py-1 px-3 rounded-md text-xs font-medium hover:bg-orange-300">ouvir no spotify <MoveUpRightIcon className="size-4" /></a>
      </div>
    </div>
  )
}

export function WidgetSpotify() {
  return (
    <AppProvider>
      <Widget />
    </AppProvider>
  )
}
