import { LayoutDashboard, FileText, Trophy, User } from 'lucide-react';
import StatCard from '../shared/public/StatCard';
import GoalCard from '../shared/public/GoalCard';
import ChallengeCard from '../shared/public/ChallengeCard';
import styles from './ScreensSection.module.css';

// Use real Dashboard structure (presentation-only) to match app look
const DashboardPreview = () => (
  <div className={`w-full h-full pointer-events-none flex flex-col gap-3 min-h-0 overflow-hidden ${styles.previewRoot}`}>
    <div className="flex items-center justify-between flex-none">
      <div className="flex flex-col">
        <p className="text-white text-2xl font-black">Dashboard</p>
        <p className="text-white/60 text-sm">Here's your progress for today. Keep going!</p>
      </div>
      <div className="text-xs text-muted-foreground">Add New Goal</div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">
      <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">
        <div className="glass-panel p-6">
          <h2 className="text-white text-[22px] font-bold pb-4">Today's Focus</h2>
          <div className="flex flex-col divide-y divide-white/10">
            <label className="flex gap-x-4 py-4 items-center">
              <input className="h-5 w-5 rounded-full border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary" type="checkbox" checked={false} readOnly />
              <p className="text-white/80 text-base">Meditate for 10 minutes</p>
            </label>
            <label className="flex gap-x-4 py-4 items-center">
              <input className="h-5 w-5 rounded-full border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary" type="checkbox" checked readOnly />
              <p className="text-white/80 text-base line-through text-white/50">Read 1 chapter of a book</p>
            </label>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-white text-[22px] font-bold pb-4">Active Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GoalCard title="Learn Spanish Fluently" progress={45} description="" />
            <GoalCard title="Run a Half Marathon" progress={75} description="" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-h-0">
        <div className="glass-panel p-3">
          <h4 className="text-white text-lg font-semibold">Ongoing Challenge</h4>
          <ChallengeCard title="30-Day Meditation" days="12 / 30 Days" description="Complete your daily session to keep the streak alive." />
        </div>

        <div className="glass-panel p-3">
          <h4 className="text-white text-lg font-semibold">Progress Overview</h4>
          <div className="flex items-center justify-center mt-3">
            <div className="text-2xl font-bold text-white">65%</div>
            <div className="text-sm text-white/60">Weekly Habits</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Use real ProfileView structure (presentation-only)
const ProfilePreview = () => (
  <div className={`w-full h-full pointer-events-none min-h-0 overflow-hidden ${styles.previewRoot}`}>
    <div className={`p-3 ${styles.glassPanelOverride}`}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80')" }} />
        <div className="flex-1">
          <h2 className="text-xl font-bold">Alex Mercer</h2>
          <p className="text-white/70">alex@example.com</p>
          <div className="mt-3 flex gap-3">
            <span className="p-2 bg-accent/10 text-accent rounded">Edit Profile</span>
            <span className="p-2 bg-white/10 rounded">Settings</span>
          </div>
        </div>
      </div>

      <div className={`${styles.statGrid} mt-4`}>
        <div className={styles.smallCard}><StatCard value={24} label="Habits" /></div>
        <div className={styles.smallCard}><StatCard value={8} label="Goals" /></div>
        <div className={styles.smallCard}><StatCard value={12} label="Challenges" /></div>
      </div>
    </div>
  </div>
);

const ChallengesPreview = () => (
  <div className="w-full h-full pointer-events-none min-h-0 overflow-hidden">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
      {[
        { id: 'c1', title: '30-Day Meditation', days: '12 / 30 Days' },
        { id: 'c2', title: '21-Day Fitness', days: '5 / 21 Days' },
      ].map((c) => (
        <div key={c.id} className="glass-card p-3 h-28 flex flex-col justify-center">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold">{c.title}</div>
              <div className="text-xs text-muted-foreground">{c.days}</div>
            </div>
            <div className="text-xs text-muted-foreground">Streak 7</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HabitDetailPreview = () => (
  <div className="w-full h-full pointer-events-none min-h-0 overflow-hidden flex flex-col">
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold">Медитация</h4>
          <p className="text-sm text-muted-foreground">Ежедневная практика для фокусировки ума</p>
        </div>
        <div className="text-sm text-muted-foreground">14 дней</div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-white/10 h-3 rounded overflow-hidden">
          <div className="h-full bg-gradient-gold" style={{ width: '68%' }} />
        </div>
      </div>
      <div className="mt-3 text-sm text-muted-foreground">История выполнения и небольшая статистика за месяц.</div>
    </div>
  </div>
);

const ScreensSection = () => {
   // Use real static HTML mockups from public/ via iframe previews
   const screens = [
     {
       title: 'Dashboard',
       subtitle: 'Главная',
       icon: <LayoutDashboard className="w-5 h-5" />,
       description: 'Карточки привычек, целей, вызовов с прогресс-барами и магическим свечением',
       preview: <DashboardPreview />,
     },
     {
       title: 'Habit Detail',
       subtitle: 'Детали привычки',
       icon: <FileText className="w-5 h-5" />,
       description: 'Графики прогресса, история, статистика streak-ов',
       preview: <HabitDetailPreview />,
     },
     {
       title: 'Challenges',
       subtitle: 'Вызовы',
       icon: <Trophy className="w-5 h-5" />,
       description: 'Каталог челленджей с фильтрами по категориям',
       preview: <ChallengesPreview />,
     },
     {
       title: 'Profile',
       subtitle: 'Профиль',
       icon: <User className="w-5 h-5" />,
       description: 'Аватар-кристалл, статистика, достижения, streak-и',
       preview: <ProfilePreview />,
     },
   ];

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-deep/20 via-transparent to-purple-deep/20" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="section-title text-foreground">
            Дизайн <span className="text-gradient-magic">приложения</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Превью основных экранов SPA в едином магическом стиле
          </p>
        </div>

        {/* Screens Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {screens.map((screen) => (
            <div
              key={screen.title}
               className="glass-card-strong overflow-hidden group hover:-translate-y-1 transition-all duration-500"
             >
              {/* Preview Area */}
              <div className="aspect-video bg-gradient-to-br from-card to-secondary/50 p-4 relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-turquoise/10" />
                
                {/* Preview content (real mock iframe) */}
                <div className="relative z-10 h-full">
                  {screen.preview}
                </div>
              </div>

              {/* Info */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    {screen.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{screen.title}</h3>
                    <span className="text-sm text-muted-foreground">{screen.subtitle}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{screen.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Note: The previous inline preview components (mini-mockups) were removed in favor of
// embedding the real static HTML mockups located in the `public/` folder via iframes.
export default ScreensSection;
