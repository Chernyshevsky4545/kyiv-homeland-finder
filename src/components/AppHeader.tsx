import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart, LogIn, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AppHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
      {user ? (
        <>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-card/90 backdrop-blur-md border border-border/50 shadow-md hover:bg-card gap-2"
            onClick={() => navigate('/favorites')}
          >
            <Heart className="w-4 h-4 text-destructive" />
            Обране
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-card/90 backdrop-blur-md border border-border/50 shadow-md hover:bg-card gap-2"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            Вийти
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full bg-card/90 backdrop-blur-md border border-border/50 shadow-md hover:bg-card gap-2"
          onClick={() => navigate('/auth')}
        >
          <User className="w-4 h-4" />
          Увійти
        </Button>
      )}
    </div>
  );
}
