import axios from 'axios'
import type {
  Product,
  ProductsResponse,
  Category,
  AuthResponse,
  LoginCredentials,
} from '@/types'

const BASE_URL = 'https://dummyjson.com'

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Inject auth token if present
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Products ───────────────────────────────────────────────────────────────

export const fetchProducts = (limit = 30, skip = 0): Promise<ProductsResponse> =>
  http.get<ProductsResponse>(`/products?limit=${limit}&skip=${skip}&select=id,title,price,discountPercentage,rating,stock,brand,category,thumbnail,tags`)
    .then((r) => r.data)

export const fetchProductById = (id: number): Promise<Product> =>
  http.get<Product>(`/products/${id}`).then((r) => r.data)

export const searchProducts = (query: string): Promise<ProductsResponse> =>
  http.get<ProductsResponse>(`/products/search?q=${encodeURIComponent(query)}`)
    .then((r) => r.data)

export const fetchProductsByCategory = (category: string): Promise<ProductsResponse> =>
  http.get<ProductsResponse>(`/products/category/${encodeURIComponent(category)}`)
    .then((r) => r.data)

export const fetchCategories = (): Promise<Category[]> =>
  http.get<Category[]>('/products/categories').then((r) => r.data)

// ── Auth ───────────────────────────────────────────────────────────────────

export const login = (credentials: LoginCredentials): Promise<AuthResponse> =>
  http.post<AuthResponse>('/auth/login', credentials).then((r) => r.data)

export const fetchCurrentUser = (): Promise<AuthResponse> =>
  http.get<AuthResponse>('/auth/me').then((r) => r.data)
