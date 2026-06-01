"use client"

import * as React from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    const listener = () => setMatches(media.matches)

    media.addEventListener("change", listener)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(media.matches)

    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}
