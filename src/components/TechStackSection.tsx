import { CheckCircle2 } from 'lucide-react';

const TechStackSection = () => {
  const technologies = [
    { name: 'React', icon: '⚛️', color: 'text-crystal' },
    { name: 'TypeScript', icon: '📘', color: 'text-turquoise' },
    { name: 'Redux Toolkit', icon: '🔄', color: 'text-purple-light' },
    { name: 'React Router', icon: '🧭', color: 'text-gold' },
    { name: 'REST API', icon: '🌐', color: 'text-turquoise' },
    { name: 'SCSS Modules', icon: '🎨', color: 'text-magic-pink' },
    { name: 'Jest / RTL', icon: '🧪', color: 'text-gold' },
    { name: 'Cypress', icon: '🌲', color: 'text-turquoise' },
  ];

  const mvpFeatures = [
    'Статический лендинг на Github Pages',
    'Ссылка на прототип SPA',
    'Документация и README',
    'CI/CD настройка',
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="section-title text-foreground">
            Формат <span className="text-gradient-gold">сдачи</span> и стек
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Версия 1.0 — MVP с современным технологическим стеком
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Tech Stack */}
          <div className="space-y-6">
            <h3 className="font-display text-xl font-bold text-foreground">Технологии</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="glass-card p-4 text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {tech.icon}
                  </div>
                  <span className={`text-sm font-medium ${tech.color}`}>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MVP Format */}
          <div className="space-y-6">
            <h3 className="font-display text-xl font-bold text-foreground">MVP формат</h3>
            
            <div className="glass-card-strong p-6 space-y-4">
              {mvpFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Additional info */}
            <div className="glass-card p-4 border-l-2 border-l-turquoise">
              <p className="text-sm text-muted-foreground">
                <span className="text-turquoise font-semibold">Примечание:</span> Проект 
                использует mock API для демонстрации.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
