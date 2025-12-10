import { AdminSetters, InventorySetters, ShippingSetters } from "./dtoHelper";
import { CategoryRequest, OrderRequest, ProductRequest, UserRequest } from "./dtoRequest";
import { fetchAdminApi, fetchApi } from "./fetch";

export type AdminResults   = [ProductRequest[], CategoryRequest[], OrderRequest[]];
export type InventoryResults = [ProductRequest[], CategoryRequest[]];
export type ShippingResults  = [OrderRequest[]];

export const dashboardMap = {
  admin: {
    promises: (fetchAdmin: typeof fetchAdminApi, fetch: typeof fetchApi) =>
      [
        fetch.get.products().then((r) => r?.data?.content ?? []),
        fetch.get.categories().then((r) => r?.data?.content ?? []),
        fetchAdmin.get.orders().then((r) => r?.data?.content ?? []),
      ] as const satisfies readonly Promise<unknown>[],
    setter: (res: AdminResults, setters: AdminSetters) => {
      const [p, c, o] = res;
      setters.setProducts(p);
      setters.setCategories(c);
      setters.setOrders(o);
    },
  },
  inventory: {
    promises: (fetch: typeof fetchApi) =>
      [
        fetch.get.products().then((r) => r?.data?.content ?? []),
        fetch.get.categories().then((r) => r?.data?.content ?? []),
      ] as const satisfies readonly Promise<unknown>[],
    setter: (res: InventoryResults, setters: InventorySetters) => {
      const [p, c] = res;
      setters.setProducts(p);
      setters.setCategories(c);
    },
  },
  shipping: {
    promises: (fetchAdmin: typeof fetchAdminApi) =>
      [fetchAdmin.get.orders().then((r) => r?.data?.content ?? [])] as const satisfies readonly Promise<unknown>[],
    setter: (res: ShippingResults, setters: ShippingSetters) => {
      const [o] = res;
      setters.setOrders(o);
    },
  },
} as const;