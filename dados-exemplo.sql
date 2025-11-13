-- Script SQL para popular o banco de dados com dados de exemplo/demonstração
-- Execute este script no Cloud Dashboard > Database > SQL Editor

-- IMPORTANTE: Este script é apenas para demonstração
-- Em produção, os dados virão do agente instalado nas máquinas

-- Inserir máquinas de exemplo
INSERT INTO public.machines (name, hostname, os, os_version, ip_address, status, cpu_usage, memory_usage, disk_usage, last_seen)
VALUES
  ('Servidor Web Principal', 'web-srv-01', 'Ubuntu', '22.04 LTS', '192.168.1.10', 'online', 45.2, 68.5, 52.1, NOW() - INTERVAL '5 minutes'),
  ('Servidor Banco de Dados', 'db-srv-01', 'Ubuntu', '22.04 LTS', '192.168.1.11', 'online', 72.8, 85.3, 68.9, NOW() - INTERVAL '2 minutes'),
  ('Estação RH - Maria', 'rh-maria-pc', 'Windows', '11 Pro', '192.168.1.50', 'online', 25.5, 45.2, 38.7, NOW() - INTERVAL '1 minute'),
  ('Estação Dev - João', 'dev-joao-pc', 'macOS', '14 Sonoma', '192.168.1.51', 'online', 88.3, 92.1, 75.4, NOW() - INTERVAL '30 seconds'),
  ('Servidor Backup', 'backup-srv-01', 'Ubuntu', '20.04 LTS', '192.168.1.12', 'warning', 15.2, 38.9, 88.5, NOW() - INTERVAL '10 minutes'),
  ('Estação Financeiro', 'fin-carlos-pc', 'Windows', '11 Pro', '192.168.1.52', 'offline', NULL, NULL, NULL, NOW() - INTERVAL '2 hours'),
  ('Servidor Email', 'mail-srv-01', 'Ubuntu', '22.04 LTS', '192.168.1.13', 'error', 92.5, 95.8, 55.2, NOW() - INTERVAL '5 minutes')
ON CONFLICT DO NOTHING;

-- Inserir eventos de exemplo
-- Primeiro, precisamos pegar os IDs das máquinas
WITH machine_ids AS (
  SELECT id, name FROM public.machines
)
INSERT INTO public.events (machine_id, event_type, severity, title, description, metadata)
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Servidor Web Principal'),
  'system.startup',
  'info',
  'Sistema iniciado com sucesso',
  'O servidor web foi reiniciado e todos os serviços estão operacionais',
  '{"uptime": "45 minutes", "services": ["nginx", "php-fpm"]}'::jsonb
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Servidor Web Principal')
UNION ALL
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Servidor Banco de Dados'),
  'performance.high_cpu',
  'warning',
  'Uso elevado de CPU detectado',
  'CPU acima de 70% por mais de 5 minutos. Query lenta identificada.',
  '{"cpu_percent": 72.8, "duration": "8 minutes", "query_id": "slow_query_123"}'::jsonb
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Servidor Banco de Dados')
UNION ALL
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Estação Dev - João'),
  'performance.high_memory',
  'warning',
  'Memória próxima do limite',
  'Uso de memória em 92%. Considere fechar aplicações não utilizadas.',
  '{"memory_percent": 92.1, "top_processes": ["chrome", "docker", "vscode"]}'::jsonb
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Estação Dev - João')
UNION ALL
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Servidor Backup'),
  'storage.high_usage',
  'error',
  'Disco quase cheio',
  'Uso de disco em 88.5%. Limpeza urgente necessária.',
  '{"disk_percent": 88.5, "available_gb": 45, "path": "/var/backups"}'::jsonb
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Servidor Backup')
UNION ALL
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Servidor Email'),
  'service.failure',
  'critical',
  'Serviço de email parou de responder',
  'O servidor de email não está respondendo. Ação imediata necessária.',
  '{"service": "postfix", "last_response": "5 minutes ago", "error": "connection timeout"}'::jsonb
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Servidor Email')
UNION ALL
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Estação Financeiro'),
  'connection.lost',
  'error',
  'Conexão perdida',
  'Máquina não responde há mais de 2 horas.',
  '{"last_seen": "2 hours ago", "ping_failed": true}'::jsonb
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Estação Financeiro')
UNION ALL
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Estação RH - Maria'),
  'security.login_success',
  'info',
  'Login realizado com sucesso',
  'Usuário maria.silva fez login às 09:15',
  '{"user": "maria.silva", "time": "09:15", "ip": "192.168.1.50"}'::jsonb
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Estação RH - Maria')
UNION ALL
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Servidor Web Principal'),
  'security.update_available',
  'warning',
  'Atualizações de segurança disponíveis',
  '15 pacotes de segurança precisam ser atualizados',
  '{"packages": 15, "critical": 3, "important": 8, "moderate": 4}'::jsonb
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Servidor Web Principal');

-- Inserir alertas de exemplo
WITH machine_ids AS (
  SELECT id, name FROM public.machines
)
INSERT INTO public.alerts (machine_id, severity, title, message, is_read)
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Servidor Email'),
  'critical',
  'Servidor de Email Offline',
  'O servidor de email parou de responder. Usuários não conseguem enviar ou receber emails. Ação urgente necessária.',
  false
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Servidor Email')
UNION ALL
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Servidor Backup'),
  'error',
  'Disco do Servidor de Backup Quase Cheio',
  'O disco do servidor de backup está com 88.5% de uso. Risco de falha no backup noturno. Limpeza urgente recomendada.',
  false
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Servidor Backup')
UNION ALL
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Estação Financeiro'),
  'error',
  'Estação do Financeiro Não Responde',
  'A estação de trabalho do setor financeiro está offline há mais de 2 horas. Verificar conectividade.',
  false
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Estação Financeiro')
UNION ALL
SELECT 
  (SELECT id FROM machine_ids WHERE name = 'Servidor Banco de Dados'),
  'warning',
  'Uso Alto de CPU no Banco de Dados',
  'O servidor de banco de dados está com CPU em 72.8% há mais de 5 minutos. Investigar queries lentas.',
  true
WHERE EXISTS (SELECT 1 FROM machine_ids WHERE name = 'Servidor Banco de Dados')
UNION ALL
SELECT 
  NULL,
  'info',
  'Manutenção Programada',
  'Manutenção programada no datacenter no próximo sábado, 20/01, das 02:00 às 06:00. Alguns serviços podem ficar indisponíveis.',
  true;

-- Verificar dados inseridos
SELECT 'Máquinas inseridas:' as info, COUNT(*) as total FROM public.machines
UNION ALL
SELECT 'Eventos inseridos:', COUNT(*) FROM public.events
UNION ALL
SELECT 'Alertas inseridos:', COUNT(*) FROM public.alerts;
