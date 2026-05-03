import { ref } from 'vue'
import {
  fetchProducts,
  searchProducts,
  fetchProductsByCategory,
  fetchCategories,
} from '@/services/api'
import type { Product, Category, FilterState } from '@/types'

export function useProducts() {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  async function loadProducts() {
    loading.value = true
    error.value = null
    try {
      const data = await fetchProducts(100)
      products.value = data.products
      total.value = data.total
    } catch {
      error.value = 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  async function loadCategories() {
    try {
      categories.value = await fetchCategories()
    } catch {
      categories.value = []
    }
  }

  async function searchAndFilter(filters: FilterState) {
    loading.value = true
    error.value = null
    try {
      let data
      if (filters.searchQuery.trim()) {
        data = await searchProducts(filters.searchQuery)
      } else if (filters.category && filters.category !== 'all') {
        data = await fetchProductsByCategory(filters.category)
      } else {
        data = await fetchProducts(100)
      }

      let results = data.products

      // Price filter
      results = results.filter(
        (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
      )

      // Sort
      switch (filters.sortBy) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          results.sort((a, b) => b.price - a.price)
          break
        case 'rating-desc':
          results.sort((a, b) => b.rating - a.rating)
          break
        case 'name-asc':
          results.sort((a, b) => a.title.localeCompare(b.title))
          break
      }

      products.value = results
      total.value = results.length
    } catch {
      error.value = 'Failed to filter products'
    } finally {
      loading.value = false
    }
  }

  return { products, categories, loading, error, total, loadProducts, loadCategories, searchAndFilter }
}
