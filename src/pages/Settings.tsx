import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Shield, Users } from 'lucide-react';

const Settings = () => {
  const { user, loading, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    if (!loading && role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, loading, role, navigate]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerenciar configurações do sistema</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Segurança</CardTitle>
              </div>
              <CardDescription>
                Configurações de segurança e privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Autenticação de dois fatores (2FA) - Em breve
              </p>
              <p className="text-sm text-muted-foreground">
                • Políticas de senha
              </p>
              <p className="text-sm text-muted-foreground">
                • Logs de auditoria
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Usuários</CardTitle>
              </div>
              <CardDescription>Gerenciar usuários e permissões</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Adicionar novos usuários
              </p>
              <p className="text-sm text-muted-foreground">
                • Gerenciar roles (Admin/Viewer)
              </p>
              <p className="text-sm text-muted-foreground">
                • Histórico de acesso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                <CardTitle>Sistema</CardTitle>
              </div>
              <CardDescription>Configurações gerais do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Retenção de dados
              </p>
              <p className="text-sm text-muted-foreground">
                • Frequência de coleta
              </p>
              <p className="text-sm text-muted-foreground">
                • Notificações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance</CardTitle>
              <CardDescription>LGPD e políticas de privacidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Termo de consentimento
              </p>
              <p className="text-sm text-muted-foreground">
                • Exclusão de dados
              </p>
              <p className="text-sm text-muted-foreground">
                • Relatórios de privacidade
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
