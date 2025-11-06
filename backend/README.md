# Backend

| App                | Responsável (resumo direto)                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| **core**           | Configuração central do projeto (settings, URLs raiz, ASGI/WSGI, integrações globais). |
| **userauths**      | Autenticação e contas: cadastro, login, tokens/JWT e papéis (paciente/médico).         |
| **agents**         | Orquestração de fluxos/IA do produto e endpoints operacionais do núcleo.               |
| **voice_sessions** | Sessões de voz: criação, upload, processamento/AI e armazenamento de métricas.         |
| **analytics**      | KPIs e tendências: agregações por paciente/médico e dados para gráficos do dashboard.  |
| **care_plans**     | Planos de cuidado e tarefas: metas, protocolos e acompanhamento de adesão.             |
| **messaging**      | Mensagens e notificações: conversas paciente↔profissional e alertas de eventos/risco.  |
| **audit**          | Auditoria e conformidade: trilhas de acesso, consentimentos e logs (LGPD/compliance).  |
