import { useCallback, useMemo, useState } from 'react';
import { Checkbox, Modal, Spin, Table, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { ColumnsType } from 'antd/es/table';
import { usePermissionGroups } from '@/features';
import type { PermissionGroup } from '@/features';

const ACTION_ORDER = ['view', 'create', 'update', 'delete', 'import', 'export'];

type TableRow = {
  key: string;
  resource: string;
};

const PermissionModal = ({
  open,
  value,
  onSave,
  onClose,
}: {
  open: boolean;
  value: string[];
  onSave: (permissions: string[]) => void;
  onClose: () => void;
}) => {
  const { data: permGroups, isLoading } = usePermissionGroups();
  const [draft, setDraft] = useState<Set<string>>(() => new Set(value));

  const allPermissions = useMemo(
    () => permGroups?.flatMap((g) => g.permissions) ?? [],
    [permGroups],
  );

  const permMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of permGroups ?? []) {
      for (const p of g.permissions) {
        const action = p.split('.').pop();
        if (action) map.set(`${g.group}.${action}`, p);
      }
    }
    return map;
  }, [permGroups]);

  const allActions = useMemo(() => {
    const set = new Set<string>();
    for (const g of permGroups ?? []) {
      for (const p of g.permissions) {
        const action = p.split('.').pop();
        if (action) set.add(action);
      }
    }
    return ACTION_ORDER.filter((a) => set.has(a));
  }, [permGroups]);

  const allChecked = useMemo(
    () =>
      allPermissions.length > 0 && allPermissions.every((p) => draft.has(p)),
    [allPermissions, draft],
  );

  const someChecked = useMemo(
    () => allPermissions.some((p) => draft.has(p)),
    [allPermissions, draft],
  );

  const toggle = useCallback((perm: string, checked: boolean) => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (checked) next.add(perm);
      else next.delete(perm);
      return next;
    });
  }, []);

  const toggleResource = useCallback(
    (group: PermissionGroup, checked: boolean) => {
      setDraft((prev) => {
        const next = new Set(prev);
        for (const perm of group.permissions) {
          if (checked) next.add(perm);
          else next.delete(perm);
        }
        return next;
      });
    },
    [],
  );

  const toggleAll = useCallback(
    (checked: boolean) => {
      setDraft(new Set(checked ? allPermissions : []));
    },
    [allPermissions],
  );

  const handleOk = () => {
    onSave([...draft]);
    onClose();
  };

  const dataSource = useMemo(() => {
    if (!permGroups) return [];
    return permGroups.map((g) => ({ key: g.group, resource: g.group }));
  }, [permGroups]);

  const columns: ColumnsType<TableRow> = useMemo(() => {
    const resourceCol: ColumnsType<TableRow>[number] = {
      title: (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Checkbox
            checked={allChecked}
            indeterminate={!allChecked && someChecked}
            onChange={(e: CheckboxChangeEvent) => toggleAll(e.target.checked)}
          />
          <Typography.Text strong>Resource</Typography.Text>
        </div>
      ),
      dataIndex: 'resource',
      key: 'resource',
      width: 140,
      render: (name: string, record: TableRow) => {
        const group = permGroups?.find((g) => g.group === record.resource);
        if (!group) return <span>{name}</span>;
        const groupChecked = group.permissions.every((p) => draft.has(p));
        const groupIndeterminate =
          !groupChecked && group.permissions.some((p) => draft.has(p));
        return (
          <Checkbox
            checked={groupChecked}
            indeterminate={groupIndeterminate}
            onChange={(e: CheckboxChangeEvent) =>
              toggleResource(group, e.target.checked)
            }
          >
            <Typography.Text strong>{name}</Typography.Text>
          </Checkbox>
        );
      },
    };

    const actionCols = allActions.map((action) => ({
      title: <span className="text-xs capitalize">{action}</span>,
      key: `action_${action}`,
      width: 72,
      render: (_: unknown, record: TableRow) => {
        const perm = permMap.get(`${record.resource}.${action}`);
        if (!perm) return null;
        return (
          <div className="flex justify-center">
            <Checkbox
              checked={draft.has(perm)}
              onChange={(e: CheckboxChangeEvent) =>
                toggle(perm, e.target.checked)
              }
            />
          </div>
        );
      },
    }));

    return [resourceCol, ...actionCols];
  }, [
    allChecked,
    someChecked,
    toggleAll,
    allActions,
    permGroups,
    draft,
    toggleResource,
    toggle,
    permMap,
  ]);

  return (
    <Modal
      title="Select Permissions"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      width={700}
      destroyOnClose
    >
      {isLoading || !permGroups ? (
        <div className="flex justify-center items-center h-32">
          <Spin />
        </div>
      ) : (
        <Table<TableRow>
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
        />
      )}
    </Modal>
  );
};

export default PermissionModal;
