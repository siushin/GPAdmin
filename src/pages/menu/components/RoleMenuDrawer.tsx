import {
  App,
  Button,
  Card,
  Checkbox,
  Drawer,
  Space,
  Spin,
  Tabs,
  theme,
} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import React, { useEffect, useMemo, useState } from 'react';
import { getRoleMenus, updateRoleMenus } from '@/services/api/system';

interface RoleMenuDrawerProps {
  visible: boolean;
  roleRecord: any;
  accountType: 'admin' | 'user';
  onClose: () => void;
  onSuccess?: () => void;
}

interface ModuleData {
  module_id: number;
  module_name: string;
  module_alias: string;
}

interface MenuData {
  menu_id: number;
  menu_name: string;
  menu_key: string;
  menu_type: string;
  parent_id: number;
  is_required?: number;
  children?: MenuData[];
}

interface MenusByModule {
  module: ModuleData;
  menus: MenuData[];
}

// 按目录分组的菜单结构
interface MenuGroup {
  dir: MenuData | null; // null 表示独立菜单（没有目录的顶级菜单）
  children: MenuData[];
  // 所有菜单ID（包括目录本身和所有子菜单）
  allMenuIds: number[];
  // 是否为独立菜单组（没有目录的顶级菜单）
  isStandalone?: boolean;
}

