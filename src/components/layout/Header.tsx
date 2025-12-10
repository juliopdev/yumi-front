import {
  ShoppingCart,
  User,
  Search,
  Menu,
  LogOut,
  Loader2,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import logoYumi from "@/assets/yumiLogo.png";

const navLinks = [
  { label: "Productos", to: "/products" },
  { label: "Sobre Nosotros", to: "/about" },
];

export const Header = () => {
  const {
    isAdmin,
    isInventoryManager,
    isShippingManager,
    isAuthenticated,
    user,
    logout,
    isLoading: authLoading,
  } = useAuth();
  const { items } = useCart();
  const itemCount = items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const userMenu = (
    <DropdownMenuContent align="end">
      <div className="px-2 py-1.5 text-sm font-medium">{user?.fullName}</div>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => navigate("/profile")}>
        Mi Perfil
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/orders")}>
        Mis Pedidos
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/addresses")}>
        Direcciones
      </DropdownMenuItem>
      {(isAdmin || isInventoryManager || isShippingManager) && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            Dashboard
          </DropdownMenuItem>
        </>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout} className="text-destructive">
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  const NavLinks = ({ mobile = false }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={
            mobile
              ? "text-lg font-medium"
              : "text-sm font-medium transition-colors hover:text-primary"
          }
        >
          {link.label}
        </Link>
      ))}
      {(isAdmin || isInventoryManager || isShippingManager) && (
        <Link
          to="/dashboard"
          className={
            mobile
              ? "text-lg font-medium text-primary"
              : "text-sm font-medium text-primary transition-colors hover:underline"
          }
        >
          Dashboard
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo + Nav Desktop */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center space-x-2 overflow-hidden h-14"
          >
            <img src={logoYumi} alt="logo-yumi" className="h-24 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>

        {/* Búsqueda */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-6"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="ghost" className="ml-2">
            Buscar
          </Button>
        </form>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          {/* Carrito */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Usuario */}
          {authLoading ? (
            <Button variant="ghost" size="icon" disabled>
              <Loader2 className="h-5 w-5 animate-spin" />
            </Button>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              {userMenu}
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/auth")} variant="default">
              Ingresar
            </Button>
          )}

          {/* Menú móvil */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-6">
                <NavLinks mobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
