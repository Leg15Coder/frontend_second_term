import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail, Clock } from "lucide-react";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function UnverifiedEmailWarning() {
  const [show, setShow] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && !user.emailVerified) {
        const creationTime = user.metadata.creationTime || new Date().toISOString();
        const createdAt = new Date(creationTime).getTime();
        const now = Date.now();
        const accountAge = Math.floor((now - createdAt) / (24 * 60 * 60 * 1000));
        const remaining = Math.max(0, 7 - accountAge);

        setDaysRemaining(remaining);
        setShow(true);

        if (remaining === 0) {
          console.warn('Account will be deleted today!');
        }
      } else {
        setShow(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleResendEmail = async () => {
    setIsSending(true);
    try {
      await authService.sendVerificationEmail();
      toast.success("Письмо отправлено! Проверьте вашу почту.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Не удалось отправить письмо";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  const navigate = useNavigate();

  if (!show) return null;

  const isUrgent = daysRemaining !== null && daysRemaining <= 2;
  const isCritical = daysRemaining === 0;

  return (
    <Alert
      variant={isCritical ? "destructive" : "default"}
      className={`mb-6 ${isUrgent ? 'border-orange-500 bg-orange-500/10' : ''} ${isCritical ? 'border-red-500 bg-red-500/10 animate-pulse' : ''}`}
    >
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="flex items-center gap-2 text-lg font-bold">
        {isCritical ? '🚨 Срочно!' : '⚠️ Email не подтвержден'}
        {daysRemaining !== null && (
          <span className="flex items-center gap-1 text-sm font-normal">
            <Clock className="h-4 w-4" />
            {isCritical
              ? 'Аккаунт будет удален сегодня!'
              : `Осталось ${daysRemaining} ${getDaysWord(daysRemaining)}`}
          </span>
        )}
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>
          {isCritical
            ? 'Ваш аккаунт будет автоматически удален в конце дня, если вы не подтвердите email.'
            : 'Подтвердите ваш email для полного доступа ко всем функциям. Неподтвержденные аккаунты удаляются через 7 дней.'}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/verify-email')}
            variant={isCritical ? "destructive" : "default"}
          >
            <Mail className="mr-2 h-4 w-4" />
            Подтвердить email
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleResendEmail}
            disabled={isSending}
          >
            {isSending ? "Отправка..." : "Отправить письмо повторно"}
          </Button>
        </div>
        {isCritical && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            ⏰ Действуйте немедленно, чтобы сохранить ваш аккаунт и данные!
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}

function getDaysWord(days: number): string {
  if (days === 1) return 'день';
  if (days >= 2 && days <= 4) return 'дня';
  return 'дней';
}