const RoleMenuDrawer: React.FC<RoleMenuDrawerProps> = ({
  visible,
  roleRecord,
  accountType,
  onClose,
  onSuccess,
}) => {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string>('');
  const [menusByModule, setMenusByModule] = useState<MenusByModule[]>([]);
  const [checkedMenuIds, setCheckedMenuIds] = useState<number[]>([]);

  // 收集所有 is_required=1 的菜单ID
  const requiredMenuIds = useMemo(() => {
    const ids = new Set<number>();
    const collectRequired = (menus: MenuData[]) => {
      menus.forEach((menu) => {
        if (menu.is_required === 1) {
          ids.add(menu.menu_id);
        }
        if (menu.children) {
          collectRequired(menu.children);
        }
      });
    };
    for (const m of menusByModule) {
      collectRequired(m.menus);
    }
    return ids;
  }, [menusByModule]);

  // 加载角色菜单数据
  useEffect(() => {
    if (visible && roleRecord?.role_id) {
      loadRoleMenus();
    }
  }, [visible, roleRecord?.role_id]);

  const loadRoleMenus = async () => {
    if (!roleRecord?.role_id) return;

    setLoading(true);
    try {
      const res = await getRoleMenus({
        role_id: roleRecord.role_id,
        account_type: accountType,
      });
      if (res.code === 200 && res.data) {
        const { modules_with_menus, checked_menu_ids } = res.data;
        setMenusByModule(modules_with_menus || []);

        // 收集所有 is_required=1 的菜单ID
        const requiredIds = new Set<number>();
        const collectRequired = (menus: MenuData[]) => {
          menus.forEach((menu) => {
            if (menu.is_required === 1) {
              requiredIds.add(menu.menu_id);
            }
            if (menu.children) {
              collectRequired(menu.children);
            }
          });
        };
        for (const m of modules_with_menus || []) {
          collectRequired(m.menus);
        }

        // 合并已选中的菜单ID和必选菜单ID
        const mergedIds = new Set([
          ...(checked_menu_ids || []),
          ...requiredIds,
        ]);
        setCheckedMenuIds(Array.from(mergedIds));

        // 设置默认激活的Tab
        if (modules_with_menus && modules_with_menus.length > 0) {
          setActiveModuleId(String(modules_with_menus[0].module.module_id));
        }
      } else {
        message.error(res.message || '获取角色菜单失败');
      }
    } catch (_error) {
      message.error('获取角色菜单失败');
    } finally {
      setLoading(false);
    }
  };

  // 将菜单树转换为按目录分组的结构
  const convertToMenuGroups = (menus: MenuData[]): MenuGroup[] => {
    const groups: MenuGroup[] = [];
    const standaloneMenus: MenuData[] = [];

    menus.forEach((menu) => {
      if (menu.menu_type === 'dir') {
        // 目录类型，收集其子菜单
        const children = collectAllChildren(menu.children || []);
        // 收集所有菜单ID（目录本身 + 所有子菜单）
        const allMenuIds = [menu.menu_id, ...children.map((c) => c.menu_id)];
        groups.push({
          dir: menu,
          children: children,
          allMenuIds: allMenuIds,
        });
      } else {
        // 非目录类型的顶级菜单（如工作台），作为独立菜单
        standaloneMenus.push(menu);
        // 如果有子菜单也要收集
        if (menu.children && menu.children.length > 0) {
          standaloneMenus.push(...collectAllChildren(menu.children));
        }
      }
    });

    // 如果有独立菜单，添加到最前面
    if (standaloneMenus.length > 0) {
      groups.unshift({
        dir: null,
        children: standaloneMenus,
        allMenuIds: standaloneMenus.map((m) => m.menu_id),
        isStandalone: true,
      });
    }

    return groups;
  };

  // 递归收集所有子菜单（展平）
  const collectAllChildren = (menus: MenuData[]): MenuData[] => {
    const result: MenuData[] = [];
    menus.forEach((menu) => {
      result.push(menu);
      if (menu.children && menu.children.length > 0) {
        result.push(...collectAllChildren(menu.children));
      }
    });
    return result;
  };

  // 获取模块下所有菜单ID
  const getAllMenuIdsInModule = (moduleId: number): number[] => {
    const currentModule = menusByModule.find(
      (m) => m.module.module_id === moduleId,
    );
    if (!currentModule) return [];

    const allMenuIds: number[] = [];
    const collectMenuIds = (menus: MenuData[]) => {
      menus.forEach((menu) => {
        allMenuIds.push(menu.menu_id);
        if (menu.children) {
          collectMenuIds(menu.children);
        }
      });
    };
    collectMenuIds(currentModule.menus);
    return allMenuIds;
  };

  // 处理单个菜单勾选变化
  const handleMenuCheck = (menu: MenuData, checked: boolean) => {
    // 如果是必选菜单，不允许取消
    if (menu.is_required === 1) {
      return;
    }
    if (checked) {
      setCheckedMenuIds([...checkedMenuIds, menu.menu_id]);
    } else {
      setCheckedMenuIds(checkedMenuIds.filter((id) => id !== menu.menu_id));
    }
  };

  // 处理目录全选/取消全选
  const handleDirCheckAll = (group: MenuGroup, checked: boolean) => {
    const dirMenuIds = group.allMenuIds;
    // 收集该分组中的必选菜单
    const requiredInDir = [
      ...(group.dir?.is_required === 1 ? [group.dir.menu_id] : []),
      ...group.children
        .filter((m) => m.is_required === 1)
        .map((m) => m.menu_id),
    ];

    if (checked) {
      const newIds = new Set([...checkedMenuIds, ...dirMenuIds]);
      setCheckedMenuIds(Array.from(newIds));
    } else {
      // 取消全选时，保留必选菜单
      setCheckedMenuIds(
        checkedMenuIds.filter(
          (id) => !dirMenuIds.includes(id) || requiredInDir.includes(id),
        ),
      );
    }
  };

  // 检查目录分组是否全选
  const isGroupAllChecked = (group: MenuGroup): boolean => {
    return group.allMenuIds.every((id) => checkedMenuIds.includes(id));
  };

  // 检查目录分组是否部分选中
  const isGroupIndeterminate = (group: MenuGroup): boolean => {
    const checkedCount = group.allMenuIds.filter((id) =>
      checkedMenuIds.includes(id),
    ).length;
    return checkedCount > 0 && checkedCount < group.allMenuIds.length;
  };

  // 检查目录分组是否全是必选菜单
  const isGroupAllRequired = (group: MenuGroup): boolean => {
    return group.allMenuIds.every((id) => requiredMenuIds.has(id));
  };

  // 获取分组的显示名称
  const getGroupTitle = (group: MenuGroup): string => {
    if (group.isStandalone) {
      return '';
    }
    return group.dir?.menu_name || '';
  };

  // 获取模块的选中菜单数和总菜单数
  const getModuleMenuStats = (
    moduleId: number,
  ): { checked: number; total: number } => {
    const allMenuIds = getAllMenuIdsInModule(moduleId);
    const checkedCount = allMenuIds.filter((id) =>
      checkedMenuIds.includes(id),
    ).length;
    return { checked: checkedCount, total: allMenuIds.length };
  };

  // 计算总统计数据
  const totalStats = useMemo(() => {
    // 计算有选中菜单的模块数
    const modulesWithChecked = menusByModule.filter((item) => {
      const allMenuIds = getAllMenuIdsInModule(item.module.module_id);
      return allMenuIds.some((id) => checkedMenuIds.includes(id));
    }).length;

    // 计算总选中菜单数
    const totalChecked = checkedMenuIds.length;

    return {
      moduleCount: modulesWithChecked,
      menuCount: totalChecked,
    };
  }, [menusByModule, checkedMenuIds]);

  // 全选当前模块
  const handleSelectAll = (moduleId: number) => {
    const allMenuIds = getAllMenuIdsInModule(moduleId);
    const newIds = new Set([...checkedMenuIds, ...allMenuIds]);
    setCheckedMenuIds(Array.from(newIds));
  };

  // 取消全选当前模块（保留必选菜单）
  const handleDeselectAll = (moduleId: number) => {
    const allMenuIds = getAllMenuIdsInModule(moduleId);
    const allMenuIdsSet = new Set(allMenuIds);
    // 保留必选菜单
    setCheckedMenuIds(
      checkedMenuIds.filter(
        (id) => !allMenuIdsSet.has(id) || requiredMenuIds.has(id),
      ),
    );
  };

  // 保存角色菜单
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateRoleMenus({
        role_id: roleRecord.role_id,
        menu_ids: checkedMenuIds,
      });
      if (res.code === 200) {
        message.success('保存成功');
        onSuccess?.();
        onClose();
      } else {
        message.error(res.message || '保存失败');
      }
    } catch (_error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // Tab切换
  const handleTabChange = (key: string) => {
    setActiveModuleId(key);
  };

  // 渲染目录分组
  const renderMenuGroups = (menus: MenuData[]) => {
    const groups = convertToMenuGroups(menus);

    if (groups.length === 0) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: '20px 0',
            color: token.colorTextTertiary,
          }}
        >
          暂无菜单数据
        </div>
      );
    }

    return (
      <div>
        {groups.map((group, index) => (
          <Card
            key={group.dir?.menu_id || `standalone-${index}`}
            size="small"
            title={
              group.isStandalone ? null : (
                <Checkbox
                  checked={isGroupAllChecked(group)}
                  indeterminate={isGroupIndeterminate(group)}
                  disabled={isGroupAllRequired(group)}
                  onChange={(e: CheckboxChangeEvent) =>
                    handleDirCheckAll(group, e.target.checked)
                  }
                >
                  <span style={{ fontWeight: 500 }}>
                    {getGroupTitle(group)}
                  </span>
                </Checkbox>
              )
            }
            style={{ marginBottom: 12 }}
            styles={{
              header: group.isStandalone ? { display: 'none' } : undefined,
              body: { padding: '12px 16px' },
            }}
          >
            {group.children.length > 0 ? (
              <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}
              >
                {group.children.map((menu) => (
                  <Checkbox
                    key={menu.menu_id}
                    checked={checkedMenuIds.includes(menu.menu_id)}
                    disabled={menu.is_required === 1}
                    onChange={(e: CheckboxChangeEvent) =>
                      handleMenuCheck(menu, e.target.checked)
                    }
                  >
                    {menu.menu_name}
                  </Checkbox>
                ))}
              </div>
            ) : (
              <div style={{ color: token.colorTextTertiary }}>暂无子菜单</div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Drawer
      title={`角色菜单 - ${roleRecord?.role_name || ''}`}
      open={visible}
      onClose={onClose}
      width={720}
      styles={{
        body: {
          overflow: 'auto',
        },
      }}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ color: token.colorTextSecondary }}>
            共分配{' '}
            <span style={{ color: token.colorPrimary, fontWeight: 500 }}>
              {totalStats.moduleCount}
            </span>{' '}
            个模块， 共选择{' '}
            <span style={{ color: token.colorPrimary, fontWeight: 500 }}>
              {totalStats.menuCount}
            </span>{' '}
            个菜单
          </div>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleSave} loading={saving}>
              保存
            </Button>
          </Space>
        </div>
      }
    >
      <Spin spinning={loading}>
        {menusByModule.length > 0 ? (
          <Tabs
            activeKey={activeModuleId}
            onChange={handleTabChange}
            items={menusByModule.map((item) => {
              const stats = getModuleMenuStats(item.module.module_id);
              return {
                key: String(item.module.module_id),
                label: `${item.module.module_name || item.module.module_alias} (${stats.checked}/${stats.total})`,
                children: (
                  <div>
                    <div style={{ marginBottom: 16 }}>
                      <Space>
                        <Button
                          size="small"
                          onClick={() => handleSelectAll(item.module.module_id)}
                        >
                          全选
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            handleDeselectAll(item.module.module_id)
                          }
                        >
                          取消全选
                        </Button>
                      </Space>
                    </div>
                    {renderMenuGroups(item.menus)}
                  </div>
                ),
              };
            })}
          />
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 0',
              color: token.colorTextTertiary,
            }}
          >
            暂无菜单数据
          </div>
        )}
      </Spin>
    </Drawer>
  );
};

export default RoleMenuDrawer;
