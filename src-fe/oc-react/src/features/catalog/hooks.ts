import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/lib';
import { productService, categoryService } from './services';

export const catalogKeys = {
  all: ['catalog'] as const,
  products: () => [...catalogKeys.all, 'products'] as const,
  product: (id: string) => [...catalogKeys.products(), id] as const,
  categories: () => [...catalogKeys.all, 'categories'] as const,
  category: (id: string) => [...catalogKeys.categories(), id] as const,
};

/* ───── Products ───── */

export const useProducts = () =>
  useQuery({
    queryKey: catalogKeys.products(),
    queryFn: productService.getAll,
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: catalogKeys.product(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.products() });
      showToast.success('Product created');
    },
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof productService.update>[1];
    }) => productService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.products() });
      showToast.success('Product updated');
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.products() });
      showToast.success('Product deleted');
    },
  });
};

/* ───── Categories ───── */

export const useCategories = () =>
  useQuery({
    queryKey: catalogKeys.categories(),
    queryFn: categoryService.getAll,
  });

export const useCategory = (id: string) =>
  useQuery({
    queryKey: catalogKeys.category(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.categories() });
      showToast.success('Category created');
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof categoryService.update>[1];
    }) => categoryService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.categories() });
      showToast.success('Category updated');
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: catalogKeys.categories() });
      showToast.success('Category deleted');
    },
  });
};
