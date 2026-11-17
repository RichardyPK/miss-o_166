# RELATÓRIO DE TESTES DE SOFTWARE

## 1\. Identificação do projeto

| Informação | Descrição |
| --- | --- |
| **Nome do projeto:** | \[Academia Viva – Landing Page\] |
| **Resumo do projeto:** | \[Landing page responsiva de uma empresa de cursos online e presenciais. A aplicação lista os cursos (com filtro por modalidade) e recebe o cadastro de interessados por meio de um formulário de contato, usando uma API em Express com banco SQLite.\] |
| **Nome do testador:** | \[Richardy de Oliveira Coutinho\] |
| **Data dos testes:** | \[17/11/2026\] |
| **Tecnologias utilizadas:** | \[JavaScript, Node.js, Express, SQLite, Jest, Supertest\] |

---

## 2\. Objetivo dos testes

Descreva qual foi o objetivo da realização dos testes na aplicação.

- Qual funcionalidade foi testada?
- O que os testes pretendiam verificar?
- Quais possíveis erros ou falhas deveriam ser identificados?

**Resposta:**

\[Foram testadas as funções de validação do arquivo src/validation.js: validateLead(), que valida os dados do formulário de contato (nome, e-mail, telefone e modalidade de interesse), e normalizeCourseFilter(), que trata o filtro de modalidade usado na listagem de cursos.\]
\[Os testes pretendiam verificar se:

dados corretos são aceitos e dados incorretos são rejeitados com a mensagem adequada;
os valores-limite das regras (como o nome com exatamente 3 caracteres) se comportam como esperado;
campos opcionais (telefone e modalidade) não bloqueiam o cadastro quando ausentes;
entradas inesperadas (tipos incorretos, campos ausentes, textos maliciosos) são tratadas sem quebrar a função. \]

\[Os possíveis erros a identificar eram: dados inválidos sendo aprovados, dados válidos sendo rejeitados, falhas nos limites das regras e erros de execução diante de tipos inesperados.\]
---

## 3\. Ambiente de testes

Informe as ferramentas e tecnologias utilizadas para executar os testes.

| Ferramenta/Tecnologia | Versão |
| --- | --- |
| JavaScript | \[ES2022 (executado pelo Node.js)\] |
| Node.js | \[v22.2.0] |
| Jest | \[	30.5.2 (conforme package.json)\] |
| NPM | \[10.7.0\] |
| Supertest | \[7.0.0\] |
| Express| \[4.21.2\] |
| sqlite3| \[6.0.1\] |

**Comando utilizado preparar o ambiente:**

``` bash
[npm install]
```

**Comando utilizado executar o sistema (servidor):**

``` bash
[npm start]
```

**Comando utilizado para executar os testes:**

``` bash
[npm test]
```

---

## 4\. Funcionalidades testadas

Liste as funções, métodos ou componentes da aplicação que foram submetidos aos testes.

| Nº | Funcionalidade/Função | Arquivo | Objetivo do teste |
| --- | --- | --- | --- |
| 1 | \[validateLead() – campo nome\] | \[src/validation.js\] | \[Verificar a regra de mínimo de 3 caracteres, o trim() e os tipos inválidos\] |
| 2 | \[validateLead() – campo e-mail\] | \[src/validation.js\] | \[Verificar o padrão de e-mail, o trim() e os tipos inválidos\] |
| 3 | \[validateLead() – campo telefone\] | \[src/validation.js\] | \[Verificar que é opcional e que só aceita string\] |
| 4 | \[validateLead() – campo modalidade\] | \[src/validation.js\] | \[Verificar que é opcional e que só aceita as opções permitidas\] |
| 5 | \[validateLead() – retorno\] | \[src/validation.js\] | \[Verificar o acúmulo de erros e o formato do objeto retornado\] |
| 6 | \[normalizeCourseFilter()\] | \[src/validation.js\] | \[Verificar que só "Online" e "Presencial" passam; o restante vira null\] |

---

## 5\. Registro detalhado dos testes realizados

Registre individualmente TODOS os testes implementados.

Para cada teste, preencha as informações abaixo.

### Teste 01 – \[Aceita nome válido\]

- **Funcionalidade testada:** \[validateLead()\]
- **Nome do teste no Jest:** \[Aceita nome válido\]
- **Objetivo:** \[Verificar que um nome e um e-mail corretos são aprovados sem erros.\]
- **Entrada utilizada:** \[{ name: "João", email: "email@email.com" }\]
- **Resultado esperado:** \[valid: true e errors vazio.\]
- **Resultado obtido:** \[valid: true e errors vazio.\]
- **Status:** \[Aprovado\]

