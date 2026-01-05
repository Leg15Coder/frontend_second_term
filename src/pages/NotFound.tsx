import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-[500px] h-[500px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-spin-slow"
                 style={{ animationDuration: '20s' }} />
            <div className="absolute inset-8 rounded-full border-4 border-pink-500/30 animate-spin-slow"
                 style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className="absolute inset-16 rounded-full border-4 border-cyan-500/30 animate-spin-slow"
                 style={{ animationDuration: '10s' }} />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 animate-pulse-slow" />
            <div className="portal-crack absolute inset-0 rounded-full bg-black/50 backdrop-blur-sm"
                 style={{
                   clipPath: 'polygon(50% 0%, 60% 20%, 80% 30%, 90% 50%, 80% 70%, 60% 80%, 50% 100%, 40% 80%, 20% 70%, 10% 50%, 20% 30%, 40% 20%)',
                   animation: 'crackExpand 3s ease-out infinite'
                 }} />
          </div>
        </div>

        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.8)'
            }}
          />
        ))}

        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl animate-float"
             style={{ animationDelay: '0s', animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-cyan-500/10 blur-2xl animate-float"
             style={{ animationDelay: '1s', animationDuration: '5s' }} />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-pink-500/10 blur-2xl animate-float"
             style={{ animationDelay: '2s', animationDuration: '6s' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-block">
            <h1 className="text-9xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse-glow">
              404
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 animate-shimmer" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            </h2>
            <p className="text-xl text-purple-200/80">
              Путь, который вы ищете, рассыпался в пустоту...
            </p>
          </div>
        </div>

        <div className="relative p-6 rounded-2xl bg-black/30 backdrop-blur-md border border-purple-500/30 shadow-2xl">
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-pink-500 animate-ping" />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-cyan-500 animate-ping"
               style={{ animationDelay: '1s' }} />

          <p className="text-gray-300 mb-6">
            Страница <span className="font-mono text-pink-400">{location.pathname}</span> не существует в этой реальности.
            Возможно, она была поглощена магическим вихрем или никогда не создавалась.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/50 transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <Home className="mr-2 h-4 w-4" />
              Вернуться на Главную
            </Button>

            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Назад
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span>Ошибка: страница не найдена</span>
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"
               style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.8));
          }
          50% { 
            filter: drop-shadow(0 0 40px rgba(236, 72, 153, 1)) drop-shadow(0 0 60px rgba(6, 182, 212, 0.8));
          }
        }

        @keyframes crackExpand {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }

        .portal-crack {
          animation: crackExpand 3s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;


