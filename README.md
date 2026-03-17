# 📡 Broadcast — Sistema SaaS de Mensagens em Massa

## 📖 Sobre
Sistema SaaS para gerenciar conexões, contatos e envio (simulado) de mensagens
em massa com agendamento automático. 100% no plano gratuito do Firebase.

## 🛠️ Tecnologias
- React 18 + TypeScript + Vite
- Material UI v5 + Tailwind CSS
- Firebase Auth + Firestore + Hosting

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- `npm install -g firebase-tools`

### Setup
```bash
cd web && npm install
cp .env.example .env   # preencher com credenciais do Firebase
cd .. && firebase emulators:start   # terminal 1
cd web && npm run dev               # terminal 2
```

## 🔐 Segurança SaaS
Isolamento total por `clientId` = `auth.uid` via Firestore Security Rules.

## 🕐 Dispatcher de Mensagens
Implementado como hook client-side (`useMessageDispatcher`) — sem Cloud Functions
e sem custo. Executa a cada 60 segundos enquanto o app está aberto.
