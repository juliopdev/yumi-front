import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShoppingBag, Truck, Shield, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Sobre Nosotros</h1>
        <p className="text-muted-foreground text-center mb-8">
          Conoce más sobre Yumi, tu tienda de confianza
        </p>

        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">Nuestra Historia</TabsTrigger>
            <TabsTrigger value="faq">Preguntas Frecuentes</TabsTrigger>
            <TabsTrigger value="policies">Políticas</TabsTrigger>
          </TabsList>

          {/* About */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bienvenido a Yumi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Yumi nació en 2020 con una misión clara: ofrecer productos de calidad para todos,
                  con envíos rápidos y seguros a nivel nacional. Nos especializamos en una amplia
                  variedad de categorías, desde electrónica hasta moda, hogar y más.
                </p>
                <p>
                  Somos una empresa comprometida con la satisfacción del cliente, ofreciendo
                  experiencias de compra excepcionales y productos cuidadosamente seleccionados.
                  Nuestro equipo trabaja día a día para garantizar que cada pedido llegue
                  en perfectas condiciones y en el menor tiempo posible.
                </p>
                <p className="font-semibold text-primary">
                  Próximamente expandiremos nuestros envíos a todo el mundo, llevando la calidad
                  de Yumi a cada rincón del planeta.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                  <ShoppingBag className="h-12 w-12 text-primary" />
                  <h3 className="font-semibold text-lg">Variedad de Productos</h3>
                  <p className="text-muted-foreground text-sm">
                    Miles de productos de las mejores marcas a tu alcance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                  <Truck className="h-12 w-12 text-primary" />
                  <h3 className="font-semibold text-lg">Envíos Rápidos</h3>
                  <p className="text-muted-foreground text-sm">
                    Entrega en 24-48 horas en todo el territorio nacional
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                  <Shield className="h-12 w-12 text-primary" />
                  <h3 className="font-semibold text-lg">Compra Segura</h3>
                  <p className="text-muted-foreground text-sm">
                    Protección en todas tus transacciones y datos encriptados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                  <Heart className="h-12 w-12 text-primary" />
                  <h3 className="font-semibold text-lg">Atención al Cliente</h3>
                  <p className="text-muted-foreground text-sm">
                    Soporte dedicado 24/7 para resolver todas tus dudas
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Preguntas Frecuentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>¿Cómo puedo hacer un pedido?</AccordionTrigger>
                    <AccordionContent>
                      Hacer un pedido es muy sencillo. Navega por nuestro catálogo, agrega los productos
                      que desees al carrito, completa el proceso de pago y listo. Recibirás una
                      confirmación por email con todos los detalles de tu pedido.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>¿Cuáles son los métodos de pago aceptados?</AccordionTrigger>
                    <AccordionContent>
                      Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express),
                      transferencias bancarias y pagos contra entrega en algunas zonas. Todos los
                      pagos son procesados de forma segura mediante encriptación SSL.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>¿Cuánto tarda la entrega?</AccordionTrigger>
                    <AccordionContent>
                      Los tiempos de entrega varían según tu ubicación. En la mayoría de ciudades
                      principales, la entrega se realiza en 24-48 horas. Para zonas remotas, puede
                      tomar de 3 a 5 días hábiles. Recibirás un número de seguimiento para rastrear
                      tu pedido en tiempo real.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>¿Puedo devolver o cambiar un producto?</AccordionTrigger>
                    <AccordionContent>
                      Sí, aceptamos devoluciones y cambios dentro de los 30 días posteriores a la
                      recepción del producto. El artículo debe estar en su empaque original, sin uso
                      y con todas sus etiquetas. Los gastos de envío de devolución corren por cuenta
                      del cliente, excepto en casos de productos defectuosos.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>¿Los precios incluyen IVA?</AccordionTrigger>
                    <AccordionContent>
                      Sí, todos nuestros precios mostrados incluyen IVA. Lo que ves es lo que pagas,
                      sin cargos ocultos adicionales. En el resumen de compra podrás ver el desglose
                      completo de tu pedido.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>¿Ofrecen garantía en los productos?</AccordionTrigger>
                    <AccordionContent>
                      Todos nuestros productos cuentan con garantía del fabricante. El tiempo de
                      garantía varía según el producto y marca (generalmente de 6 meses a 2 años).
                      Adicionalmente, ofrecemos una garantía de satisfacción de 30 días en todos
                      nuestros productos.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger>¿Hacen envíos internacionales?</AccordionTrigger>
                    <AccordionContent>
                      Actualmente realizamos envíos únicamente a nivel nacional. Sin embargo, estamos
                      trabajando para expandir nuestros servicios de envío internacional muy pronto.
                      Suscríbete a nuestro newsletter para ser el primero en enterarte cuando
                      estemos disponibles en tu país.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger>¿Cómo puedo contactar con atención al cliente?</AccordionTrigger>
                    <AccordionContent>
                      Puedes contactarnos a través de nuestro chat en línea (disponible en la esquina
                      inferior derecha), por email a soporte@yumi.com, o por teléfono al 1-800-YUMI
                      de lunes a domingo de 8:00 AM a 10:00 PM. Nuestro equipo está siempre listo
                      para ayudarte.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies */}
          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Política de Privacidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-semibold">Recopilación de Información</p>
                <p className="text-sm text-muted-foreground">
                  En Yumi recopilamos información personal que nos proporcionas al crear una cuenta,
                  realizar un pedido o contactarnos. Esto incluye nombre, dirección de correo
                  electrónico, dirección de envío, información de pago y número de teléfono.
                </p>

                <p className="font-semibold">Uso de la Información</p>
                <p className="text-sm text-muted-foreground">
                  Utilizamos tu información para procesar pedidos, mejorar nuestros servicios,
                  comunicarnos contigo sobre tu cuenta o pedidos, y enviarte ofertas promocionales
                  (solo si has dado tu consentimiento). Nunca vendemos tu información personal a terceros.
                </p>

                <p className="font-semibold">Seguridad de los Datos</p>
                <p className="text-sm text-muted-foreground">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos
                  personales contra acceso no autorizado, pérdida o alteración. Toda la información
                  sensible se transmite mediante tecnología SSL encriptada.
                </p>

                <p className="font-semibold">Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Utilizamos cookies para mejorar tu experiencia de navegación, recordar tus
                  preferencias y analizar el tráfico del sitio. Puedes configurar tu navegador para
                  rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Términos y Condiciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-semibold">Uso del Sitio Web</p>
                <p className="text-sm text-muted-foreground">
                  Al acceder y utilizar nuestro sitio web, aceptas cumplir con estos términos y
                  condiciones. Debes ser mayor de 18 años o tener el consentimiento de un padre o
                  tutor para realizar compras.
                </p>

                <p className="font-semibold">Precios y Disponibilidad</p>
                <p className="text-sm text-muted-foreground">
                  Todos los precios están sujetos a cambios sin previo aviso. Nos esforzamos por
                  mantener información precisa sobre la disponibilidad de productos, pero no podemos
                  garantizar que todos los artículos mostrados estén en stock.
                </p>

                <p className="font-semibold">Proceso de Compra</p>
                <p className="text-sm text-muted-foreground">
                  Al realizar un pedido, estás haciendo una oferta de compra. Nos reservamos el
                  derecho de rechazar cualquier pedido por cualquier motivo. Una vez confirmado el
                  pedido, recibirás un email de confirmación con los detalles de tu compra.
                </p>

                <p className="font-semibold">Devoluciones y Reembolsos</p>
                <p className="text-sm text-muted-foreground">
                  Aceptamos devoluciones dentro de los 30 días posteriores a la recepción. Los
                  productos deben estar en su estado original. Los reembolsos se procesarán en un
                  plazo de 5-10 días hábiles después de recibir el producto devuelto.
                </p>

                <p className="font-semibold">Propiedad Intelectual</p>
                <p className="text-sm text-muted-foreground">
                  Todo el contenido del sitio web, incluyendo textos, gráficos, logos e imágenes,
                  es propiedad de Yumi y está protegido por leyes de derechos de autor. No está
                  permitida la reproducción sin autorización expresa.
                </p>

                <p className="font-semibold">Limitación de Responsabilidad</p>
                <p className="text-sm text-muted-foreground">
                  Yumi no será responsable de daños indirectos, incidentales o consecuentes que
                  resulten del uso de nuestros productos o servicios. Nuestra responsabilidad se
                  limita al valor del producto comprado.
                </p>

                <p className="font-semibold">Modificaciones</p>
                <p className="text-sm text-muted-foreground">
                  Nos reservamos el derecho de modificar estos términos y condiciones en cualquier
                  momento. Los cambios entrarán en vigor inmediatamente después de su publicación en
                  el sitio web. Te recomendamos revisar periódicamente esta página.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default About;
