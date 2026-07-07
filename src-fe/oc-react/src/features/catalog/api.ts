import { api } from '@/api';
import type { ApiResponse } from '@/types';
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
} from './types';

/* ───── Products ───── */

export const getProducts = () =>
  api
    .get<ApiResponse<Product[]>>('/api/v1/catalog/products')
    .then((r) => r.data.data!);

export const getProduct = (id: string) =>
  api
    .get<ApiResponse<Product>>(`/api/v1/catalog/products/${id}`)
    .then((r) => r.data.data!);

export const createProduct = (data: ProductCreateRequest) =>
  api
    .post<ApiResponse<Product>>('/api/v1/catalog/products', data)
    .then((r) => r.data.data!);

export const updateProduct = (id: string, data: ProductUpdateRequest) =>
  api.put(`/api/v1/catalog/products/${id}`, data);

export const deleteProduct = (id: string) =>
  api.delete(`/api/v1/catalog/products/${id}`);

/* ───── Categories ───── */

export const getCategories = () =>
  api
    .get<ApiResponse<Category[]>>('/api/v1/catalog/categories')
    .then((r) => r.data.data!);

export const getCategory = (id: string) =>
  api
    .get<ApiResponse<Category>>(`/api/v1/catalog/categories/${id}`)
    .then((r) => r.data.data!);

export const createCategory = (data: CategoryCreateRequest) =>
  api
    .post<ApiResponse<Category>>('/api/v1/catalog/categories', data)
    .then((r) => r.data.data!);

export const updateCategory = (id: string, data: CategoryUpdateRequest) =>
  api.put(`/api/v1/catalog/categories/${id}`, data);

export const deleteCategory = (id: string) =>
  api.delete(`/api/v1/catalog/categories/${id}`);
