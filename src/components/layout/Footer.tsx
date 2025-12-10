import { Link } from 'react-router-dom';
import logoYumi from '@/assets/yumiLogo.png';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4 overflow-hidden h-14">
              <img src={logoYumi} alt="logo-yumi" className="h-24 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Vende de todo y para todos. Envíos a nivel nacional, próximamente a todo el mundo.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Comprar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-primary transition-colors">Productos</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Carrito</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Cuenta</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/profile" className="hover:text-accent transition-colors">
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-accent transition-colors">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link to="/addresses" className="hover:text-accent transition-colors">
                  Direcciones
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Información</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Políticas</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Yumi. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
