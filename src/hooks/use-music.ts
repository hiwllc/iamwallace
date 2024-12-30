import { useQuery } from "@tanstack/react-query";

type Music = {
  artists: Array<{ name: string }>;
  background: string;
  cover: string;
  name: string;
  url: string;
}

type Data = { success: false } | { success: true, music: Music }

export function useMusic() {
  const { data, status } = useQuery({
    queryKey: ['FETCH_SPOFITY'],
    queryFn: async () => {
      const result = await fetch(
							new URL(
								"/api/spotify",
								import.meta.env.DEV
									? "http://localhost:4321/"
									: "https://iamwallace.dev/",
							),
						);

      if (!result.ok) {
        console.log(result.status)
        throw new Error("Failed to fetch");
      }

      const data = await result.json() as Data

      if (!data.success) {
        console.log(result.status)
        throw new Error("Failed to fetch");
      }

      return data.music
    },
  })

  return {
    data,
    status,
  }
}
