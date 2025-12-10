import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { fetchApi } from "@/lib/fetch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { ProductRequest } from "@/lib/dtoRequest";
import { useCart } from "@/contexts/CartContext";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  products?: ProductRequest[];
  addToCart?: boolean;
}

export const Chatbot = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [sessionId, setSessionId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! 👋 Soy YumiBot. ¿En qué puedo ayudarte hoy?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      if (sessionId) return;
      try {
        const res = await fetchApi.post.initChat();
        setSessionId(res.data.sessionId);
      } catch {
        setSessionId(crypto.randomUUID());
      }
    })();
  }, [isOpen, sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetchApi.post.yumiBot({ message: input, sessionId });
      if (!res.data) {
        console.error("Respuesta vacía", res);
        toast.error("El servidor no respondió datos");
        return;
      }
      const data = res.data.content;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        isBot: true,
        timestamp: new Date(),
        products: data.products,
        addToCart: data.addToCart,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al enviar mensaje");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product: ProductRequest) => {
    try {
      await addToCart(product.sku.toString(), 1);

      toast.success(`${product.name} añadido al carrito`);
    } catch (e) {
      toast.error(e.message || "No se pudo añadir al carrito");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-background border border-border rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">YUMI BOT</h3>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Mensajes */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isBot
                        ? "bg-muted text-foreground"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    {message.products && message.products.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.products.map((product) => (
                          <Card
                            key={product.id}
                            className="p-2 flex items-center gap-2"
                          >
                            <img
                              src={product.imageUrl || "/placeholder.png"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-semibold">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ${product.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                              {/* Ver detalles */}
                              {/* TODO: Link estilo boton a la página del producto */}
                              <Link to={`/products/${product.id}`} className="p-2 flex items-center hover:text-accent transition-colors group border border-border rounded-lg hover:border-accent">
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Button
                                size="icon"
                                title="Añadir al carrito"
                                onClick={() => handleAddToCart(product)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        message.isBot
                          ? "text-muted-foreground"
                          : "text-white/70"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
