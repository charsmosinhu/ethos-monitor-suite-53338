import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Cpu, HardDrive, Activity as ActivityIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Machine {
  id: string;
  name: string;
  hostname: string;
  os: string;
  os_version: string | null;
  ip_address: string | null;
  last_seen: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  cpu_usage: number | null;
  memory_usage: number | null;
  disk_usage: number | null;
}

const Machines = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMachines();
    }
  }, [user]);

  const fetchMachines = async () => {
    const { data } = await supabase
      .from('machines')
      .select('*')
      .order('last_seen', { ascending: false });

    setMachines(data || []);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      online: 'bg-success',
      offline: 'bg-muted',
      warning: 'bg-warning',
      error: 'bg-destructive',
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      online: 'Online',
      offline: 'Offline',
      warning: 'Atenção',
      error: 'Erro',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Máquinas Monitoradas</h1>
          <p className="text-muted-foreground">
            {machines.length} máquinas registradas no sistema
          </p>
        </div>

        {machines.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-2">
                <Monitor className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-lg font-medium">Nenhuma máquina registrada</p>
                <p className="text-sm text-muted-foreground">
                  As máquinas aparecerão aqui quando o agente for instalado
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {machines.map((machine) => (
              <Card key={machine.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{machine.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{machine.hostname}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(machine.status)} text-white border-0`}
                    >
                      {getStatusLabel(machine.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sistema</span>
                      <span className="font-medium">
                        {machine.os} {machine.os_version}
                      </span>
                    </div>
                    {machine.ip_address && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">IP</span>
                        <span className="font-mono">{machine.ip_address}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Última conexão</span>
                      <span>{new Date(machine.last_seen).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>

                  {(machine.cpu_usage || machine.memory_usage || machine.disk_usage) && (
                    <div className="space-y-3 pt-3 border-t">
                      {machine.cpu_usage !== null && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Cpu className="h-4 w-4 text-muted-foreground" />
                              <span>CPU</span>
                            </div>
                            <span className="font-medium">{machine.cpu_usage}%</span>
                          </div>
                          <Progress value={machine.cpu_usage} />
                        </div>
                      )}
                      {machine.memory_usage !== null && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Memória</span>
                            </div>
                            <span className="font-medium">{machine.memory_usage}%</span>
                          </div>
                          <Progress value={machine.memory_usage} />
                        </div>
                      )}
                      {machine.disk_usage !== null && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <HardDrive className="h-4 w-4 text-muted-foreground" />
                              <span>Disco</span>
                            </div>
                            <span className="font-medium">{machine.disk_usage}%</span>
                          </div>
                          <Progress value={machine.disk_usage} />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Machines;
