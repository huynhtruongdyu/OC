import { useMemo } from 'react';
import { Card, Checkbox, Divider, Typography } from 'antd';
import type { PermissionGroup } from '@/features';

const PermissionTree = ({
  groups,
  selected,
  onChange,
}: {
  groups: PermissionGroup[];
  selected: string[];
  onChange: (permissions: string[]) => void;
}) => {
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const allPermissions = useMemo(
    () => groups.flatMap((g) => g.permissions),
    [groups],
  );

  const allSelected = useMemo(
    () => allPermissions.every((p) => selectedSet.has(p)),
    [allPermissions, selectedSet],
  );

  const someSelected = useMemo(
    () => allPermissions.some((p) => selectedSet.has(p)),
    [allPermissions, selectedSet],
  );

  const toggleAll = (checked: boolean) => {
    onChange(checked ? [...allPermissions] : []);
  };

  const toggleGroup = (group: PermissionGroup, checked: boolean) => {
    const newSet = new Set(selected);
    for (const perm of group.permissions) {
      if (checked) newSet.add(perm);
      else newSet.delete(perm);
    }
    onChange([...newSet]);
  };

  const togglePermission = (perm: string, checked: boolean) => {
    const newSet = new Set(selected);
    if (checked) newSet.add(perm);
    else newSet.delete(perm);
    onChange([...newSet]);
  };

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        checked={allSelected}
        indeterminate={!allSelected && someSelected}
        onChange={(e) => toggleAll(e.target.checked)}
      >
        Select All
      </Checkbox>
      <Divider className="my-2" />
      {groups.map((group) => {
        const groupSelected = group.permissions.every((p) =>
          selectedSet.has(p),
        );
        const groupIndeterminate =
          !groupSelected && group.permissions.some((p) => selectedSet.has(p));

        return (
          <Card
            key={group.group}
            size="small"
            className="mb-2"
            title={
              <Checkbox
                checked={groupSelected}
                indeterminate={groupIndeterminate}
                onChange={(e) => toggleGroup(group, e.target.checked)}
              >
                <Typography.Text strong>{group.group}</Typography.Text>
              </Checkbox>
            }
          >
            <div className="flex flex-col gap-1 pl-6">
              {group.permissions.map((perm) => (
                <Checkbox
                  key={perm}
                  checked={selectedSet.has(perm)}
                  onChange={(e) => togglePermission(perm, e.target.checked)}
                >
                  {perm}
                </Checkbox>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PermissionTree;
