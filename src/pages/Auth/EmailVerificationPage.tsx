import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Mail, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function EmailVerificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const isVerified = await authService.checkEmailVerified();
        if (isVerified) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Error checking verification:", err);
      }
    };

    void checkVerification();
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await authService.sendVerificationEmail();
      toast.success("Письмо отправлено повторно. Проверьте вашу почту.");
      setCanResend(false);
      setCountdown(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Не удалось отправить письмо";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsLoading(true);
    try {
      const isVerified = await authService.checkEmailVerified();
      if (isVerified) {
        toast.success("Email успешно подтвержден!");
        navigate("/dashboard");
      } else {
        toast.info("Email еще не подтвержден. Проверьте почту и перейдите по ссылке из письма.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ошибка проверки";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-foreground px-4">
      <ParticlesBackground />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Подтвердите ваш email</CardTitle>
          <CardDescription className="text-center">
            Мы отправили письмо с ссылкой для подтверждения на вашу почту
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Проверьте папку "Спам" если не видите письмо во входящих
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              onClick={handleCheckVerification} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Я подтвердил email
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleResendEmail}
              className="w-full"
              disabled={isResending || !canResend}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {countdown > 0 
                    ? `Отправить повторно (${countdown}с)` 
                    : "Отправить письмо повторно"}
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full"
            >
              Пропустить (можно подтвердить позже)
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Не получили письмо?</p>
            <p className="mt-1">
              Проверьте правильность адреса email или попробуйте отправить письмо повторно
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

