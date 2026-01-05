import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAppDispatch } from "@/app/store";
import { setUser } from "@/features/user/userSlice";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import ParticlesBackground from "@/components/ParticlesBackground";

const loginSchema = z.object({
  email: z.string().email("Неверный email адрес"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        setIsLoading(true);
        const user = await authService.checkGoogleRedirectResult();
        if (user) {
          dispatch(setUser({
            id: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL
          }));
          showSuccessToast("Вход через Google выполнен");
          navigate("/dashboard");
        }
      } catch (err: unknown) {
        console.error('Redirect result error:', err);
        showErrorToast(err, { context: 'Google Login Redirect' });
      } finally {
        setIsLoading(false);
      }
    };

    void checkRedirectResult();
  }, [navigate, dispatch]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.login(data.email, data.password);
      dispatch(setUser({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      }));
      showSuccessToast("Вход выполнен успешно");
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      showErrorToast(err, { context: 'Login' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.googleLogin();
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'REDIRECT_IN_PROGRESS') {
        return;
      }
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      showErrorToast(err, { context: 'Google Login' });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-foreground px-4">
      <ParticlesBackground />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Добро пожаловать</CardTitle>
          <CardDescription className="text-center">Введите данные для входа в аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && <div data-testid="auth-error" className="text-destructive text-sm font-medium text-center">{error}</div>}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                data-testid="login-submit-btn"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Или продолжить с</span>
                </div>
              </div>

              <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Продолжить с Google
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