**Código do teste:**

``` javascript
// test("Aceita nome válido", () => {
  // Cenário POSITIVO: nome e e-mail corretos, nenhum erro esperado
    const result = validateLead({ name: "João", email: "email@email.com" });
  expect(result.errors.length).toBe(0);   // lista de erros vazia
  expect(result.valid).toBe(true);        // validação aprovada
});
```
---

### Teste 02 – \[Aceita nome com exatamente 3 caracteres (limite mínimo)\]

- **Funcionalidade testada:** \[validateLead()\]
- **Nome do teste no Jest:** \[Aceita nome com exatamente 3 caracteres (limite mínimo)\]
- **Objetivo:** \[Verificar que o menor nome permitido (3 caracteres) é aceito.\]
- **Tipo de cenário:** \[Limite\]
- **Entrada utilizada:** \[{ name: "Ana", email: "email@email.com" }\]
- **Resultado esperado:** \[valid: true.\]
- **Resultado obtido:** \[valid: true.  \]
- **Status:** \[Aprovado\]

**Código do teste:**

``` javascript
// test("Aceita nome com exatamente 3 caracteres (limite mínimo)", () => {
  // Cenário LIMITE: "Ana" tem 3 letras, o menor tamanho permitido
    const result = validateLead({ name: "Ana", email: "email@email.com" });
    expect(result.valid).toBe(true);
});
```
### Teste 03 – \[Rejeita nome com 2 caracteres (logo abaixo do limite)\]

- **Funcionalidade testada:** \[validateLead()\]
- **Nome do teste no Jest:** \[Rejeita nome com 2 caracteres (logo abaixo do limite)\]
- **Objetivo:** \[Verificar que um nome com 2 caracteres é rejeitado.\]
- **Tipo de cenário:** \[Limite\]
- **Entrada utilizada:** \[{ name: "Jo", email: "email@email.com" }\]
- **Resultado esperado:** \[valid: false e mensagem de nome inválido em errors.\]
- **Resultado obtido:** \[valid: false e mensagem de nome inválido em errors.\]
- **Status:** \[Aprovado\]

**Código do teste:**

``` javascript
// test("Rejeita nome com 2 caracteres (logo abaixo do limite)", () => {
  // Cenário LIMITE: "Jo" tem 2 letras, um a menos que o mínimo
    const result = validateLead({ name: "Jo", email: "email@email.com" });
    expect(result.valid).toBe(false);
  expect(result.errors).toContain(MSG_NOME);   // a mensagem certa foi gerada
});
```

### Teste 04 – \[Rejeita nome com apenas 1 caractere\]

- **Funcionalidade testada:** \[validateLead()\]
- **Nome do teste no Jest:** \[Rejeita nome com apenas 1 caractere\]
- **Objetivo:** \[Verificar que um nome muito curto gera o erro de nome.\]
- **Tipo de cenário:** \[Negativo\]
- **Entrada utilizada:** \[{ name: "J", email: "email@email.com" }\]
- **Resultado esperado:** \[errors contém "Informe seu nome (mínimo de 3 caracteres)."\]
- **Resultado obtido:** \[errors contém "Informe seu nome (mínimo de 3 caracteres)."\]
- **Status:** \[Aprovado\]

**Código do teste:**

``` javascript
// test("Rejeita nome com apenas 1 caractere", () => {
  // Cenário NEGATIVO: nome muito curto
    const result = validateLead({ name: "J", email: "email@email.com" });
    expect(result.errors).toContain(MSG_NOME);
});
```
### Teste 05 – \[Rejeita nome vazi\]

- **Funcionalidade testada:** \[validateLead()\]
- **Nome do teste no Jest:** \[Rejeita nome vazio\]
- **Objetivo:** \[Verificar que um nome em branco é rejeitado. \]
- **Tipo de cenário:** \[ Negativo \]
- **Entrada utilizada:** \[{ name: "", email: "email@email.com" }\]
- **Resultado esperado:** \[errors contém a mensagem de nome inválido.\]
- **Resultado obtido:** \[errors contém a mensagem de nome inválido.\]
- **Status:** \[Aprovado\]

**Código do teste:**

``` javascript
// test("Rejeita nome vazio", () => {
  // Cenário NEGATIVO: campo enviado em branco ("")
    const result = validateLead({ name: "", email: "email@email.com" });
    expect(result.errors).toContain(MSG_NOME);
});
```
###
---

