import type { ProductsResponse, Product, AuthResponse } from '../types';

const API_BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async (
    query = '',
    category = '',
    limit = 20,
    skip = 0
): Promise<ProductsResponse> => {
    let url = `${API_BASE_URL}/products`;

    if (category && category !== 'all') {
        url = `${API_BASE_URL}/products/category/${category}`;
    } else if (query) {
        url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`;
    } else {
        url = `${url}?limit=${limit}&skip=${skip}`;
    }

    // If query & category are both provided, dummyjson doesn't natively combine them
    // perfectly via endpoint, so category wins and we'll do client side or basic search.
    // We'll stick to basic endpoints here.

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const fetchProductById = async (id: number | string): Promise<Product> => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
};

export const fetchCategories = async (): Promise<{ slug: string, name: string, url: string }[]> => {
    const res = await fetch(`${API_BASE_URL}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            password,
            expiresInMins: 60 * 24, // 1 day
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
    }

    return res.json();
};
