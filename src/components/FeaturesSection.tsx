import { 
  Flame, 
  Target, 
  Trophy, 
  Bell, 
  Sparkles,
  Zap
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Flame className="w-6 h-6" />,
      title: 'Трекер привычек со страйками',
      description: 'Отслеживайте прогресс, не прерывайте серии, получайте награды за преодоления себя.',
      color: 'gold',
      mockup: <HabitTrackerMini />,
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Цели с подпунктами',
      description: 'Разбивайте большие цели на шаги, устанавливайте дедлайны, видьте прогресс.',
      color: 'turquoise',
      mockup: <GoalTrackerMini />,
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Челленджи и достижения',
      description: 'Присоединяйтесь к вызовам, соревнуйтесь с собой, собирайте награды.',
      color: 'purple',
      mockup: <ChallengeMini />,
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Волшебство игры',
      description: 'Дружелюбные уведомления, которые мотивируют, а не раздражают.',
      color: 'crystal',
      mockup: <NotificationMini />,
    },
  ];

  const getColorClasses = (color: string) => {
    const classes: Record<string, { bg: string; text: string; glow: string }> = {
      gold: { bg: 'bg-gold/20', text: 'text-gold', glow: 'shadow-glow-gold' },
      turquoise: { bg: 'bg-turquoise/20', text: 'text-turquoise', glow: 'shadow-glow-turquoise' },
      purple: { bg: 'bg-purple-light/20', text: 'text-purple-light', glow: 'shadow-glow-purple' },
      crystal: { bg: 'bg-crystal/20', text: 'text-crystal', glow: 'shadow-glow-crystal' },
    };
    return classes[color] || classes.gold;
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-deep/20 to-transparent" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm mb-4">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-muted-foreground">Ключевой функционал</span>
          </div>
          <h2 className="section-title text-foreground">
            Решение, которое <span className="text-gradient-magic">работает</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Каждая функция создана, чтобы превратить рутину в увлекательное приключение
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className="glass-card-strong p-6 group hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex gap-6">
                  {/* Left: Content */}
                  <div className="flex-1 space-y-4">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl ${colorClasses.bg}`}>
                      <div className={colorClasses.text}>{feature.icon}</div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-display font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Right: Mini Mockup */}
                  <div className="hidden sm:block w-40 flex-shrink-0">
                    {feature.mockup}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Mini mockup components
const HabitTrackerMini = () => (
  <div className="glass-card p-3 space-y-2 h-full">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Flame className="w-3 h-3 text-gold" />
      <span>Streak: 14</span>
    </div>
    {[70, 100, 45].map((progress, i) => (
      <div key={i} className="space-y-1">
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-gold rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

const GoalTrackerMini = () => (
  <div className="glass-card p-3 space-y-2 h-full">
    <div className="flex items-center gap-2 text-xs text-turquoise">
      <Target className="w-3 h-3" />
      <span>68%</span>
    </div>
    <div className="space-y-1.5">
      {['Основы', 'Функции', 'Типы'].map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-turquoise' : 'bg-secondary'}`} />
          <span className={i < 2 ? 'text-muted-foreground line-through' : 'text-foreground'}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const ChallengeMini = () => (
  <div className="glass-card p-3 space-y-2 h-full">
    <div className="flex items-center gap-2 text-xs text-purple-light">
      <Trophy className="w-3 h-3" />
      <span>30 дней</span>
    </div>
    <div className="grid grid-cols-5 gap-1">
      {Array.from({ length: 15 }).map((_, i) => (
        <div 
          key={i} 
          className={`w-3 h-3 rounded-sm ${i < 10 ? 'bg-purple-light' : 'bg-secondary'}`}
        />
      ))}
    </div>
  </div>
);

const NotificationMini = () => (
  <div className="glass-card p-3 space-y-2 h-full">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
        <Zap className="w-3 h-3 text-gold" />
      </div>
      <div className="text-xs">
        <div className="text-foreground">Время медитации!</div>
        <div className="text-muted-foreground">Сейчас</div>
      </div>
    </div>
  </div>
);

export default FeaturesSection;
