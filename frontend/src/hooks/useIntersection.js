import { useState, useEffect, useRef } from 'react'

const useIntersection = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState(null)
  const ref = useRef()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
      setEntry(entry)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options])

  return [ref, isIntersecting, entry]
}

export default useIntersection
