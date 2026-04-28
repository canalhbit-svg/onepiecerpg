# Em Busca do One Piece - Next.js + Firebase Version

Versão moderna do jogo "Em Busca do One Piece" construída com Next.js 14 e Firebase, otimizada para Vercel.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router)
- **UI**: TailwindCSS + Radix UI + Shadcn/ui
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Deploy**: Vercel
- **Linguagem**: TypeScript

## 🛠️ Configuração Rápida

### 1. Clonar o Projeto
```bash
git clone https://github.com/canalhbit-svg/embuscadoonepiece.git
cd embuscadoonepiece
```

### 2. Instalar Dependências
```bash
npm install
# ou
pnpm install
```

### 3. Configurar Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Firestore, Authentication e Storage
3. Copie as credenciais para `.env.local`

### 4. Variáveis de Ambiente
```bash
cp .env.example .env.local
```

Configure as seguintes variáveis:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
```

### 5. Iniciar Desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
├── app/                     # App Router (Next.js 13+)
│   ├── (auth)/             # Rotas de autenticação
│   ├── dashboard/          # Dashboard do jogador
│   ├── game/              # Área do jogo
│   ├── api/               # API Routes
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/             # Componentes React
│   ├── ui/                # Componentes UI básicos
│   ├── sections/          # Seções da página
│   ├── layout/            # Layout components
│   └── providers/         # Context providers
├── lib/                   # Utilitários e configurações
│   ├── firebase.ts        # Configuração Firebase
│   ├── utils.ts           # Funções auxiliares
│   └── types.ts           # Tipos TypeScript
├── hooks/                 # React hooks customizados
├── types/                 # Definições de tipos
├── public/                # Arquivos estáticos
└── styles/                # Estilos adicionais
```

## 🔥 Firebase Services

### Firestore Database
- **Collections**: `users`, `characters`, `parties`, `campaigns`
- **Regras de segurança**: Configuradas em `firestore.rules`
- **Índices**: Otimizados em `firestore.indexes.json`

### Authentication
- Google OAuth
- Email/Password
- Anônimo (para testes)

### Storage
- Avatares de personagens
- Imagens de campanhas
- Arquivos do jogo

## 🎮 Funcionalidades

### Sistema de Personagens
- Criação de personagens customizados
- Classes: Espadachim, Músico, Atirador, etc.
- Sistema de níveis e habilidades

### Sistema de Grupos
- Formação de parties (até 4 jogadores)
- Chat em tempo real
- Sistema de combate cooperativo

### Campanhas
- Criadas por Game Masters
- Sistema de missões e recompensas
- Progressão automática

## 🚀 Deploy no Vercel

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático a cada push para `main`

```bash
# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## 🔧 Scripts Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Linting
npm run lint

# Type checking
npm run typecheck

# Deploy Firebase
npm run firebase:deploy
```

## 🎨 Tema e Estilização

- **Tema**: One Piece (cores: vermelho, azul, dourado)
- **Framework**: TailwindCSS
- **Componentes**: Radix UI + Shadcn/ui
- **Animações**: Framer Motion
- **Dark Mode**: Suporte nativo

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch feature: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Pull Request

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🆚 Vantagens vs Versão Antiga

| Característica | Versão Antiga (Replit) | Nova Versão (Next.js) |
|---|---|---|
| Performance | ❌ Lenta | ✅ Rápida (SSR/SSG) |
| SEO | ❌ Ruim | ✅ Excelente |
| Escalabilidade | ❌ Limitada | ✅ Infinita |
| Deploy | ❌ Manual | ✅ Automático |
| UX | ❌ Carregamentos | ✅ Instantâneo |
| Manutenção | ❌ Complexa | ✅ Simples |
