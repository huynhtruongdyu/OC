import { api } from '@/api';
import type { ApiResponse } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Segmented, Spin, Table, Tag, Typography, Tooltip } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useQueryClient } from '@tanstack/react-query';
import { useRoles, usePermissionGroups, useUpdateRolePermissions, useUsers, useUpdateUserPermissions, adminKeys } from '@/features';
import type { PermissionGroup } from '@/features';

type Mode = 'roles' | 'users';

type RowItem = {
  key: string;
  name: string;
};

const fetchPermissions = async (mode: Mode, id: string): Promise<string[]> => {
  const res = await api.get<ApiResponse<string[]>>(`/api/v1/admin/${mode}/${id}/permissions`);
  return res.data.data ?? [];
};

const PermissionMatrixPage = () => {
  const [mode, setMode] = useState<Mode>('roles');
  const qc = useQueryClient();

  const { data: roles } = useRoles();
  const { data: users } = useUsers();
  const { data: permGroups } = usePermissionGroups();
  const { mutateAsync: updateRolePerms } = useUpdateRolePermissions();
  const { mutateAsync: updateUserPerms } = useUpdateUserPermissions();

  const rows: RowItem[] = useMemo(
    () => (mode === 'roles' ? roles?.map((r) => ({ key: r.id, name: r.name })) : users?.map((u) => ({ key: u.id, name: u.userName }))) ?? [],
    [mode, roles, users],
  );

  const allPermissionNames = useMemo(
    () => permGroups?.flatMap((g) => g.permissions) ?? [],
    [permGroups],
  );

  const [permMap, setPermMap] = useState<Record<string, Set<string>>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rows.length) return;
    let cancelled = false;
    setLoading(true);
    const load = async () => {
      const map: Record<string, Set<string>> = {};
      for (const row of rows) {
        const perms = await fetchPermissions(mode, row.key);
        if (cancelled) return;
        map[row.key] = new Set(perms);
      }
      if (!cancelled) {
        setPermMap(map);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [mode, rows]);

  const togglePermission = useCallback(
    (rowKey: string, perm: string, checked: boolean) => {
      setPermMap((prev) => {
        const next = { ...prev };
        const set = new Set(next[rowKey] ?? []);
        if (checked) set.add(perm);
        else set.delete(perm);
        next[rowKey] = set;
        return next;
      });
      setDirty((prev) => { const next = new Set(prev); next.add(rowKey); return next; });
    },
    [],
  );

  const toggleGroup = useCallback(
    (group: PermissionGroup, checked: boolean) => {
      setPermMap((prev) => {
        const next = { ...prev };
        for (const row of rows) {
          const set = new Set(next[row.key] ?? []);
          for (const perm of group.permissions) {
            if (checked) set.add(perm);
            else set.delete(perm);
          }
          next[row.key] = set;
        }
        return next;
      });
      setDirty((prev) => { const next = new Set(prev); for (const r of rows) next.add(r.key); return next; });
    },
    [rows],
  );

  const toggleAll = useCallback(
    (checked: boolean) => {
      setPermMap((prev) => {
        const next = { ...prev };
        for (const row of rows) {
          next[row.key] = checked ? new Set(allPermissionNames) : new Set<string>();
        }
        return next;
      });
      setDirty((prev) => { const next = new Set(prev); for (const r of rows) next.add(r.key); return next; });
    },
    [rows, allPermissionNames],
  );

  const handleSave = useCallback(async () => {
    for (const rowKey of dirty) {
      const perms = [...(permMap[rowKey] ?? [])];
      if (mode === 'roles') {
        await updateRolePerms({ id: rowKey, data: { permissions: perms } });
      } else {
        await updateUserPerms({ id: rowKey, data: { permissions: perms } });
      }
    }
    setDirty(new Set());
    qc.invalidateQueries({ queryKey: adminKeys.all });
  }, [dirty, permMap, mode, updateRolePerms, updateUserPerms, qc]);

  const allChecked = useMemo(
    () => rows.length > 0 && rows.every((r) => allPermissionNames.every((p) => permMap[r.key]?.has(p))),
    [rows, allPermissionNames, permMap],
  );

  const someChecked = useMemo(
    () => rows.length > 0 && rows.some((r) => allPermissionNames.some((p) => permMap[r.key]?.has(p))),
    [rows, allPermissionNames, permMap],
  );

  if (!permGroups) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  const columns = [
    {
      title: (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Checkbox
            checked={allChecked}
            indeterminate={!allChecked && someChecked}
            onChange={(e: CheckboxChangeEvent) => toggleAll(e.target.checked)}
          />
          <span>{mode === 'roles' ? 'Role' : 'User'}</span>
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      fixed: 'left' as const,
      width: 160,
      render: (name: string) => <Tag color={mode === 'roles' ? 'blue' : 'green'}>{name}</Tag>,
    },
    ...permGroups.flatMap((group) => {
      const groupAllChecked = rows.length > 0 && rows.every((r) =>
        group.permissions.every((p) => permMap[r.key]?.has(p)));
      const groupSomeChecked = rows.length > 0 && rows.some((r) =>
        group.permissions.some((p) => permMap[r.key]?.has(p)));
      return {
        title: (
          <Checkbox
            checked={groupAllChecked}
            indeterminate={!groupAllChecked && groupSomeChecked}
            onChange={(e: CheckboxChangeEvent) => toggleGroup(group, e.target.checked)}
          >
            <Typography.Text strong>{group.group}</Typography.Text>
          </Checkbox>
        ),
        children: group.permissions.map((perm) => ({
          title: <Tooltip title={perm} key={perm}><span className="text-xs">{perm.split('.').pop()}</span></Tooltip>,
          dataIndex: perm,
          key: perm,
          width: 68,
          render: (_: unknown, record: RowItem) => (
            <div className="flex justify-center">
              <Checkbox
                checked={permMap[record.key]?.has(perm) ?? false}
                onChange={(e: CheckboxChangeEvent) => togglePermission(record.key, perm, e.target.checked)}
              />
            </div>
          ),
        })),
      };
    }),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography.Title level={4} className="m-0">Permission Matrix</Typography.Title>
        <div className="flex items-center gap-4">
          <Segmented<Mode>
            value={mode}
            onChange={(val) => { setMode(val); setDirty(new Set()); }}
            options={[
              { label: 'Roles', value: 'roles' },
              { label: 'Users', value: 'users' },
            ]}
          />
          <Button type="primary" onClick={handleSave} disabled={dirty.size === 0} loading={loading}>
            Save Changes
          </Button>
        </div>
      </div>

      <Typography.Text type="secondary">
        Select permissions for each {mode === 'roles' ? 'role' : 'user'}. Check header boxes to toggle all permissions in a group.
      </Typography.Text>

      <Spin spinning={loading}>
        <div className="overflow-auto">
          <Table
            dataSource={rows}
            columns={columns}
            pagination={false}
            bordered
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </div>
      </Spin>
    </div>
  );
};

export default PermissionMatrixPage;
