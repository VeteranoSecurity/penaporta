# 🚀 Roadmap & Próximos Passos - Pé na Porta!

Este arquivo gerencia o progresso das funcionalidades, conteúdos e melhorias da plataforma **Pé na Porta!**.

---

## 📌 Status Atual do Projeto

- [x] **Correção de Infraestrutura & Build**: Arquivo `src/data/mockData.ts` restaurado e validação do TypeScript sem erros.
- [x] **Base de Conhecimento Expandida**: 8 Categorias OWASP configuradas com 80 vulnerabilidades técnicas completas (10 por categoria):
  - [x] **SQL Injection** (10 vulnerabilidades)
  - [x] **Command Injection** (10 vulnerabilidades)
  - [x] **Cross-Site Scripting - XSS** (10 vulnerabilidades)
  - [x] **Server-Side Request Forgery - SSRF** (10 vulnerabilidades)
  - [x] **IDOR & Controle de Acesso** (10 vulnerabilidades)
  - [x] **JWT & Autenticação** (10 vulnerabilidades)
  - [x] **File Inclusion - LFI/RFI** (10 vulnerabilidades)
  - [x] **PHP Bypasses** (10 vulnerabilidades)

---

## 🎯 Próximos Passos & Funcionalidades Pendentes

### 1. 📚 Expansão de Conteúdo (Novas Categorias OWASP)
- [x] **XSS (Cross-Site Scripting)**
  - [x] Reflected XSS (Bypass de WAF via `<svg/onload>`)
  - [x] Stored XSS em Comentários (`<img src=x onerror=fetch(...)>`)
  - [x] DOM-based XSS (Manipulação de `location.hash` / `innerHTML`)
- [x] **SSRF (Server-Side Request Forgery)**
  - [x] Leitura de Metadados Cloud AWS (`169.254.169.254`)
  - [x] SSRF via Localhost IP Parser Bypass (`http://2130706433/admin`)
- [x] **IDOR & Broken Access Control**
  - [x] Manipulação de IDs numéricos em endpoints REST (`GET /api/user/101`)
  - [x] IDOR via Hash/Token previsível (`md5(userId)`)
- [x] **JWT & Autenticação**
  - [x] Bypass via Algoritmo `none`
  - [x] Ataque de chave fraca HMAC (Brute-force offline)
- [x] **File Inclusion (LFI / RFI)**
  - [x] Directory Traversal clássico (`../../../../etc/passwd`)
  - [x] PHP Filter Wrappers (`php://filter/read=convert.base64-encode/...`)

---

### 2. 🖥️ Interface & Experiência do Usuário (UX/UI)
- [x] **Design System & Estética (iOS / Liquid Gel Design)**:
  - [x] Redesenhar a interface com estética inspirada em iOS e conceitos de *Liquid Gel / Glassmorphism* (efeitos translúcidos de vidro, `backdrop-blur`, bordas suaves, cantos super-arredondados `squircle` e micro-interações fluídas).
  - [x] Atualizar tokens visuais (`index.css`) com gradientes líquidos, néon suave e sombras em camadas profundas.
  - [x] Animação de recolher/minimizar estilo macOS Genie (`animate-genie-out` / `animate-genie-in`) aplicada nas transições de categorias.
- [x] **Carrossel 3D macOS Cover Flow em Vidro**: Exibição das 8 categorias na página inicial através de um carrossel 3D destacado em posição de herói (`w-[410px] h-[390px]`), com navegação por setas em vidro, teclado (setas esquerda/direita) e pílulas de paginação translúcidas.
- [x] **Navegação Simplificada**: Removido o botão redundante `Voltar para Categorias` do topo dos detalhes, mantendo a navegação unificada pelo botão `Início` em vidro ao lado do campo de busca.
- [x] **Menu Lateral Vidro Translúcido**: Aplicado o efeito *Liquid Glass* de altíssima definição no menu lateral (`Sidebar`), com iluminação bioluminescente `liquid-orb-sidebar` para garantir a translucidez idêntica aos cards principais.
- [x] **Filtros por Dificuldade**: Badges dinâmicas por nível (*Iniciante*, *Intermediário*, *Avançado*).

---

### 3. 🧪 Playground Interativo
- [x] **Simulador de Vulnerabilidades**: Sandbox para testar e executar os 80 payloads no playground lateral com simulação de respostas.
- [x] **Indicadores Visuais de Resposta Universal**: Tela de confirmação gráfica em estilo *iOS Glass* com selo `✓ Exploração Bem-Sucedida!`, exibição do payload executado e log de resposta do servidor garantida para **todas as 80 vulnerabilidades**.

---

### 4. ⚙️ Qualidade & Testes
- [ ] Criar testes unitários para a validação dos simuladores no Playground.
- [ ] Otimização de acessibilidade e suporte responsivo mobile.
