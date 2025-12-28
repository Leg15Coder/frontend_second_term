import CrystalIcon from './icons/CrystalIcon';
import { Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative py-16 px-4 border-t border-border/30">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <CrystalIcon className="w-8 h-8" glowColor="gold" />
              <span className="font-display text-xl font-bold text-foreground">Motify</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Превращаем рутину в приключение. Прокачивай привычки, достигай целей,
              становись лучшей версией себя.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Github className="w-5 h-5" />, href: 'https://github.com/Leg15Coder', label: 'GitHub' },
                {
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="22">vk</text>
                    </svg>
                  ),
                  href: 'https://vk.com/dimkaryaz',
                  label: 'VK',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  ),
                  href: 'https://t.me/dimka_ryaz',
                  label: 'Telegram',
                },
                { icon: <Mail className="w-5 h-5" />, href: 'mailto:ryazhskikh.dima.76@mail.ru', label: 'Email' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass-card text-muted-foreground hover:text-gold transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-foreground">Продукт</h4>
            <div className="space-y-2">
              <Link to="/public/features" className="block text-muted-foreground hover:text-foreground transition-colors">Функции</Link>
              <Link to="/public/roadmap" className="block text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link>
              <Link to="/public/api" className="block text-muted-foreground hover:text-foreground transition-colors">Документация</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-foreground">Компания</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors">О нас</Link>
              <Link to="/blog" className="block text-muted-foreground hover:text-foreground transition-colors">Блог</Link>
              <Link to="/contacts" className="block text-muted-foreground hover:text-foreground transition-colors">Контакты</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Motify. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-foreground transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
