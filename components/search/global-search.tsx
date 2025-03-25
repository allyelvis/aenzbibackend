"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, User, Package, ShoppingCart, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useDebounce } from "@/hooks/use-debounce"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

type SearchResult = {
  id: string
  title: string
  description: string
  type: "customer" | "product" | "order" | "invoice"
  url: string
}

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Search when query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const { results } = await apiClient.get(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        setResults(results || [])
      } catch (error) {
        console.error("Error searching:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    router.push(result.url)
  }

  // Get icon based on result type
  const getIcon = (type: string) => {
    switch (type) {
      case "customer":
        return <User className="h-4 w-4 mr-2" />
      case "product":
        return <Package className="h-4 w-4 mr-2" />
      case "order":
        return <ShoppingCart className="h-4 w-4 mr-2" />
      case "invoice":
        return <FileText className="h-4 w-4 mr-2" />
      default:
        return null
    }
  }

  return (
    <>
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search... (⌘K)"
          className="w-full pl-8 bg-background"
          onClick={() => setOpen(true)}
          onFocus={() => setOpen(true)}
        />
        {inputRef.current?.value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = ""
              }
              setQuery("")
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search customers, products, orders..." value={query} onValueChange={setQuery} />
        <CommandList>
          {loading && (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          )}
          <CommandEmpty>{!loading && "No results found."}</CommandEmpty>
          {results.length > 0 && !loading && (
            <>
              <CommandGroup heading="Customers">
                {results
                  .filter((result) => result.type === "customer")
                  .map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      {getIcon(result.type)}
                      <div>
                        <div>{result.title}</div>
                        <div className="text-xs text-muted-foreground">{result.description}</div>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Products">
                {results
                  .filter((result) => result.type === "product")
                  .map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      {getIcon(result.type)}
                      <div>
                        <div>{result.title}</div>
                        <div className="text-xs text-muted-foreground">{result.description}</div>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Orders">
                {results
                  .filter((result) => result.type === "order")
                  .map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      {getIcon(result.type)}
                      <div>
                        <div>{result.title}</div>
                        <div className="text-xs text-muted-foreground">{result.description}</div>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

