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
import { toast } from "sonner";
import { useAppDispatch } from "@/app/store";
import { setUser } from "@/features/user/userSlice";
import { mapFirebaseErrorToMessage } from "@/lib/firebase-errors";
import ParticlesBackground from "@/components/ParticlesBackground";

const signupSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Неверный email адрес"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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
          toast.success("Регистрация через Google выполнена");
          navigate("/dashboard");
        }
      } catch (err: unknown) {
        console.error('Redirect result error:', err);
        toast.error(mapFirebaseErrorToMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    void checkRedirectResult();
  }, [navigate, dispatch]);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const user = await authService.register(data.email, data.password, data.name);
      dispatch(setUser({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      }));
      toast.success("Аккаунт создан! Проверьте вашу почту для подтверждения email.");
      navigate("/verify-email");
    } catch (err: unknown) {
      toast.error(mapFirebaseErrorToMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await authService.googleLogin();
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'REDIRECT_IN_PROGRESS') {
        return;
      }
      toast.error(mapFirebaseErrorToMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-foreground px-4">
      <ParticlesBackground />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Создать аккаунт</CardTitle>
          <CardDescription className="text-center">
            Введите данные чтобы начать
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Иванов" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтвердите пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" data-testid="signup-submit-btn" className="w-full" disabled={isLoading}>
                {isLoading ? "Создание аккаунта..." : "Зарегистрироваться"}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Или</span>
                </div>
              </div>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handleGoogleSignup}
                disabled={isLoading}
              >
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
            Уже есть аккаунт?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
