# Em Busca do One Piece - Vercel + Firebase Version

Versão do jogo "Em Busca do One Piece" otimizada para Vercel e Firebase.

## 🚀 Deploy

### Vercel
- Frontend hospedado no Vercel
- Build automático a cada push
- Deploy preview para PRs

### Firebase
- Firestore Database para dados do jogo
- Firebase Authentication para login
- Firebase Storage para arquivos

## 🛠️ Configuração Local

1. Clone o repositório:
```bash
git clone https://github.com/canalhbit-svg/embuscadoonepiece.git
cd embuscadoonepiece
```

2. Instale as dependências:
```bash
npm install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite .env com suas credenciais do Firebase
```

4. Inicie o desenvolvimento:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
├── artifacts/
│   ├── one-piece-rpg/          # Frontend React
│   └── api-server/             # API Backend
├── firebase.json               # Configuração Firebase
├── vercel.json                 # Configuração Vercel
├── firestore.rules             # Regras Firestore
├── storage.rules               # Regras Storage
└── .env.example                # Variáveis de ambiente
```

## 🔥 Firebase Setup

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Configure Firestore Database
3. Configure Authentication
4. Configure Storage
5. Copie as credenciais para o `.env`

## 📦 Deploy no Vercel

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático!

## 🎮 Funcionalidades

- Sistema de criação de personagens
- Gestão de grupos de aventura
- Sistema de combate baseado em turnos
- Chat em tempo real
- Inventário e itens

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
