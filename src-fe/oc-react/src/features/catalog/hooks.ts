import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/lib';
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

export const catalogKeys = {
  all: ['catalog'] as const,
  products: () => [...catalogKeys.all, 'products'] as const,
  product: (id: string) => [...catalogKeys.products(), id] as const,
  categories: () => [...catalogKeys.all, 'categories'] as const,
  category: (id: string) => [...catalogKeys.categories(), id] as const,
};

/* ───── Products ───── */

export const useProducts = () =>
  useQuery({ queryKey: catalogKeys.products(), queryFn: getProducts });

export const useProduct = (id: string) =>
  useQuery({ queryKey: catalogKeys.product(id), queryFn: () => getProduct(id), enabled: !!id });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.products() });
      showToast.success('Product created');
    },
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateProduct>[1] }) =>
      updateProduct(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.products() });
      showToast.success('Product updated');
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.products() });
      showToast.success('Product deleted');
    },
  });
};

/* ───── Categories ───── */

export const useCategories = () =>
  useQuery({ queryKey: catalogKeys.categories(), queryFn: getCategories });

export const useCategory = (id: string) =>
  useQuery({ queryKey: catalogKeys.category(id), queryFn: () => getCategory(id), enabled: !!id });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.categories() });
      showToast.success('Category created');
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateCategory>[1] }) =>
      updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.categories() });
      showToast.success('Category updated');
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.categories() });
      showToast.success('Category deleted');
    },
  });
};
