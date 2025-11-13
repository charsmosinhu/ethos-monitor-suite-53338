# MonitorX - Sistema Corporativo de Monitoramento Remoto

## Visão Geral

O MonitorX é um sistema corporativo de monitoramento remoto que permite acompanhar métricas e eventos de máquinas (Windows/macOS/Linux) através de um dashboard web centralizado.

## Funcionalidades Implementadas

### 🔐 Autenticação e Autorização
- **Sistema de login/cadastro** com email e senha
- **RBAC (Role-Based Access Control)** com dois níveis:
  - **Admin**: Acesso total (visualização, criação, edição, exclusão)
  - **Viewer**: Apenas visualização
- **Primeiro usuário** registrado automaticamente se torna admin
- Autenticação segura com Lovable Cloud (Supabase)

### 📊 Dashboard Principal
- Visão geral com métricas agregadas:
  - Total de máquinas monitoradas
  - Máquinas online
  - Alertas ativos
  - Eventos registrados hoje
- Timeline dos 5 eventos mais recentes

### 💻 Gerenciamento de Máquinas
- Lista completa de máquinas monitoradas
- Informações detalhadas de cada máquina:
  - Nome e hostname
  - Sistema operacional e versão
  - Endereço IP
  - Status (online/offline/warning/error)
  - Última conexão
  - Métricas em tempo real:
    - Uso de CPU (%)
    - Uso de memória (%)
    - Uso de disco (%)

### 📝 Eventos do Sistema
- Timeline completa de eventos
- Filtros avançados:
  - Busca por texto (título/descrição)
  - Filtro por severidade (info/warning/error/critical)
- Classificação por tipo de evento
- Metadata adicional em formato JSON

### 🔔 Alertas
- Sistema de alertas com diferentes níveis de severidade
- Marcação de alertas como lidos
- Associação com máquinas específicas
- Notificações visuais no dashboard

### ⚙️ Configurações (Admin apenas)
- Painel de configurações futuras:
  - Segurança (2FA, políticas de senha)
  - Gerenciamento de usuários
  - Configurações de sistema
  - Compliance e LGPD

## Estrutura do Banco de Dados

### Tabelas Principais

#### `profiles`
Armazena informações dos usuários
- `id`: UUID (referência a auth.users)
- `full_name`: Nome completo
- `email`: Email do usuário
- `created_at`, `updated_at`: Timestamps

#### `user_roles`
Gerencia roles dos usuários (admin/viewer)
- `id`: UUID
- `user_id`: Referência ao usuário
- `role`: Enum (admin, viewer)
- `created_at`: Timestamp

#### `machines`
Máquinas monitoradas
- `id`: UUID
- `name`: Nome da máquina
- `hostname`: Hostname
- `os`: Sistema operacional
- `os_version`: Versão do SO
- `ip_address`: Endereço IP
- `last_seen`: Última conexão
- `status`: Enum (online, offline, warning, error)
- `cpu_usage`, `memory_usage`, `disk_usage`: Métricas (%)
- `created_at`, `updated_at`: Timestamps

#### `events`
Eventos do sistema
- `id`: UUID
- `machine_id`: Referência à máquina
- `event_type`: Tipo do evento
- `severity`: Enum (info, warning, error, critical)
- `title`: Título do evento
- `description`: Descrição detalhada
- `metadata`: Dados adicionais em JSON
- `created_at`: Timestamp

#### `alerts`
Alertas do sistema
- `id`: UUID
- `machine_id`: Referência à máquina (opcional)
- `severity`: Enum (info, warning, error, critical)
- `title`: Título do alerta
- `message`: Mensagem detalhada
- `is_read`: Status de leitura
- `created_at`: Timestamp

## Segurança e Privacidade

### Row Level Security (RLS)
Todas as tabelas possuem políticas RLS ativas:
- Usuários só podem ver seus próprios perfis
- Apenas admins podem criar/modificar/deletar máquinas
- Todos autenticados podem visualizar máquinas e eventos
- Usuários podem marcar seus alertas como lidos

### Função de Verificação de Roles
```sql
public.has_role(user_id, role)
```
Função segura (SECURITY DEFINER) para verificar permissões sem recursão.

### Criptografia
- Senhas criptografadas automaticamente pelo sistema de autenticação
- Comunicação segura via HTTPS
- Tokens de sessão gerenciados pelo Lovable Cloud

## Design System

### Cores Corporativas
- **Primary**: Azul corporativo (#1E3A8A)
- **Accent**: Azul vibrante para destaques
- **Success**: Verde para status OK
- **Warning**: Amarelo/laranja para avisos
- **Destructive**: Vermelho para erros críticos

### Componentes Reutilizáveis
- **StatCard**: Cards de estatísticas com ícones e trends
- **DashboardLayout**: Layout consistente com sidebar
- **Badge**: Badges coloridos por status/severidade

## Como Usar

### 1. Primeiro Acesso
1. Acesse o sistema
2. Clique em "Acessar Sistema"
3. Vá para aba "Cadastro"
4. Preencha nome, email e senha
5. O primeiro usuário será automaticamente admin

### 2. Adicionar Dados de Demonstração
Execute o script SQL fornecido em `dados-exemplo.sql` no Cloud Dashboard para popular o banco com dados de teste.

### 3. Navegação
- **Dashboard**: Visão geral e métricas
- **Máquinas**: Lista de todas as máquinas
- **Eventos**: Timeline de eventos
- **Alertas**: Alertas do sistema
- **Configurações**: Apenas para admins

## Próximos Passos (Roadmap)

### Funcionalidades Futuras

#### Agente de Monitoramento
- [ ] Desenvolvimento do agente para Windows/macOS/Linux
- [ ] Coleta automática de métricas
- [ ] Envio seguro de dados via API
- [ ] Instaladores (MSI/pkg/deb/rpm)

#### Recursos Avançados
- [ ] 2FA (autenticação de dois fatores)
- [ ] Export de relatórios (CSV/PDF)
- [ ] Gráficos históricos de métricas
- [ ] Alertas por email/SMS
- [ ] Captura de tela com consentimento
- [ ] Logs do sistema filtrados
- [ ] Inventário automático de software

#### Compliance e Privacidade
- [ ] Termo de consentimento informado
- [ ] Mecanismo de exclusão completa de dados
- [ ] Relatórios de conformidade LGPD
- [ ] Assinatura digital de eventos
- [ ] Criptografia end-to-end de dados sensíveis

#### Melhorias de UI/UX
- [ ] Dark mode
- [ ] Notificações em tempo real (WebSocket)
- [ ] Filtros salvos
- [ ] Dashboards personalizáveis
- [ ] Mobile app

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Hosting**: Lovable

## Conformidade Legal

### LGPD (Lei Geral de Proteção de Dados)
O sistema foi projetado considerando os princípios da LGPD:
- **Consentimento**: Instalação apenas com autorização
- **Finalidade**: Monitoramento corporativo autorizado
- **Minimização**: Coleta apenas dados necessários
- **Segurança**: Criptografia e controle de acesso
- **Direito ao esquecimento**: Mecanismo de exclusão de dados

### Termo de Consentimento
Veja `TERMO-DE-CONSENTIMENTO.md` para o modelo de termo que deve ser apresentado aos usuários.

## Suporte e Contato

Para dúvidas ou suporte:
- Email: suporte@monitorx.example.com
- Documentação: Esta documentação
- Issues: Use o sistema de issues do repositório

---

**Última atualização**: 2025-01-13
**Versão**: 1.0.0
