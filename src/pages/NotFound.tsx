import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full text-center bg-white rounded-xl border shadow-sm p-8">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={48} className="text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Error 404</h1>
        <h2 className="text-xl text-muted-foreground mb-4">Página no encontrada</h2>
        
        <p className="text-muted-foreground mb-6">
          Lo sentimos, no pudimos encontrar la página <span className="font-mono bg-gray-100 px-1 rounded">{location.pathname}</span>. Es posible que haya sido movida o eliminada.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            asChild
            className="flex items-center gap-2"
          >
            <Link to="/">
              <Home size={18} />
              <span>Ir a Inicio</span>
            </Link>
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            <span>Volver atrás</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
