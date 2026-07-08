import { useCallback, useMemo } from 'react';
import { Checkbox, Modal, Table, Tooltip, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { usePermissionGroups } from '@/features';
import type { PermissionGroup } from '@/features';

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
  const { data: permGroups } = usePermissionGroups();
  const selectedSet = useMemo(() => new Set(value), [value]);

  const allPermissions = useMemo(
    () => permGroups?.flatMap((g) => g.permissions) ?? [],
    [permGroups],
  );

  const allChecked = useMemo(
    () => allPermissions.length > 0 && allPermissions.every((p) => selectedSet.has(p)),
    [allPermissions, selectedSet],
  );

  const someChecked = useMemo(
    () => allPermissions.some((p) => selectedSet.has(p)),
    [allPermissions, selectedSet],
  );

  const toggle = useCallback(
    (perm: string, checked: boolean) => {
      const next = new Set(selectedSet);
      if (checked) next.add(perm);
      else next.delete(perm);
      onSave([...next]);
    },
    [selectedSet, onSave],
  );

  const toggleGroup = useCallback(
    (group: PermissionGroup, checked: boolean) => {
      const next = new Set(selectedSet);
      for (const perm of group.permissions) {
        if (checked) next.add(perm);
        else next.delete(perm);
      }
      onSave([...next]);
    },
    [selectedSet, onSave],
  );

  const toggleAll = useCallback(
    (checked: boolean) => {
      onSave(checked ? [...allPermissions] : []);
    },
    [allPermissions, onSave],
  );

  const columns = [
    {
      title: (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Checkbox
            checked={allChecked}
            indeterminate={!allChecked && someChecked}
            onChange={(e: CheckboxChangeEvent) => toggleAll(e.target.checked)}
          />
          <Typography.Text strong>Permission</Typography.Text>
        </div>
      ),
      dataIndex: 'perm',
      key: 'perm',
      width: 160,
      render: (name: string) => <span className="text-xs">{name}</span>,
    },
    ...(permGroups ?? []).flatMap((group) => {
      const groupChecked = group.permissions.every((p) => selectedSet.has(p));
      const groupIndeterminate =
        !groupChecked && group.permissions.some((p) => selectedSet.has(p));
      return {
        title: (
          <Checkbox
            checked={groupChecked}
            indeterminate={groupIndeterminate}
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
          render: () => (
            <div className="flex justify-center">
              <Checkbox
                checked={selectedSet.has(perm)}
                onChange={(e: CheckboxChangeEvent) => toggle(perm, e.target.checked)}
              />
            </div>
          ),
        })),
      };
    }),
  ];

  const dataSource = useMemo(
    () => [{ key: 'value', perm: 'Value' }],
    [],
  );

  return (
    <Modal
      title="Select Permissions"
      open={open}
      onOk={() => onClose()}
      onCancel={onClose}
      width={800}
      destroyOnClose
    >
      <div className="flex justify-end mb-2">
        <Checkbox
          checked={allChecked}
          indeterminate={!allChecked && someChecked}
          onChange={(e: CheckboxChangeEvent) => toggleAll(e.target.checked)}
        >
          Select All
        </Checkbox>
      </div>
      <div className="overflow-auto">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </div>
    </Modal>
  );
};

export default PermissionModal;
