export type Category = {
  id: string;
  name: string;
  description: string | null;
};

export type CategoryCreateRequest = {
  name: string;
  description: string | null;
};

export type CategoryUpdateRequest = CategoryCreateRequest;

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  categoryName: string;
};

export type ProductCreateRequest = {
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
};

export type ProductUpdateRequest = ProductCreateRequest;
