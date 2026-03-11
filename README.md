<div align="center">
  <h1>💻 Pé na Porta! 🚪</h1>
  <p><strong>Plataforma Educacional de Cybersecurity & Pentest Cheat Sheets</strong></p>
</div>

---

## 📖 Sobre o Projeto

**Pé na Porta!** é um **Mínimo Produto Viável (MVP)** focado em facilitar a vida de estudantes de cibersegurança e pentesters. A plataforma serve como um repositório rápido e acessível para *Cheat Sheets* e *Payloads* de diversas tecnologias e vulnerabilidades comuns.

Esta aplicação foi desenvolvida focando na melhor experiência de uso, com tecnologias modernas de Frontend e uma imersiva **Estética Hacker** (_Dark Mode, tons profundos e detalhes em Neon Ciano e Verde Limão_).

## 🚀 Funcionalidades

- **Navegação Dinâmica:** Selecione tecnologias através de uma interface de cards intuitiva.
- **Categorias Iniciais:** Dados pré-configurados cobrindo categorias-chave: *SQL Injection*, *Command Injection* e *PHP Bypasses*.
- **Lista de Vulnerabilidades:** Visualização detalhada indicando cenários específicos de ataque para cada tecnologia.
- **Cópia de Payload Rápida:** Botão "Copiar para a Área de Transferência" nativo (_Clipboard API_) para agilidade em testes.
- **Estética Hacker & UI Moderna:** Componentes reativos com Tailwind e 100% responsiva para Mobile, Tablet e Desktop.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes ferramentas:

- **[React (v18+)](https://react.dev/)** - Construção de UI.
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática e segurança.
- **[Vite](https://vitejs.dev/)** - Setup do ecossistema e servidor dev ultrarrápido.
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Motor de estilização responsivo e design system.
- **[Lucide React](https://lucide.dev/)** - Iconografia moderna.

## ⚙️ Instalação e Execução

Siga os passos abaixo para rodar o projeto na sua máquina:

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/penaporta.git
cd penaporta
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o Servidor de Desenvolvimento
```bash
npm run dev
```

> **Acesso Local:** A aplicação estará disponível em `http://localhost:5173`.

## 📁 Estrutura de Arquivos

Abaixo, a arquitetura base do MVP que facilita expansões (adição de novos Tópicos):

```text
penaporta/
├── public/                 # Assets públicos estáticos
├── src/
│   ├── components/         # Componentes React Reutilizáveis
│   │   ├── Header.tsx      # Cabeçalho com o nome e subtítulo
│   │   ├── TopicCard.tsx   # Card com interações Neon para as tecnologias
│   │   └── TopicDetails.tsx# Visualização das vulnerabilidades e os blocos de código
│   ├── data/               
│   │   └── mockData.ts     # Base de dados Mockada (Interfaces e objetos de Payloads)
│   ├── App.tsx             # Componente raiz
│   ├── index.css           # Configurações globais e variáveis do Tailwind (Neon Hacking Theme)
│   └── main.tsx            # Ponto de entrada reactDOM
├── index.html              # Template principal
├── package.json            # Dependências e scripts
├── tsconfig.json           # Configuração do TypeScript
└── vite.config.ts          # Config do Vite integrado ao Tailwind v4
```

---

<div align="center">
  <p>Feito com 💚 e muito código pela automatização de relatórios/cheats! ⚡</p>
</div>
