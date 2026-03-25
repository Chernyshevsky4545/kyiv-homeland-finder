import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart, LogIn, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AppHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2" style={{ right: '420px' }}>
      {user ? (
        <>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-card/90 backdrop-blur-md border border-border/50 shadow-md hover:bg-card gap-2"
            onClick={() => navigate('/favorites')}
          >
            <Heart className="w-4 h-4 text-destructive" />
            <span className="hidden sm:inline">Обране</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-card/90 backdrop-blur-md border border-border/50 shadow-md hover:bg-card gap-2"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full bg-card/90 backdrop-blur-md border border-border/50 shadow-md hover:bg-card gap-2"
          onClick={() => navigate('/auth')}
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Увійти</span>
        </Button>
      )}
    </div>
  );
}
