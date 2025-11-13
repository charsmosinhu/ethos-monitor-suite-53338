import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Activity, Shield, Monitor, Bell } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <Activity className="h-16 w-16 text-primary" />
            <h1 className="text-5xl font-bold">MonitorX</h1>
          </div>

          <p className="text-2xl text-muted-foreground">
            Sistema Corporativo de Monitoramento Remoto
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitore suas máquinas em tempo real com segurança, transparência e conformidade com LGPD.
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Acessar Sistema
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-lg bg-card border space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Monitoramento em Tempo Real</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhe métricas de CPU, memória, disco e eventos do sistema
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Segurança e Privacidade</h3>
              <p className="text-sm text-muted-foreground">
                Criptografia ponta-a-ponta e controle total sobre seus dados
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Alertas Inteligentes</h3>
              <p className="text-sm text-muted-foreground">
                Notificações em tempo real sobre eventos críticos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
