export {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  getCategories, getCategory, createCategory, updateCategory, deleteCategory,
} from './api';
export {
  useProducts, useProduct, useCreateProduct, useUpdateProduct, useDeleteProduct,
  useCategories, useCategory, useCreateCategory, useUpdateCategory, useDeleteCategory,
  catalogKeys,
} from './hooks';
export type {
  Product, ProductCreateRequest, ProductUpdateRequest,
  Category, CategoryCreateRequest, CategoryUpdateRequest,
} from './types';
