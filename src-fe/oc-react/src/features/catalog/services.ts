import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getCategories,
  getCategory,
  getProduct,
  getProducts,
  updateCategory,
  updateProduct,
} from './api';
import type {
  CategoryCreateRequest,
  CategoryUpdateRequest,
  ProductCreateRequest,
  ProductUpdateRequest,
} from './types';

export const productService = {
  getAll: () => getProducts(),
  getById: (id: string) => getProduct(id),
  create: (data: ProductCreateRequest) => createProduct(data),
  update: (id: string, data: ProductUpdateRequest) => updateProduct(id, data),
  remove: (id: string) => deleteProduct(id),
};

export const categoryService = {
  getAll: () => getCategories(),
  getById: (id: string) => getCategory(id),
  create: (data: CategoryCreateRequest) => createCategory(data),
  update: (id: string, data: CategoryUpdateRequest) => updateCategory(id, data),
  remove: (id: string) => deleteCategory(id),
};
