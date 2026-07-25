export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  reviews?: { rating: number, comment: string, date: string, reviewerName: string, reviewerEmail: string }[]
  availabilityStatus?: string
  shippingInformation?: string
  returnPolicy?: string
  warrantyInformation?: string
  weight?: number
  dimensions?: { width: number, height: number, depth: number }
  sku?: string
  tags?: string[]
}

export interface PaginatedResponse<T> {
  products: T[]
  total: number
  skip: number
  limit: number
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface CartLine {
  productId: number
  quantity: number
}

export interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc'

export interface FilterState {
  sortBy: SortOption
  minPrice: number
  maxPrice: number
}
