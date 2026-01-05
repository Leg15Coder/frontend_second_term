import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "@/services/authService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function EmailVerifiedPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const oobCode = searchParams.get("oobCode");
      const mode = searchParams.get("mode");

      if (mode !== "verifyEmail" || !oobCode) {
        setStatus("error");
        setErrorMessage("Неверная ссылка подтверждения");
        return;
      }

      try {
        await authService.verifyEmailCode(oobCode);
        setStatus("success");

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } catch (err: unknown) {
        setStatus("error");
        const message = err instanceof Error ? err.message : "Не удалось подтвердить email";
        setErrorMessage(message);
      }
    };

    void verifyEmail();
  }, [searchParams, navigate]);

  const handleContinue = () => {
    if (status === "success") {
      navigate("/dashboard");
    } else {
      navigate("/verify-email");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-foreground px-4">
      <ParticlesBackground />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <div className="rounded-full bg-blue-100 p-3">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>

          <CardTitle className="text-2xl font-bold text-center">
            {status === "loading" && "Подтверждение email..."}
            {status === "success" && "Email подтвержден!"}
            {status === "error" && "Ошибка подтверждения"}
          </CardTitle>

          <CardDescription className="text-center">
            {status === "loading" && "Пожалуйста, подождите"}
            {status === "success" && "Ваш email успешно подтвержден. Сейчас вы будете перенаправлены на главную страницу."}
            {status === "error" && errorMessage}
          </CardDescription>
        </CardHeader>

        {status !== "loading" && (
          <CardContent>
            <Button onClick={handleContinue} className="w-full">
              {status === "success" ? "Перейти к приложению" : "Запросить новое письмо"}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

