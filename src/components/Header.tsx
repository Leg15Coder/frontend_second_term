import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CrystalIcon from './icons/CrystalIcon';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'О продукте', href: '#hero' },
    { label: 'Функции', href: '#features' },
    { label: 'Сценарии', href: '#scenarios' },
    { label: 'API', href: '#api' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <nav className="container mx-auto glass-card px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-3 group">
              <CrystalIcon className="w-8 h-8 group-hover:scale-110 transition-transform" glowColor="gold" />
              <span className="font-display text-xl font-bold text-foreground">Motify</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="hidden md:block">
              <div className="flex items-center gap-3">
                <Link to="/signup" className="btn-outline-magic py-2 px-4 text-sm">
                  Регистрация
                </Link>
                <Link to="/login" className="btn-magic py-2 px-6 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Войти
                </Link>
              </div>
            </div>

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-border/30 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Link to="/login" className="btn-magic w-full py-2 text-sm flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                <Sparkles className="w-4 h-4" />
                Войти
              </Link>
              <Link to="/signup" className="btn-outline-magic w-full py-2 text-sm flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                Регистрация
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
