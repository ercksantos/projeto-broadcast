# 📡 Broadcast — Sistema SaaS de Mensagens em Massa

## 🌐 Produção
**https://broadcast-a963f.web.app**

## 📖 Sobre
Sistema SaaS para gerenciar conexões, contatos e envio (simulado) de mensagens
em massa com agendamento automático. 100% no plano gratuito do Firebase (Spark).

## 🛠️ Tecnologias
| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript + Vite 6 |
| UI | Material UI v6 + Tailwind CSS v3 |
| Auth | Firebase Authentication |
| Banco de dados | Firebase Firestore (tempo real) |
| Deploy | Firebase Hosting (plano Spark — gratuito) |

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- `npm install -g firebase-tools`
- Java 11+ (para os emuladores Firebase)

### Setup
```bash
# Instalar dependências
cd web && npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais Firebase e VITE_USE_EMULATOR=true

# Terminal 1 — emuladores Firebase
cd .. && firebase emulators:start

# Terminal 2 — servidor de desenvolvimento
cd web && npm run dev
```

Acesse: http://localhost:3000 | Emulator UI: http://localhost:4000

## 🔐 Segurança SaaS
Isolamento total por `clientId` = `auth.uid` via Firestore Security Rules.
Cada usuário acessa exclusivamente seus próprios dados — garantido no servidor,
sem depender de lógica client-side.

## 🕐 Dispatcher de Mensagens
Implementado como hook client-side (`useMessageDispatcher`) — sem Cloud Functions
e sem custo. Executa a cada 60 segundos enquanto o app está aberto.
Mensagens com `scheduledAt` no passado já nascem com status `sent`.

## 🧠 Decisões Técnicas

### Por que sem Cloud Functions?
Cloud Functions com Pub/Sub agendado exige o plano Blaze (pago). O dispatcher
foi implementado como hook client-side (`useMessageDispatcher`) com polling de
60 segundos — comportamento idêntico, custo zero.

### Por que sem subcoleções no Firestore?
Coleções planas com `clientId` permitem queries simples e security rules
centralizadas. Subcoleções dificultam queries cruzadas desnecessariamente.

### Por que paradigma funcional?
Mais previsível, testável e alinhado com a natureza do React (hooks são funções).
Nenhuma `class` foi utilizada na aplicação — apenas funções puras, hooks
customizados e composição.

### Por que Vite?
10-100x mais rápido que CRA em desenvolvimento, com HMR nativo e bundle
otimizado para produção.

## 📁 Estrutura
```
broadcast/
├── web/
│   └── src/
│       ├── components/   # PrivateRoute, ConfirmDeleteDialog, AppShell
│       ├── contexts/     # AuthContext
│       ├── hooks/        # useConnections, useContacts, useMessages,
│       │                 # useMessageDispatcher, useNotify
│       ├── lib/          # firebase.ts (SDK + emuladores)
│       ├── pages/        # Auth, Connections, Contacts, Messages
│       ├── services/     # auth, connections, contacts, messages
│       ├── theme/        # MUI theme
│       └── types/        # tipos globais TypeScript
├── firestore.rules       # Security Rules
├── firebase.json
└── .firebaserc
```
