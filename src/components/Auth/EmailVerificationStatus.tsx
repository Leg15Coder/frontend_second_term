import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { auth } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Mail, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function EmailVerificationStatus() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const verified = await authService.checkEmailVerified();
        setIsVerified(verified);
      } catch (err) {
        console.error("Error checking email verification:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void checkStatus();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsVerified(user.emailVerified);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSendVerification = async () => {
    setIsSending(true);
    try {
      await authService.sendVerificationEmail();
      toast.success("Письмо для подтверждения отправлено на вашу почту");
      setCanResend(false);
      setCountdown(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Не удалось отправить письмо";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsLoading(true);
    try {
      const verified = await authService.checkEmailVerified();
      setIsVerified(verified);
      if (verified) {
        toast.success("Email подтвержден!");
      } else {
        toast.info("Email еще не подтвержден");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ошибка проверки";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isVerified) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Подтверждение Email</CardTitle>
          {isVerified ? (
            <Badge className="bg-green-500">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Подтвержден
            </Badge>
          ) : (
            <Badge variant="secondary">
              <AlertCircle className="mr-1 h-3 w-3" />
              Не подтвержден
            </Badge>
          )}
        </div>
        <CardDescription>
          {isVerified
            ? "Ваш email адрес подтвержден"
            : "Подтвердите ваш email адрес для полного доступа ко всем функциям"}
        </CardDescription>
      </CardHeader>

      {!isVerified && (
        <CardContent className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Подтверждение email повышает безопасность вашего аккаунта и открывает доступ ко всем функциям приложения
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleSendVerification}
              disabled={isSending || !canResend}
              className="flex-1"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {countdown > 0
                    ? `Отправить повторно (${countdown}с)`
                    : "Отправить письмо"}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleCheckVerification}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Проверить статус
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Проверьте папку "Спам" если не видите письмо во входящих
          </p>
        </CardContent>
      )}
    </Card>
  );
}

