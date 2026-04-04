import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { Heart, LogIn, LogOut, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AppHeader() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
      {user ? (
        <>
          {isAdmin && (
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full bg-card backdrop-blur-md border border-border/50 shadow-lg hover:bg-card/90 gap-2 text-black font-medium px-4"
              onClick={() => navigate('/admin')}
            >
              <Shield className="w-4 h-4 text-primary" />
              <span>Модерація</span>
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-card backdrop-blur-md border border-border/50 shadow-lg hover:bg-card/90 gap-2 text-black font-medium px-4"
            onClick={() => navigate('/favorites')}
          >
            <Heart className="w-4 h-4 text-destructive" />
            <span>Обране</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-card backdrop-blur-md border border-border/50 shadow-lg hover:bg-card/90 gap-2 text-black font-medium px-4"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            <span>Вийти</span>
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full bg-card backdrop-blur-md border border-border/50 shadow-lg hover:bg-card/90 gap-2 text-black font-medium px-4"
          onClick={() => navigate('/auth')}
        >
          <User className="w-4 h-4" />
          <span>Увійти</span>
        </Button>
      )}
    </div>
  );
}
