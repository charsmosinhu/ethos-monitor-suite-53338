import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  machines: {
    name: string;
  } | null;
}

const Alerts = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  const fetchAlerts = async () => {
    const { data } = await supabase
      .from('alerts')
      .select('*, machines(name)')
      .order('created_at', { ascending: false });

    setAlerts(data || []);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, is_read: true } : alert)));
      toast({
        title: 'Alerta marcado como lido',
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: 'bg-accent text-accent-foreground',
      warning: 'bg-warning text-warning-foreground',
      error: 'bg-destructive text-destructive-foreground',
      critical: 'bg-destructive text-destructive-foreground',
    };
    return colors[severity as keyof typeof colors] || 'bg-muted';
  };

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Alertas do Sistema</h1>
          <p className="text-muted-foreground">
            {unreadCount} alertas não lidos de {alerts.length} totais
          </p>
        </div>

        {alerts.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-2">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-lg font-medium">Nenhum alerta registrado</p>
                <p className="text-sm text-muted-foreground">
                  Alertas aparecerão aqui quando houver problemas
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={alert.is_read ? 'opacity-60' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            {alert.machines && (
                              <Badge variant="outline">{alert.machines.name}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.created_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        {!alert.is_read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(alert.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Marcar como lido
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
