import { useAuth } from "@/contexts/AuthContext";
import { fetchApi, fetchAdminApi } from "@/lib/fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, Package, ShoppingCart, FileText } from "lucide-react";
import { toast } from "sonner";
import { ProductManagement } from "@/components/dashboard/ProductManagement";
import { UserManagement } from "@/components/dashboard/UserManagement";
import { CategoryManagement } from "@/components/dashboard/CategoryManagement";
import { Button } from "@/components/ui/button";
import { usePaginatedData } from "@/hooks/use-paginatedData";
import { OrderStatus } from "@/lib/dtoHelper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { isLoading, isAdmin, isInventoryManager, isShippingManager, user } =
    useAuth();

  const {
    data: users,
    page: usersPage,
    totalPages: usersTotalPages,
    setPage: setUsersPage,
    reload: reloadUsers,
  } = usePaginatedData(
    (p, s) => fetchAdminApi.get.users(p, s).then((r) => r.data!),
    10
  );

  const {
    data: products,
    page: productsPage,
    totalPages: productsTotalPages,
    setPage: setProductsPage,
    reload: reloadProducts,
  } = usePaginatedData(
    (p, s) =>
      fetchApi.get
        .products(null, null, null, 0, 99999, p, s)
        .then((r) => r.data!),
    10
  );

  const {
    data: categories,
    page: categoriesPage,
    totalPages: categoriesTotalPages,
    setPage: setCategoriesPage,
    reload: reloadCategories,
  } = usePaginatedData(
    (p, s) => fetchApi.get.categories(null, p, s).then((r) => r.data!),
    10
  );

  const {
    data: orders,
    page: ordersPage,
    totalPages: ordersTotalPages,
    setPage: setOrdersPage,
    reload: reloadOrders,
  } = usePaginatedData(
    (p, s) => fetchAdminApi.get.orders(p, s).then((r) => r.data!),
    10
  );

  const {
    data: auditLogs,
    page: auditPage,
    totalPages: auditTotalPages,
    setPage: setAuditPage,
    reload: reloadAudit,
  } = usePaginatedData(
    (p, s) => fetchAdminApi.get.audit(p, s).then((r) => r.data!),
    10
  );

  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const defaultTab = isAdmin
    ? "users"
    : isInventoryManager
    ? "products"
    : "orders";

  const handleUpdateOrderStatus = async (
    orderSku: string,
    newStatus: OrderStatus
  ) => {
    try {
      const res = await fetchAdminApi.patch.changeOrderStatus(orderSku, {
        status: newStatus,
      });
      if (res.data) {
        toast.success("Estado actualizado");
        reloadOrders();
      } else {
        toast.error(res.error?.message ?? "Error");
      }
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user.fullName} <span>({user.role})</span>
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          {isAdmin && (
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Usuarios
            </TabsTrigger>
          )}
          {(isAdmin || isInventoryManager) && (
            <>
              <TabsTrigger value="products">
                <Package className="h-4 w-4 mr-2" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="categories">
                <Package className="h-4 w-4 mr-2" />
                Categorías
              </TabsTrigger>
            </>
          )}
          {(isAdmin || isShippingManager) && (
            <TabsTrigger value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Órdenes
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="audit">
              <FileText className="h-4 w-4 mr-2" />
              Auditoría
            </TabsTrigger>
          )}
        </TabsList>

        {isAdmin && (
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement users={users} onUpdate={reloadUsers} />
                <Pagination
                  page={usersPage}
                  totalPages={usersTotalPages}
                  onPageChange={setUsersPage}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {(isAdmin || isInventoryManager) && (
          <>
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Productos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductManagement
                    products={products}
                    categories={categories}
                    onUpdate={() => {
                      reloadProducts();
                      reloadCategories();
                    }}
                  />
                  <Pagination
                    page={productsPage}
                    totalPages={productsTotalPages}
                    onPageChange={setProductsPage}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryManagement
                    categories={categories}
                    onUpdate={reloadCategories}
                  />
                  <Pagination
                    page={categoriesPage}
                    totalPages={categoriesTotalPages}
                    onPageChange={setCategoriesPage}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        {(isAdmin || isShippingManager) && (
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Órdenes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customerEmail}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString(
                            "es-ES"
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleUpdateOrderStatus(
                                order.orderSku,
                                value as OrderStatus
                              )
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(OrderStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  page={ordersPage}
                  totalPages={ordersTotalPages}
                  onPageChange={setOrdersPage}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Auditoría</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.adminEmail}</TableCell>
                        <TableCell>{log.role}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>
                          {new Date(log.createdAt).toLocaleString("es-ES")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  page={auditPage}
                  totalPages={auditTotalPages}
                  onPageChange={setAuditPage}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) => (
  <div className="flex items-center justify-between mt-4">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onPageChange(Math.max(page - 1, 0))}
      disabled={page === 0}
    >
      Anterior
    </Button>
    <span className="text-sm text-muted-foreground">
      Página {page + 1} de {totalPages}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onPageChange(page + 1)}
      disabled={page >= totalPages - 1}
    >
      Siguiente
    </Button>
  </div>
);

export default Dashboard;
