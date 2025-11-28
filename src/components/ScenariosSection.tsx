import { 
  Plus, 
  Eye, 
  Check, 
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';

const ScenariosSection = () => {
  const scenarios = [
    {
      title: 'Новая привычка',
      color: 'gold' as const,
      steps: [
        { icon: <Eye className="w-4 h-4" />, text: 'Заходит на главную страницу' },
        { icon: <Plus className="w-4 h-4" />, text: 'Нажимает "Добавить привычку"' },
        { icon: <Check className="w-4 h-4" />, text: 'Заполняет форму' },
        { icon: <Sparkles className="w-4 h-4" />, text: 'Видит карточку с квестами' },
      ],
    },
    {
      title: 'Работа с целью',
      color: 'turquoise' as const,
      steps: [
        { icon: <Eye className="w-4 h-4" />, text: 'Открывает список целей' },
        { icon: <Check className="w-4 h-4" />, text: 'Выбирает цель, видит подпункты' },
        { icon: <Plus className="w-4 h-4" />, text: 'Отмечает выполненный шаг' },
        { icon: <Sparkles className="w-4 h-4" />, text: 'Видит свой рост' },
      ],
    },
    {
      title: 'Челленджи и мотивация',
      color: 'purple' as const,
      steps: [
        { icon: <Eye className="w-4 h-4" />, text: 'Открывает раздел вызовов' },
        { icon: <Zap className="w-4 h-4" />, text: 'Фильтрует по категории' },
        { icon: <Plus className="w-4 h-4" />, text: 'Присоединяется к челленджу' },
        { icon: <Sparkles className="w-4 h-4" />, text: 'Работает над собой' },
      ],
    },
  ];

  const getColorClasses = (color: 'gold' | 'turquoise' | 'purple') => ({
    gold: {
      bg: 'bg-gold/20',
      text: 'text-gold',
      border: 'border-gold/40',
      gradient: 'from-gold/20 to-transparent',
      line: 'bg-gold/50',
    },
    turquoise: {
      bg: 'bg-turquoise/20',
      text: 'text-turquoise',
      border: 'border-turquoise/40',
      gradient: 'from-turquoise/20 to-transparent',
      line: 'bg-turquoise/50',
    },
    purple: {
      bg: 'bg-purple-light/20',
      text: 'text-purple-light',
      border: 'border-purple-light/40',
      gradient: 'from-purple-light/20 to-transparent',
      line: 'bg-purple-light/50',
    },
  })[color];

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="section-title text-foreground">
            Пользовательские <span className="text-gradient-gold">сценарии</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Как пользователи взаимодействуют с Motify
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {scenarios.map((scenario, index) => {
            const colors = getColorClasses(scenario.color);
            return (
              <div
                key={index}
                className="glass-card-strong p-6 space-y-6 group hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <span className={`font-display font-bold ${colors.text}`}>{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground">
                    {scenario.title}
                  </h3>
                </div>

                <div className="relative space-y-4 pl-6">
                  <div className={`absolute left-2 top-2 bottom-2 w-0.5 ${colors.line}`} />
                  
                  {scenarios[index].steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="relative flex items-start gap-4">
                      <div className={`absolute -left-4 w-4 h-4 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
                      </div>
                      
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${colors.bg}`}>
                          <span className={colors.text}>{step.icon}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{step.text}</span>
                      </div>

                      {stepIndex < scenario.steps.length - 1 && (
                        <ArrowRight className={`w-4 h-4 ${colors.text} opacity-30 absolute right-0 top-2`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} ${colors.border} border text-sm`}>
                  <Sparkles className={`w-4 h-4 ${colors.text}`} />
                  <span className={colors.text}>Виртуальная игра - реальный результат</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScenariosSection;
