import CrystalIcon from './icons/CrystalIcon';
import RuneIcon from './icons/RuneIcon';
import { AlertCircle, Target, Zap } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: <AlertCircle className="w-8 h-8" />,
      crystal: <CrystalIcon className="w-12 h-12" glowColor="gold" />,
      title: 'Привычки не приживаются',
      description: 'Люди бросают привычки через несколько дней. Нет визуального прогресса, нет ощущения достижения, мотивация угасает.',
      color: 'gold' as const,
    },
    {
      icon: <Target className="w-8 h-8" />,
      crystal: <CrystalIcon className="w-12 h-12" glowColor="turquoise" />,
      title: 'Цели остаются мечтами',
      description: 'Цели расплывчатые и не разбиты на конкретные шаги. Без структуры и дедлайнов они так и остаются в списке желаний.',
      color: 'turquoise' as const,
    },
    {
      icon: <Zap className="w-8 h-8" />,
      crystal: <CrystalIcon className="w-12 h-12" glowColor="purple" />,
      title: 'Скучные трекеры убивают мотивацию',
      description: 'Существующие приложения сухие и функциональные. Нет эмоций, визуального кайфа, ощущения победы над собой.',
      color: 'purple' as const,
    },
  ];

  const colorClasses = {
    gold: {
      iconBg: 'bg-gold/20',
      iconText: 'text-gold',
      border: 'border-gold/30',
      glow: 'shadow-glow-gold',
    },
    turquoise: {
      iconBg: 'bg-turquoise/20',
      iconText: 'text-turquoise',
      border: 'border-turquoise/30',
      glow: 'shadow-glow-turquoise',
    },
    purple: {
      iconBg: 'bg-purple-light/20',
      iconText: 'text-purple-light',
      border: 'border-purple-light/30',
      glow: 'shadow-glow-purple',
    },
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute top-20 left-10 opacity-20">
        <RuneIcon className="w-16 h-16" variant={1} />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20">
        <RuneIcon className="w-20 h-20" variant={2} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="section-title text-foreground">
            Какую <span className="text-gradient-gold">проблему</span> решаем
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Понимаем боль. У нас есть решение.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={`glass-card-strong p-8 space-y-6 group hover:${colorClasses[problem.color].glow} transition-all duration-500 hover:-translate-y-2`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex justify-center">
                <div className={`relative p-4 rounded-2xl ${colorClasses[problem.color].iconBg} ${colorClasses[problem.color].border} border`}>
                  {problem.crystal}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-sparkle" />
                </div>
              </div>

              <h3 className={`text-xl font-display font-bold text-center ${colorClasses[problem.color].iconText}`}>
                {problem.title}
              </h3>

              <p className="text-muted-foreground text-center leading-relaxed text-justify">
                {problem.description}
              </p>

              <div className={`h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-transparent via-${problem.color} to-transparent opacity-50`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
