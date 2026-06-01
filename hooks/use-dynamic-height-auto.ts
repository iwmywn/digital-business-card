import * as React from "react"

export function useDynamicHeightAuto() {
  const elementsRef = React.useRef<Set<HTMLElement>>(new Set())
  const [calculatedHeight, setCalculatedHeight] = React.useState<number>(0)

  const calculateHeight = React.useCallback(() => {
    let total = 0
    elementsRef.current.forEach((el) => {
      total += el.offsetHeight
    })
    setCalculatedHeight(total)
  }, [])

  const registerRef = React.useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        elementsRef.current.add(node)
        requestAnimationFrame(() => {
          calculateHeight()
        })
      } else {
        elementsRef.current.forEach((el) => {
          if (!document.body.contains(el)) {
            elementsRef.current.delete(el)
          }
        })
      }
    },
    [calculateHeight]
  )

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    calculateHeight()

    window.addEventListener("resize", calculateHeight)
    return () => {
      window.removeEventListener("resize", calculateHeight)
    }
  }, [calculateHeight])

  React.useEffect(() => {
    const observer = new ResizeObserver(calculateHeight)
    elementsRef.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [calculateHeight])

  return { registerRef, calculatedHeight }
}
