import { useCallback, useMemo, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Typography } from 'antd';
import { DataTable } from '@/components/ui';
import type { DataTableColumn } from '@/components/ui';
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/features';
import type { Product, ProductCreateRequest, ProductUpdateRequest } from '@/features';

type FormValues = {
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
};

const ProductListPage = () => {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm<FormValues>();

  const openCreate = useCallback(() => {
    setEditingProduct(null);
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const openEdit = useCallback(
    (product: Product) => {
      setEditingProduct(product);
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
      });
      setModalOpen(true);
    },
    [form],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  }, [form]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data: values as ProductUpdateRequest });
      } else {
        await createProduct(values as ProductCreateRequest);
      }
      closeModal();
    },
    [editingProduct, updateProduct, createProduct, closeModal],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProduct(id);
    },
    [deleteProduct],
  );

  const columns: DataTableColumn<Product>[] = useMemo(
    () => [
      { title: 'Name', dataIndex: 'name', sortable: true },
      { title: 'Description', dataIndex: 'description' },
      { title: 'Price', dataIndex: 'price', sortable: true, render: (v) => `$${(v as number).toFixed(2)}` },
      { title: 'Category', dataIndex: 'categoryName', sortable: true },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div className="flex gap-2">
            <Button size="small" onClick={() => openEdit(record)}>Edit</Button>
            <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(record.id)}>
              <Button size="small" danger>Delete</Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [openEdit, handleDelete],
  );

  const categoryOptions = useMemo(
    () => (categories ?? []).map((c) => ({ label: c.name, value: c.id })),
    [categories],
  );

  return (
    <div className="flex flex-col gap-4">
      <Typography.Title level={4}>Products</Typography.Title>

      <DataTable<Product>
        columns={columns}
        data={products ?? []}
        rowKey="id"
        loading={isLoading}
        toolbar={<Button type="primary" onClick={openCreate}>Add Product</Button>}
      />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        open={modalOpen}
        onOk={form.submit}
        onCancel={closeModal}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} precision={2} prefix="$" />
          </Form.Item>
          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
            <Select options={categoryOptions} placeholder="Select category" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductListPage;
