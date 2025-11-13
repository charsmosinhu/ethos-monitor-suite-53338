import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Monitor, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface Stats {
  totalMachines: number;
  onlineMachines: number;
  activeAlerts: number;
  eventsToday: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalMachines: 0,
    onlineMachines: 0,
    activeAlerts: 0,
    eventsToday: 0,
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchRecentEvents();
    }
  }, [user]);

  const fetchStats = async () => {
    const [machinesResult, alertsResult, eventsResult] = await Promise.all([
      supabase.from('machines').select('*', { count: 'exact' }),
      supabase.from('alerts').select('*', { count: 'exact' }).eq('is_read', false),
      supabase
        .from('events')
        .select('*', { count: 'exact' })
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    ]);

    const onlineMachines = machinesResult.data?.filter((m) => m.status === 'online').length || 0;

    setStats({
      totalMachines: machinesResult.count || 0,
      onlineMachines,
      activeAlerts: alertsResult.count || 0,
      eventsToday: eventsResult.count || 0,
    });
  };

  const fetchRecentEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*, machines(name)')
      .order('created_at', { ascending: false })
      .limit(5);

    setRecentEvents(data || []);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: 'bg-accent',
      warning: 'bg-warning',
      error: 'bg-destructive',
      critical: 'bg-destructive',
    };
    return colors[severity as keyof typeof colors] || 'bg-muted';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Activity className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema de monitoramento</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de Máquinas"
            value={stats.totalMachines}
            icon={Monitor}
            variant="default"
          />
          <StatCard
            title="Máquinas Online"
            value={stats.onlineMachines}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Alertas Ativos"
            value={stats.activeAlerts}
            icon={AlertTriangle}
            variant={stats.activeAlerts > 0 ? 'warning' : 'default'}
          />
          <StatCard
            title="Eventos Hoje"
            value={stats.eventsToday}
            icon={Activity}
            variant="default"
          />
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos Recentes</CardTitle>
            <CardDescription>Últimos 5 eventos registrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhum evento registrado</p>
            ) : (
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-4 rounded-lg border">
                    <div className={`h-2 w-2 rounded-full mt-2 ${getSeverityColor(event.severity)}`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{event.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {event.machines?.name}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
