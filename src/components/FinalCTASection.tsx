import { Sparkles, Rocket, Play, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CrystalIcon from './icons/CrystalIcon';
import { useToast } from '@/hooks/use-toast';

const FinalCTASection = () => {
  const { toast } = useToast();

  const handleWatchDemo = () => {
    toast({
      title: "В разработке",
      description: "Видео демонстрация скоро будет доступна",
    });
  };

  const handleDownloadPresentation = () => {
    const link = document.createElement('a');
    link.href = '/presentation.html';
    link.download = 'Motify-presentation.html';
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast({
      title: "Загрузка началась",
      description: "Презентация Motify скачивается",
    });
  };

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-deep via-background to-background" />
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-3xl rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gold/15 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-turquoise/10 blur-3xl rounded-full" />
        
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '0s' }}>
          <CrystalIcon className="w-12 h-12 opacity-30" glowColor="gold" />
        </div>
        <div className="absolute bottom-60 right-32 animate-float" style={{ animationDelay: '2s' }}>
          <CrystalIcon className="w-8 h-8 opacity-30" glowColor="turquoise" />
        </div>
        <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '4s' }}>
          <CrystalIcon className="w-10 h-10 opacity-30" glowColor="purple" />
        </div>
        
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-gold rounded-full animate-float opacity-40"
            style={{
              left: `${10 + Math.random() * 80}%`,
              bottom: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold">Присоединяйся к нам</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
            Помогите превратить{' '}
            <span className="text-gradient-magic">прокачку привычек</span>
            {' '}в увлекательный опыт
          </h2>

          <p className="text-xl текст-muted-foreground max-w-2xl mx-auto">
            Вместе мы создадим приложение, которое меняет отношение людей к
            саморазвитию. Каждая привычка — это шаг к лучшей версии себя.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/investment" className="btn-magic flex items-center justify-center gap-2 group text-lg">
              <Rocket className="w-5 h-5" />
              Инвестировать в идею
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              onClick={handleWatchDemo}
              className="btn-outline-magic flex items-center justify-center gap-2 text-lg"
            >
              <Play className="w-5 h-5" />
              Посмотреть демо
            </button>
            <button
              onClick={handleDownloadPresentation}
              className="glass-card px-6 py-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="w-5 h-5" />
              Скачать презентацию
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-border/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">$50K</div>
              <div className="text-sm text-muted-foreground">Цель инвестиций</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-turquoise">Q1 2026</div>
              <div className="text-sm text-muted-foreground">Запуск бета-версии</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-light">100K+</div>
              <div className="text-sm text-muted-foreground">Целевая аудитория</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
