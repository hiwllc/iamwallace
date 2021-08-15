import Link from 'next/link'

export function Header() {
  return (
    <header className="px-4 py-6 w-full">
      <div className="h-full w-full max-w-2xl m-auto">
        <Link href="/">
          <a className="flex items-center">
            <div className="">
              <h2 className="text-gray-600 font-black text-xl leading-none">
                Wallace Oliveira
              </h2>
              <em className="text-pink-400 text-sm">
                Coloco JavaScript em produção
              </em>
            </div>
          </a>
        </Link>
      </div>
    </header>
  )
}
