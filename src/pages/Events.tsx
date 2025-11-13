import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search } from 'lucide-react';

interface Event {
  id: string;
  event_type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string | null;
  created_at: string;
  machines: {
    name: string;
  } | null;
}

const Events = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, severityFilter]);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*, machines(name)')
      .order('created_at', { ascending: false });

    setEvents(data || []);
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter((event) => event.severity === severityFilter);
    }

    setFilteredEvents(filtered);
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

  const getSeverityLabel = (severity: string) => {
    const labels = {
      info: 'Info',
      warning: 'Atenção',
      error: 'Erro',
      critical: 'Crítico',
    };
    return labels[severity as keyof typeof labels] || severity;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Eventos do Sistema</h1>
          <p className="text-muted-foreground">
            {filteredEvents.length} eventos encontrados
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Atenção</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-2">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-lg font-medium">Nenhum evento encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Ajuste os filtros ou aguarde novos eventos
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Timeline de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {getSeverityLabel(event.severity)}
                      </Badge>
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        {event.machines && (
                          <Badge variant="outline">{event.machines.name}</Badge>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(event.created_at).toLocaleString('pt-BR')}</span>
                        <span>•</span>
                        <span>{event.event_type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Events;
