// ── API Response Types ─────────────────────────────────────────────────────

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
  tags: string[]
  sku: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: Review[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
  }
}

export interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface Category {
  slug: string
  name: string
  url: string
}

export interface AuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
  refreshToken: string
}

export interface LoginCredentials {
  username: string
  password: string
  expiresInMins?: number
}

// ── Store / UI Types ───────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
}

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export interface FilterState {
  category: string
  searchQuery: string
  sortBy: SortOption
  minPrice: number
  maxPrice: number
}

export type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'name-asc'

export interface ApiError {
  message: string
  status?: number
}
