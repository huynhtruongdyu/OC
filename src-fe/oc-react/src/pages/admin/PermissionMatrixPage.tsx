import { api } from '@/api';
import type { ApiResponse } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Select, Segmented, Spin, Table, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { ColumnsType } from 'antd/es/table';
import { useQueryClient } from '@tanstack/react-query';
import { useRoles, usePermissionGroups, useUpdateRolePermissions, useUsers, useUpdateUserPermissions, adminKeys } from '@/features';

const ACTION_ORDER = ['view', 'create', 'update', 'delete', 'import', 'export'];

type Mode = 'roles' | 'users';

type TableRow = {
  key: string;
  resource: string;
};

const PermissionMatrixPage = () => {
  const [mode, setMode] = useState<Mode>('roles');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data: roles } = useRoles();
  const { data: users } = useUsers();
  const { data: permGroups } = usePermissionGroups();
  const { mutateAsync: updateRolePerms } = useUpdateRolePermissions();
  const { mutateAsync: updateUserPerms } = useUpdateUserPermissions();

  const selectOptions = useMemo(
    () => (mode === 'roles' ? roles : users)?.map((e) => ({ label: 'name' in e ? e.name : e.userName, value: e.id })) ?? [],
    [mode, roles, users],
  );

  const [perms, setPerms] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  useEffect(() => {
    if (!hasAutoSelected && selectOptions.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedId(selectOptions[0].value);
      setHasAutoSelected(true);
    }
  }, [selectOptions, hasAutoSelected]);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api.get<ApiResponse<string[]>>(`/api/v1/admin/${mode}/${selectedId}/permissions`)
      .then((r) => { if (!cancelled) setPerms(new Set(r.data.data ?? [])); })
      .catch(() => { if (!cancelled) setPerms(new Set()); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selectedId, mode]);

  const allPermissions = useMemo(
    () => permGroups?.flatMap((g) => g.permissions) ?? [],
    [permGroups],
  );

  const permLookup = useMemo(() => {
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
    () => allPermissions.length > 0 && allPermissions.every((p) => perms.has(p)),
    [allPermissions, perms],
  );

  const someChecked = useMemo(
    () => allPermissions.some((p) => perms.has(p)),
    [allPermissions, perms],
  );

  const toggle = useCallback((perm: string, checked: boolean) => {
    setPerms((prev) => { const n = new Set(prev); if (checked) n.add(perm); else n.delete(perm); return n; });
    setDirty(true);
  }, []);

  const toggleResource = useCallback((group: { permissions: string[] }, checked: boolean) => {
    setPerms((prev) => {
      const n = new Set(prev);
      for (const perm of group.permissions) {
        if (checked) n.add(perm);
        else n.delete(perm);
      }
      return n;
    });
    setDirty(true);
  }, []);

  const toggleAll = useCallback((checked: boolean) => {
    setPerms(new Set(checked ? allPermissions : []));
    setDirty(true);
  }, [allPermissions]);

  const handleSave = useCallback(async () => {
    if (!selectedId) return;
    if (mode === 'roles') {
      await updateRolePerms({ id: selectedId, data: { permissions: [...perms] } });
    } else {
      await updateUserPerms({ id: selectedId, data: { permissions: [...perms] } });
    }
    setDirty(false);
    qc.invalidateQueries({ queryKey: adminKeys.all });
  }, [selectedId, mode, perms, updateRolePerms, updateUserPerms, qc]);

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
        const groupChecked = group.permissions.every((p) => perms.has(p));
        const groupIndeterminate = !groupChecked && group.permissions.some((p) => perms.has(p));
        return (
          <Checkbox
            checked={groupChecked}
            indeterminate={groupIndeterminate}
            onChange={(e: CheckboxChangeEvent) => toggleResource(group, e.target.checked)}
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
        const perm = permLookup.get(`${record.resource}.${action}`);
        if (!perm) return null;
        return (
          <div className="flex justify-center">
            <Checkbox
              checked={perms.has(perm)}
              onChange={(e: CheckboxChangeEvent) => toggle(perm, e.target.checked)}
            />
          </div>
        );
      },
    }));

    return [resourceCol, ...actionCols];
  }, [allChecked, someChecked, toggleAll, allActions, permLookup, permGroups, perms, toggleResource, toggle]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography.Title level={4} className="m-0">Permission Matrix</Typography.Title>
        <div className="flex items-center gap-4">
          <Segmented<Mode>
            value={mode}
            onChange={(val) => { setMode(val); setSelectedId(null); setHasAutoSelected(false); setDirty(false); }}
            options={[
              { label: 'Roles', value: 'roles' },
              { label: 'Users', value: 'users' },
            ]}
          />
          <Select
            className="w-48"
            placeholder={`Select a ${mode === 'roles' ? 'role' : 'user'}`}
            value={selectedId}
            onChange={(val) => { setSelectedId(val); setDirty(false); }}
            options={selectOptions}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
          <Button type="primary" onClick={handleSave} disabled={!selectedId || !dirty}>
            Save Changes
          </Button>
        </div>
      </div>

      {!selectedId && (
        <Typography.Text type="secondary">
          Select a {mode === 'roles' ? 'role' : 'user'} above to manage their permissions.
        </Typography.Text>
      )}

      <Spin spinning={loading}>
        <Table<TableRow>
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </Spin>
    </div>
  );
};

export default PermissionMatrixPage;