> **Importante:** Duplique o bloco de registro acima para documentar todos os testes realizados. Não registre apenas os testes aprovados. Os testes reprovados também devem ser documentados.


---

## 6\. Resumo dos resultados

Apresente um resumo quantitativo de todos os testes executados.

| Indicador | Quantidade |
| --- | ---: |
| Total de testes executados | \[39\] |
| Testes aprovados (Passed) | \[39\] |
| Testes reprovados (Failed) | \[0\] |

**Percentual de aprovação:**

\[(39 ÷ 39) × 100 = 100%\]

---

## 7\. Evidências da execução dos testes

![](img\test.png)

---

## 8\. Problemas identificados e correções realizadas

Registre os problemas encontrados durante a execução dos testes e as soluções implementadas.

| Problema identificado | Causa do problema | Solução implementada | Situação |
| --- | --- | --- | --- |
| \[Inconsistência entre o formulário e a validação: o campo nome do index.html aceita 2 caracteres (minlength="2"), mas o servidor exige 3.\] | \[O valor do atributo no HTML não acompanhou a regra de validation.js. Foi observado na análise do código, e nenhum teste falhou por causa disso.\] | \[Alterar o atributo para minlength="3" no index.html.\] | \[Pendente\] |
| \[O pacote jest está em dependencies no package.json.\] | \[Ferramenta de teste declarada como dependência de produção.\] | \[Mover o jest para devDependencies.\] | \[Pendente\] 
| \[Descreva o erro\] | \[Possível causa\] | \[Correção realizada\] | \[Resolvido/Pendente\] 

**Resposta:**

\[Nenhum dos 39 testes falhou: o comportamento de validation.js ficou de acordo com o esperado em todos os cenários. Os dois itens da tabela acima foram observados durante a análise do código, e não por falha de teste.\]

---

## 9\. Análise dos resultados

Responda às questões:

1. Todos os testes apresentaram os resultados esperados? Justifique.
2. Quais foram os cenários mais importantes verificados durante os testes?
3. Algum teste identificou uma falha na aplicação? Qual?
4. Quais alterações foram necessárias para corrigir os problemas encontrados?
5. Existem funcionalidades que ainda precisam ser testadas? Quais?

**Respostas:**

\[1. Sim. Os 39 testes foram aprovados (100%), o que indica que validateLead() e normalizeCourseFilter() seguem as regras definidas, inclusive nos limites e em entradas inesperadas.\]
\[2. Os limites do nome (3 caracteres aceito, 2 rejeitado); o uso do trim() no nome e no e-mail; o acúmulo dos 4 erros em uma única chamada; a rejeição de tipos incorretos (número no lugar de texto); e o descarte de valores inválidos, inclusive uma tentativa de SQL injection, em normalizeCourseFilter().\]
\[3. Não. Porém, durante a análise foi observada uma inconsistência entre o HTML (minlength="2") e a regra do servidor (3 caracteres), descrita na seção 8.\]
\[4. Nenhuma no código testado. As correções sugeridas na seção 8 são de configuração e do HTML.\]
\[5. Sim: as rotas da API (/api/courses, /api/courses/:id e /api/leads), em testes de integração com Supertest, e as funções de acesso ao banco de dados (database.js). O front-end (app.js do navegador) também não foi testado.\]

---

## 10\. Conclusão

Apresente uma conclusão sobre o processo de testes realizado.

- Os testes contribuíram para identificar possíveis falhas?
- A aplicação apresentou o comportamento esperado nos cenários testados?
- Qual foi a importância dos testes unitários para a qualidade do software desenvolvido?

**Conclusão da equipe:**

\[Os testes unitários verificaram, de forma isolada, as funções de validação do formulário de contato e do filtro de cursos. Os 39 cenários, que incluem casos positivos, negativos, de limite e excepcionais, foram aprovados, mostrando que a aplicação se comporta como esperado nos cenários testados.

Embora nenhum teste tenha falhado, eles foram importantes porque documentam as regras de negócio (como o mínimo de 3 caracteres e a lista de modalidades permitidas) e protegem o código contra regressões: se alguém alterar uma regra por engano, o teste correspondente apontará o erro. A análise feita durante a escrita dos testes também revelou a inconsistência entre o HTML e a validação do servidor, registrada na seção 8.\]

---

**Relatório elaborado por:** \[Richardy de Oliveira Coutinho\]

**Data da última atualização:** \[17/11/2026\]