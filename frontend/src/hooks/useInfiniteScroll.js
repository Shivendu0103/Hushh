import { useState, useEffect, useCallback } from 'react'
import { useIntersection } from './useIntersection'

const useInfiniteScroll = ({
  fetchMore,
  hasMore = true,
  threshold = 1.0,
  rootMargin = '100px'
} = {}) => {
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState(null)

  // Create intersection observer for the sentinel element
  const [sentinelRef, isIntersecting] = useIntersection({
    threshold,
    rootMargin
  })

  // Fetch more data when sentinel is visible
  useEffect(() => {
    if (isIntersecting && hasMore && !isFetching && fetchMore) {
      setIsFetching(true)
      setError(null)

      fetchMore()
        .then(() => {
          setIsFetching(false)
        })
        .catch((err) => {
          setError(err)
          setIsFetching(false)
        })
    }
  }, [isIntersecting, hasMore, isFetching, fetchMore])

  // Manual trigger for refresh
  const refresh = useCallback(() => {
    if (fetchMore && !isFetching) {
      setIsFetching(true)
      setError(null)
      return fetchMore().finally(() => setIsFetching(false))
    }
  }, [fetchMore, isFetching])

  return {
    sentinelRef,
    isFetching,
    error,
    refresh
  }
}

export default useInfiniteScroll
