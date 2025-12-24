/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState: { currentUser?: API.CurrentUser } | undefined,
) {
  const { currentUser } = initialState ?? {};

  // 如果用户已登录（有 currentUser），就允许访问
  // 因为菜单数据是从后端获取的，后端已经做了权限控制
  // 如果用户没有权限，后端不会返回对应的菜单
  const canAdmin = !!currentUser;

  return {
    canAdmin,
  };
}
