import { MoveUpRightIcon } from 'lucide-preact'

type Props = {
  music: {
    artists: Array<{ name: string }>;
    background: string;
    cover: string;
    name: string;
    url: string;
  }
}

export function WidgetSpotify({ music }: Props) {
  return (
    <div className="fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full md:max-w-sm border-4 flex border-zinc-900 rounded-ss-lg rounded-se-lg md:rounded-lg overflow-hidden p-2 gap-6 bg-white shadow-solig">
      <img src={music.cover} alt={music.name} className="rounded-md size-28 h-full aspect-square shadow-lg" />

      <div className="min-w-44 leading-tight flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-md font-mono">{music.name}</h3>
          <p className="text-sm font-medium text-orange-500 font-mono">
            {music.artists.map(({ name }) => name).join(', ')}
          </p>
        </div>

        <a href={music.url} className="bg-orange-200 font-mono mt-auto w-fit inline-flex items-center gap-2 py-1 px-3 rounded-md text-xs font-medium hover:bg-orange-300">ouvir no spotify <MoveUpRightIcon class="size-4" /></a>
      </div>
    </div>
  )
}
