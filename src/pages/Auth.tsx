import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else if (isLogin) {
      toast.success('Вхід виконано!');
      navigate('/');
    } else {
      toast.success('Перевірте вашу пошту для підтвердження');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> На карту
        </Button>
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">{isLogin ? 'Вхід' : 'Реєстрація'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Увійдіть щоб зберігати обрані об\'єкти' : 'Створіть акаунт'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Зачекайте...' : isLogin ? 'Увійти' : 'Зареєструватися'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Немає акаунту? Зареєструватися' : 'Вже є акаунт? Увійти'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
