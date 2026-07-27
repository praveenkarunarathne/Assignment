import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, PaginatedResponse, FilterState } from '../types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const categories = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const filterState = ref<FilterState>({
    sortBy: 'default',
    minPrice: 0,
    maxPrice: 10000,
  })

  const filteredProducts = computed(() => {
    let result = products.value

    if (selectedCategory.value) {
      result = result.filter(p => p.category === selectedCategory.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      )
    }

    // Apply price filter
    result = result.filter(
      p => p.price >= filterState.value.minPrice && p.price <= filterState.value.maxPrice
    )

    // Apply sorting
    const sorted = [...result]
    switch (filterState.value.sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        // default order
        break
    }
    
    return sorted
  })

  async function fetchAll() {
    if (products.value.length > 0) return
    loading.value = true
    error.value = null
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('https://dummyjson.com/products?limit=0'),
        fetch('https://dummyjson.com/products/category-list'),
      ])

      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch products')
      }

      const productsData: PaginatedResponse<Product> = await productsRes.json()
      
    
      // Curate for a luxury aesthetic by restricting to a specific niche (Menswear)
      const allowedCategories = ['mens-shirts', 'mens-shoes', 'mens-watches']
      products.value = productsData.products.filter((p: Product) => 
        allowedCategories.includes(p.category)
      )

      const categoriesData: string[] = await categoriesRes.json()
      categories.value = categoriesData.filter((c: string) => 
        allowedCategories.includes(c)
      )
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function setSearch(query: string) {
    searchQuery.value = query
  }

  function setCategory(category: string) {
    selectedCategory.value = category
  }

  function getProductById(id: number): Product | undefined {
    return products.value.find(p => p.id === id)
  }

  return {
    products,
    categories,
    loading,
    error,
    searchQuery,
    selectedCategory,
    filterState,
    filteredProducts,
    fetchAll,
    setSearch,
    setCategory,
    getProductById,
  }
})
