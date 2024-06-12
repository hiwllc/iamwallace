import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const result = await fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${import.meta.env.SPOTIFY_AUTH_KEY}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: import.meta.env.SPOTIFY_REFRESH_TOKEN
    })
  })

  const data = await result.json()

  const response = await fetch(`https://api.spotify.com/v1/me/player/currently-playing?market=BR`, {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    }
  })

  if (response.status !== 200) {
    return Response.json({
      success: false
    })
  }

  const music = await response.json()

  return Response.json({
    success: true,
    music: {
      artists: music.item.artists,
      background: music.item.album.images[0].url,
      cover: music.item.album.images[1].url,
      name: music.item.name,
      url: music.item.external_urls.spotify,
    }
  })
}
