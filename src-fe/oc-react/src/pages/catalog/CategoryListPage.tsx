import { useCallback, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Typography } from 'antd';
import { DataTable } from '@/components/ui';
import type { DataTableColumn } from '@/components/ui';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features';
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from '@/features';

type FormValues = {
  name: string;
  description: string | null;
};

const CategoryListPage = () => {
  const { data: categories, isLoading } = useCategories();
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm<FormValues>();

  const openCreate = useCallback(() => {
    setEditingCategory(null);
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const openEdit = useCallback(
    (category: Category) => {
      setEditingCategory(category);
      form.setFieldsValue({
        name: category.name,
        description: category.description,
      });
      setModalOpen(true);
    },
    [form],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  }, [form]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: values as CategoryUpdateRequest,
        });
      } else {
        await createCategory(values as CategoryCreateRequest);
      }
      closeModal();
    },
    [editingCategory, updateCategory, createCategory, closeModal],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteCategory(id);
    },
    [deleteCategory],
  );

  const columns: DataTableColumn<Category>[] = useMemo(
    () => [
      { title: 'Name', dataIndex: 'name', sortable: true },
      { title: 'Description', dataIndex: 'description' },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div className="flex gap-2">
            <Button size="small" onClick={() => openEdit(record)}>
              Edit
            </Button>
            <Popconfirm
              title="Delete this category?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [openEdit, handleDelete],
  );

  return (
    <div className="flex flex-col gap-4">
      <Typography.Title level={4}>Categories</Typography.Title>

      <DataTable<Category>
        columns={columns}
        data={categories ?? []}
        rowKey="id"
        loading={isLoading}
        toolbar={
          <Button type="primary" onClick={openCreate}>
            Add Category
          </Button>
        }
      />

      <Modal
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        open={modalOpen}
        onOk={form.submit}
        onCancel={closeModal}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryListPage;
