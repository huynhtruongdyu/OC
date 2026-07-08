export {
  getWeatherForecast,
  getMockWeatherForecast,
  getFailedWeatherForecast,
  getSlowWeatherForecast,
  useWeatherForecast,
  useMockWeatherForecast,
  useSlowWeatherForecast,
  useFailedWeatherForecast,
  weatherKeys,
} from './weather';
export type { WeatherForecast } from './weather';

export {
  login,
  register,
  refresh,
  useLogin,
  useRegister,
  useRefresh,
} from './auth';
export type { AuthResponse, LoginRequest, RegisterRequest } from './auth';

export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  catalogKeys,
} from './catalog';
export type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from './catalog';

export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUserPermissions,
  useUpdateUserPermissions,
  useRoles,
  useRole,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useRolePermissions,
  useUpdateRolePermissions,
  usePermissionGroups,
  adminKeys,
  roleService,
} from './admin';
export type {
  AdminUser,
  AdminRole,
  RoleDetail,
  PermissionGroup,
} from './admin';
