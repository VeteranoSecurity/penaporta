# 🚀 Roadmap & Próximos Passos - Pé na Porta!

Este arquivo gerencia o progresso das funcionalidades, conteúdos e melhorias da plataforma **Pé na Porta!**.

---

## 📌 Status Atual do Projeto

- [x] **Correção de Infraestrutura & Build**: Arquivo `src/data/mockData.ts` restaurado e validação do TypeScript sem erros.
- [x] **Base de Conhecimento Inicial**: 3 Categorias essenciais configuradas com 9 vulnerabilidades e guias de mindset:
  - [x] **SQL Injection**: Login Bypass, Time-Based Blind e Auth Bypass via UNION.
  - [x] **Command Injection**: Concatenação Simples, Bypass de Espaço (`$IFS`) e Out-of-Band (OAST).
  - [x] **PHP Bypasses**: Webshell Simples, Bypass de Extensão e Type Juggling.

---

## 🎯 Próximos Passos & Funcionalidades Pendentes

### 1. 📚 Expansão de Conteúdo (Novas Categorias OWASP)
- [ ] **XSS (Cross-Site Scripting)**
  - [ ] Stored XSS (Injeção em comentários/perfil)
  - [ ] Reflected XSS (Bypass de filtros básicos de caracteres)
  - [ ] DOM-based XSS (Manipulação de `location.hash` / `innerHTML`)
- [ ] **SSRF (Server-Side Request Forgery)**
  - [ ] Leitura de Metadados Cloud (AWS `169.254.169.254` / GCP)
  - [ ] SSRF via URL parser bypass (`http://127.0.0.1` vs `http://2130706433`)
- [ ] **IDOR & Broken Access Control**
  - [ ] Manipulação de IDs numéricos simples em endpoints REST (`GET /api/user/102`)
  - [ ] IDOR via UUID v1 / Hashing previsível
- [ ] **JWT & Autenticação**
  - [ ] Bypass via Algoritmo `none`
  - [ ] Ataque de chave fraca (HMAC secret brute force)
- [ ] **File Inclusion (LFI / RFI)**
  - [ ] Traversal clássico (`../../../../etc/passwd`)
  - [ ] PHP Wrappers (`php://filter/read=convert.base64-encode/resource=index.php`)

---

### 2. 🖥️ Interface & Experiência do Usuário (UX/UI)
- [x] **Design System & Estética (iOS / Liquid Gel Design)**:
  - [x] Redesenhar a interface com estética inspirada em iOS e conceitos de *Liquid Gel / Glassmorphism* (efeitos translúcidos de vidro, `backdrop-blur`, bordas suaves, cantos super-arredondados `squircle` e micro-interações fluídas).
  - [x] Atualizar tokens visuais (`index.css`) com gradientes líquidos, néon suave e sombras em camadas profundas.
  - [x] Animação de recolher/minimizar estilo macOS Genie (`animate-genie-out` / `animate-genie-in`) aplicada nas transições de categorias.
- [ ] **Busca Global**: Adicionar input de busca na sidebar ou topo para filtrar vulnerabilidades por nome, tag ou payload.
- [ ] **Marcador de Progresso (Checklist do Aluno)**: Botão de "Concluído" em cada vulnerabilidade para salvar progresso via `localStorage`.
- [ ] **Exportação de Cheatsheet**: Botão para copiar/baixar todos os payloads de uma categoria em formato Markdown ou JSON.
- [ ] **Filtros por Dificuldade / Tipo**: Filtrar por nível (Iniciante, Intermediário, Avançado).

---

### 3. 🧪 Playground Interativo
- [ ] **Simulador de XSS**: Sandbox segura para executar e visualmente comprovar execução de payloads JS no playground.
- [ ] **Simulador de LFI**: Emulador de leitura de arquivos que retorna estruturas `/etc/passwd` dinâmicas.
- [ ] **Indicadores Visuais de Resposta**: Melhorar feedback gráfico quando o payload digitado for bem-sucedido no teste.

---

### 4. ⚙️ Qualidade & Testes
- [ ] Criar testes unitários para a validação dos simuladores no Playground.
- [ ] Otimização de acessibilidade e suporte responsivo mobile.
