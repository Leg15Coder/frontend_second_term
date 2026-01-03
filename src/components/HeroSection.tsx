import DashboardMockup from './DashboardMockup';
import { Sparkles, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const HeroSection = () => {
  const { toast } = useToast();

  const handleWatchDemo = () => {
    toast({
      title: 'В разработке',
      description: 'Видео демонстрация скоро будет доступна',
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-deep/30 via-transparent to-background z-0" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-turquoise/15 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-left space-y-8">
            <output className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm" aria-live="polite">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-muted-foreground">Превращаем рутину в приключение</span>
            </output>

            <h1 className="section-title text-foreground leading-tight">
              Прокачивай{' '}
              <span className="text-gradient-gold">привычки</span>
              <br />
              достигай{' '}
              <span className="text-gradient-magic">целей</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl text-left">
              Motify помогает системно развивать привычки и добиваться целей через{' '}
              <span className="text-turquoise">трекинг</span>,{' '}
              <span className="text-gold">визуализацию прогресса</span>,
              {' '}вызовы, челленджи и мягкие напоминания. Забудьте о скучных трекерах — окунитесь в геймифицированный опыт.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup" className="btn-outline-magic flex items-center justify-center gap-2" aria-label="Sign up">
                Регистрация
              </Link>

              <Link to="/login" className="btn-magic flex items-center justify-center gap-2 group" aria-label="Try demo">
                <Sparkles className="w-5 h-5" />
                Войти
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={handleWatchDemo}
                className="btn-outline-magic flex items-center justify-center gap-2"
                aria-label="Watch how it works"
                type="button"
              >
                <Play className="w-5 h-5" />
                Посмотреть демо
              </button>
            </div>

            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold">+87%</div>
                <div className="text-sm text-muted-foreground">продуктивности</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-turquoise">10K+</div>
                <div className="text-sm text-muted-foreground">незабытых дел</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-light">100%</div>
                <div className="text-sm text-muted-foreground">интересно</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
};
