import { ArrowLeft, Mail, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticlesBackground from '@/components/ParticlesBackground';
import CrystalIcon from '@/components/icons/CrystalIcon';

const InvestmentPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ParticlesBackground />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Вернуться на главную
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="flex justify-center">
              <CrystalIcon className="w-20 h-20" glowColor="gold" />
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Инвестиции в <span className="text-gradient-magic">Motify</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Спасибо за интерес к проекту! Мы работаем над запуском инвестиционной кампании.
            </p>
          </div>

          <div className="glass-card p-8 md:p-12 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-foreground">О проекте</h2>
              <p className="text-muted-foreground leading-relaxed">
                Motify — это инновационное приложение для трекинга привычек и целей,
                которое превращает саморазвитие в увлекательное приключение.
                Мы создаем продукт, который помогает людям системно развиваться
                через геймификацию и персонализацию.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 py-6">
              <div className="text-center p-6 glass-card">
                <div className="text-3xl font-bold text-gold mb-2">$50K</div>
                <div className="text-sm text-muted-foreground">Цель раунда (демо)</div>
              </div>
              <div className="text-center p-6 glass-card">
                <div className="text-3xl font-bold text-turquoise mb-2">Q1 2026</div>
                <div className="text-sm text-muted-foreground">Запуск (план)</div>
              </div>
              <div className="text-center p-6 glass-card">
                <div className="text-3xl font-bold text-purple-light mb-2">100K+</div>
                <div className="text-sm text-muted-foreground">Оценка пользователей (цель)</div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-foreground">Контакты</h2>
              <p className="text-muted-foreground">
                Для получения дополнительной информации об инвестиционных возможностях,
                пожалуйста, свяжитесь со мной напрямую:
              </p>

              <div className="space-y-3">
                <a
                  href="mailto:ryazhskikh.dima.76@mail.ru"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors p-3 glass-card"
                >
                  <Mail className="w-5 h-5 text-gold" />
                  <span>ryazhskikh.dima.76@mail.ru</span>
                </a>

                <a
                  href="https://t.me/dimka_ryaz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors p-3 glass-card"
                >
                  <svg className="w-5 h-5 text-turquoise" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L2 11.5L7 15L10 13L20 22L22 2Z"/></svg>
                  <span>Telegram: @dimka_ryaz</span>
                </a>

                <a
                  href="https://github.com/Leg15Coder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors p-3 glass-card"
                >
                  <Github className="w-5 h-5 text-purple-light" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground text-center">
                Этот проект находится в стадии разработки. Информация о реальных инвестиционных возможностях
                будет доступна после завершения MVP и проведения юридической подготовки.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;

