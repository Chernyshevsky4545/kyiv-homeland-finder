import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useAdminData';
import { getListingById } from '@/data/listingsService';
import { getListingImage } from '@/lib/listingMedia';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Shield, Trash2, MapPin, Building2, Home, AlertTriangle,
  Clock, User, ChevronDown, ChevronUp, Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Listing } from '@/types/listing';

const REASON_LABELS: Record<string, string> = {
  spam: 'Спам',
  scam: 'Шахрайство',
  inappropriate: 'Неприйнятний вміст',
  other: 'Інше',
};

interface Report {
  id: string;
  listing_id: number;
  user_id: string;
  reason: string;
  description: string | null;
  created_at: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const { data: reports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listing_reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) { console.error('[Admin] Failed to load reports:', error); throw error; }
      console.log('[Admin] Loaded reports:', data?.length);
      return data as Report[];
    },
    enabled: isAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: async (listingId: number) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('deleted_listings')
        .insert({ listing_id: listingId, deleted_by: user.id });
      if (error) {
        if (error.code === '23505') throw new Error('Це оголошення вже видалено');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deleted-listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast.success('Оголошення видалено з маркетплейсу');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { data: deletedIds = [] } = useQuery({
    queryKey: ['deleted-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deleted_listings')
        .select('listing_id');
      if (error) throw error;
      return data.map((d) => d.listing_id);
    },
    enabled: isAdmin,
  });

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Завантаження...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Shield className="w-16 h-16 text-muted-foreground/30" />
        <h1 className="text-xl font-bold font-display text-foreground">Доступ заборонено</h1>
        <p className="text-muted-foreground">У вас немає прав адміністратора</p>
        <Button onClick={() => navigate('/')}>На головну</Button>
      </div>
    );
  }

  // Group reports by listing
  const reportsByListing = reports.reduce<Record<number, Report[]>>((acc, r) => {
    if (!acc[r.listing_id]) acc[r.listing_id] = [];
    acc[r.listing_id].push(r);
    return acc;
  }, {});

  const listingIds = Object.keys(reportsByListing).map(Number);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold font-display">Панель модерації</h1>
          <Badge variant="secondary" className="ml-auto">
            {reports.length} скарг
          </Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {reportsLoading ? (
          <p className="text-center text-muted-foreground py-12">Завантаження скарг...</p>
        ) : listingIds.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Shield className="w-16 h-16 mx-auto text-muted-foreground/30" />
            <h2 className="text-xl font-display font-bold text-foreground">Скарг немає</h2>
            <p className="text-muted-foreground">Наразі жодне оголошення не було оскаржене</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {listingIds.map((listingId) => {
              const listing = getListingById(listingId);
              const listingReports = reportsByListing[listingId];
              const isDeleted = deletedIds.includes(listingId);
              const isExpanded = expandedReport === String(listingId);

              return (
                <div
                  key={listingId}
                  className={`bg-card border rounded-2xl overflow-hidden shadow-sm ${
                    isDeleted ? 'border-destructive/30 opacity-60' : 'border-border/50'
                  }`}
                >
                  {/* Listing header */}
                  <div className="flex items-start gap-4 p-4">
                    {listing ? (
                      <img
                        src={getListingImage(listing)}
                        alt={listing.title}
                        className="w-24 h-20 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-20 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold font-display text-foreground truncate">
                          {listing?.title ?? `Оголошення #${listingId}`}
                        </h3>
                        {isDeleted && (
                          <Badge variant="destructive" className="shrink-0">Видалено</Badge>
                        )}
                      </div>
                      {listing && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{listing.address}, {listing.district}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {listingReports.length} скарг
                        </Badge>
                        {listing && (
                          <span className="text-sm font-bold text-primary">{formatPrice(listing.price)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedReport(isExpanded ? null : String(listingId))}
                        className="gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </Button>
                      {!isDeleted && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => deleteMutation.mutate(listingId)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                          Видалити
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded reports */}
                  {isExpanded && (
                    <div className="border-t border-border/50 bg-muted/30 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Деталі скарг
                      </h4>
                      {listingReports.map((r) => (
                        <div key={r.id} className="bg-card border border-border/50 rounded-xl p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{REASON_LABELS[r.reason] ?? r.reason}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(r.created_at).toLocaleDateString('uk-UA')}
                            </span>
                          </div>
                          {r.description && (
                            <p className="text-sm text-muted-foreground">{r.description}</p>
                          )}
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="font-mono">{r.user_id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
