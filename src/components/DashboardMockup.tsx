import { Flame, Target, Trophy, Bell, TrendingUp, CheckCircle2 } from 'lucide-react';
import CrystalIcon from './icons/CrystalIcon';

const DashboardMockup = () => {
  return (
    <div className="relative">
      {/* Glow behind mockup */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-turquoise/20 to-gold/20 blur-3xl scale-110" />
      
      {/* Main Dashboard Card */}
      <div className="relative glass-card-strong p-6 space-y-4 magic-border animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/30 pb-4">
          <div className="flex items-center gap-3">
            <CrystalIcon className="w-8 h-8" glowColor="gold" />
            <span className="font-display text-xl text-foreground">Motify</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gold/20 text-gold text-sm">
              <Flame className="w-4 h-4" />
              <span>14 дней</span>
            </div>
            <Bell className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-gold">7/10</div>
            <div className="text-xs text-muted-foreground">Привычек</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-turquoise">3/5</div>
            <div className="text-xs text-muted-foreground">Целей</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-purple-light">2</div>
            <div className="text-xs text-muted-foreground">Вызова</div>
          </div>
        </div>

        {/* Habits Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-turquoise" />
            Привычки на сегодня
          </h3>
          
          {/* Habit Cards */}
          <div className="space-y-2">
            <HabitCard 
              title="Медитация" 
              progress={100} 
              streak={14} 
              completed 
              color="gold"
            />
            <HabitCard 
              title="Чтение 30 минут" 
              progress={80} 
              streak={7} 
              color="turquoise"
            />
            <HabitCard 
              title="Спорт" 
              progress={50} 
              streak={3} 
              color="purple"
            />
          </div>
        </div>

        {/* Goal Progress */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />
              <span className="font-semibold text-foreground">Выучить TypeScript</span>
            </div>
            <span className="text-sm text-gold">68%</span>
          </div>
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-gold rounded-full"
              style={{ width: '68%' }}
            />
            <div className="absolute inset-0 animate-shimmer opacity-50" />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3 text-turquoise" />
            <span>+12% за эту неделю</span>
          </div>
        </div>
      </div>

      {/* Floating notification card */}
      <div className="absolute -right-4 top-20 glass-card p-3 animate-float shadow-glow-turquoise" style={{ animationDelay: '1s' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-turquoise/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-turquoise" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">Новое достижение!</div>
            <div className="text-xs text-muted-foreground">7 дней подряд</div>
          </div>
        </div>
      </div>

      {/* Floating streak badge */}
      <div className="absolute -left-4 bottom-32 glass-card p-3 animate-float shadow-glow-gold" style={{ animationDelay: '2s' }}>
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-gold animate-pulse-glow" />
          <span className="text-lg font-bold text-gold">14</span>
        </div>
      </div>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41" />
  </svg>
);

interface HabitCardProps {
  title: string;
  progress: number;
  streak: number;
  completed?: boolean;
  color: 'gold' | 'turquoise' | 'purple';
}

const HabitCard = ({ title, progress, streak, completed, color }: HabitCardProps) => {
  const colorClasses = {
    gold: 'text-gold bg-gold',
    turquoise: 'text-turquoise bg-turquoise',
    purple: 'text-purple-light bg-purple-light',
  };

  return (
    <div className={`glass-card p-3 flex items-center justify-between ${completed ? 'border-l-2 border-l-gold' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${colorClasses[color]}/20 flex items-center justify-center`}>
          {completed ? (
            <CheckCircle2 className={`w-5 h-5 ${colorClasses[color].split(' ')[0]}`} />
          ) : (
            <div className={`w-3 h-3 rounded-full ${colorClasses[color]}/50`} />
          )}
        </div>
        <div>
          <div className={`text-sm font-medium ${completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
            {title}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Flame className="w-3 h-3 text-gold" />
            {streak} дней
          </div>
        </div>
      </div>
      <div className="w-12 h-12 relative">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-secondary"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${progress * 1.256} 125.6`}
            className={colorClasses[color].split(' ')[0]}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${colorClasses[color].split(' ')[0]}`}>
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default DashboardMockup;
