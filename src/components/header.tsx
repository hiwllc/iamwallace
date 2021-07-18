import Image from 'next/image'
import me from '../../public/images/me.jpg'

type Props = {
  size: number
}

export function Header({ size }: Props) {
  return (
    <header className="px-4 py-6 w-full">
      <div className="flex h-full items-center w-full max-w-2xl m-auto">
        <Image
          width={size}
          height={size}
          placeholder="blur"
          src={me}
          className="rounded-full"
          alt="Esse na foto sou eu, Wallace."
        />

        <div className="px-4">
          <h2 className="text-gray-600 font-black text-xl">Wallace Oliveira</h2>
          <em className="text-gray-600 text-sm">
            Coloco JavaScript em produção
          </em>
        </div>
      </div>
    </header>
  )
}
