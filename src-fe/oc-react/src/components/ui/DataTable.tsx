import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Table, Input } from 'antd';
import type { TablePaginationConfig } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

export type DataTableColumn<T> = {
  title: string;
  dataIndex?: keyof T & string;
  key?: string;
  width?: number;
  sortable?: boolean;
  render?: (value: unknown, record: T, index: number) => ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: string | ((record: T) => string);
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSort?: (field: string, order: 'asc' | 'desc' | null) => void;
  onSearchChange?: (value: string) => void;
  toolbar?: ReactNode;
};

const matchRecord = <T extends object>(record: T, query: string): boolean => {
  if (!query) return true;
  const lower = query.toLowerCase();
  return Object.values(record).some((v) => {
    if (v == null) return false;
    return String(v).toLowerCase().includes(lower);
  });
};

export const DataTable = <T extends object>({
  columns,
  data,
  rowKey,
  loading,
  total,
  page,
  pageSize = 10,
  onPageChange,
  onSort,
  onSearchChange,
  toolbar,
}: DataTableProps<T>) => {
  const isServerSide = !!onSearchChange;
  const [searchText, setSearchText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const filteredData = useMemo(
    () =>
      isServerSide ? data : data.filter((r) => matchRecord(r, searchText)),
    [data, searchText, isServerSide],
  );

  const handleSearch = useCallback(
    (value: string, immediate?: boolean) => {
      setSearchText(value);
      if (!isServerSide) return;
      clearTimeout(debounceRef.current);
      if (immediate) {
        onSearchChange(value);
      } else {
        debounceRef.current = setTimeout(() => onSearchChange(value), 300);
      }
    },
    [isServerSide, onSearchChange],
  );

  const antColumns = useMemo(
    () =>
      columns.map((col) => ({
        title: col.title,
        dataIndex: col.dataIndex,
        key: col.key ?? String(col.dataIndex ?? ''),
        width: col.width,
        sorter: col.sortable,
        render: col.render,
      })),
    [columns],
  );

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters: Record<string, unknown>,
      sorter: SorterResult<T> | SorterResult<T>[],
    ) => {
      onPageChange?.(pagination.current ?? 1, pagination.pageSize ?? pageSize);
      if (onSort && !Array.isArray(sorter)) {
        const field = sorter.columnKey as string | undefined;
        const order =
          sorter.order === 'ascend'
            ? 'asc'
            : sorter.order === 'descend'
              ? 'desc'
              : null;
        if (field) onSort(field, order);
      }
    },
    [onPageChange, onSort, pageSize],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Input.Search
          allowClear
          placeholder="Search..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={(value) => handleSearch(value, true)}
          className="max-w-xs"
        />
        {toolbar}
      </div>
      <Table<T>
        columns={antColumns}
        dataSource={filteredData}
        rowKey={rowKey}
        loading={loading}
        onChange={handleTableChange}
        pagination={
          isServerSide
            ? {
                current: page ?? 1,
                pageSize,
                total,
                showSizeChanger: true,
                showTotal: (t) => `${t} items`,
              }
            : {
                pageSize,
                showSizeChanger: true,
                showTotal: (t) => `${t} items`,
              }
        }
        size="middle"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};
