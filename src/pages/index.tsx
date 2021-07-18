import Image from 'next/image'
import me from '../../public/images/me.jpg'

const AVATAR_SIZE = 48

const IndexPage = () => {
  return (
    <>
      <header className="px-2 py-6 w-full">
        <div className="flex h-full items-center w-full max-w-4xl m-auto">
          <Image
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            placeholder="blur"
            src={me}
            className="rounded-full"
            alt="Esse na foto sou eu, Wallace."
          />

          <div className="px-4">
            <h2 className="text-gray-600 font-black text-xl">
              Wallace Oliveira
            </h2>
            <p className="text-gray-600">
              Olá, atualmente trabalho como desenvolvedor frontend
            </p>
          </div>
        </div>
      </header>

      {/* @TODO featured post */}
      {/* @TODO last five posts */}
      {/* @TODO list all posts */}
    </>
  )
}

export default IndexPage
