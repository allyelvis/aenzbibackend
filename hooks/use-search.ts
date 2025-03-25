"use client"

import { useState, useEffect, useCallback } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { apiClient } from "@/lib/api-client"

export type SearchResult = {
  id: string
  title: string
  description: string
  type: "customer" | "product" | "order" | "invoice"
  url: string
}

export function useSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 300)

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { results } = await apiClient.get(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      setResults(results || [])
    } catch (err) {
      console.error("Error searching:", err)
      setError("Failed to perform search")
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    search(debouncedQuery)
  }, [debouncedQuery, search])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
  }
}

