// Importação de módulos: traz as funções que serão testadas
const { validateLead, normalizeCourseFilter } = require("../src/validation");

// Mensagens de erro esperadas, guardadas em constantes para não repetir texto
// em todos os testes (se a mensagem mudar em validation.js, ajustamos só aqui)
const MSG_NOME = "Informe seu nome (mínimo de 3 caracteres).";
const MSG_EMAIL = "Informe um e-mail válido.";
const MSG_TELEFONE = "Preencha o telefone corretamente.";
const MSG_MODALIDADE = "Selecione uma modalidade válida.";

// Agrupamento principal: todos os testes da função validateLead()
describe("Testes unitários da função validateLead()", () => {

    // ---------------------------------------------------------------
    // Subgrupo: regras de validação do campo "nome"
    // Regra: deve ser string e ter no mínimo 3 caracteres (após trim)
    // ---------------------------------------------------------------
    describe("Validação do nome", () => {

        test("Aceita nome válido", () => {
            // Cenário POSITIVO: nome e e-mail corretos, nenhum erro esperado
            const result = validateLead({ name: "João", email: "email@email.com" });
            expect(result.errors.length).toBe(0);   // lista de erros vazia
            expect(result.valid).toBe(true);        // validação aprovada
        });

        test("Aceita nome com exatamente 3 caracteres (limite mínimo)", () => {
            // Cenário LIMITE: "Ana" tem 3 letras, o menor tamanho permitido
            const result = validateLead({ name: "Ana", email: "email@email.com" });
            expect(result.valid).toBe(true);
        });

        test("Rejeita nome com 2 caracteres (logo abaixo do limite)", () => {
            // Cenário LIMITE: "Jo" tem 2 letras, um a menos que o mínimo
            const result = validateLead({ name: "Jo", email: "email@email.com" });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain(MSG_NOME);   // a mensagem certa foi gerada
        });

        test("Rejeita nome com apenas 1 caractere", () => {
            // Cenário NEGATIVO: nome muito curto
            const result = validateLead({ name: "J", email: "email@email.com" });
            expect(result.errors).toContain(MSG_NOME);
        });

        test("Rejeita nome vazio", () => {
            // Cenário NEGATIVO: campo enviado em branco ("")
            const result = validateLead({ name: "", email: "email@email.com" });
            expect(result.errors).toContain(MSG_NOME);
        });

        test("Rejeita nome composto apenas por espaços", () => {
            // O trim() remove os espaços, sobrando 0 caracteres,
            // então o nome precisa ser considerado inválido
            const result = validateLead({ name: "     ", email: "email@email.com" });
            expect(result.errors).toContain(MSG_NOME);
        });

        test("Ignora espaços nas pontas ao contar caracteres do nome", () => {
            // "  Jo  " tem 6 caracteres, mas só 2 contam depois do trim().
            // Garante que espaços extras não "enganam" a validação
            const result = validateLead({ name: "  Jo  ", email: "email@email.com" });
            expect(result.errors).toContain(MSG_NOME);
        });

        test("Rejeita nome que não é string (número)", () => {
            // Cenário EXCEPCIONAL: tipo errado. typeof 12345 é "number"
            const result = validateLead({ name: 12345, email: "email@email.com" });
            expect(result.errors).toContain(MSG_NOME);
        });

        test("Rejeita nome ausente (undefined)", () => {
            // Cenário EXCEPCIONAL: o campo "name" nem foi enviado
            const result = validateLead({ email: "email@email.com" });
            expect(result.errors).toContain(MSG_NOME);
        });
    });

    // ---------------------------------------------------------------
    // Subgrupo: regras de validação do campo "e-mail"
    // Regra: deve ser string e seguir o padrão texto@dominio.extensão
    // ---------------------------------------------------------------
    describe("Validação do e-mail", () => {

        test("Aceita e-mail válido", () => {
            // Cenário POSITIVO: e-mail com domínio composto (.com.br)
            const result = validateLead({ name: "João", email: "joao@dominio.com.br" });
            expect(result.valid).toBe(true);
        });

        test("Aceita e-mail com espaços nas pontas (trim)", () => {
            // O código aplica trim() antes do teste da expressão regular,
            // então espaços no início e no fim devem ser tolerados
            const result = validateLead({ name: "João", email: "  joao@dominio.com  " });
            expect(result.valid).toBe(true);
        });

        test("Rejeita e-mail sem @", () => {
            // Falta o separador obrigatório entre usuário e domínio
            const result = validateLead({ name: "João", email: "joaodominio.com" });
            expect(result.errors).toContain(MSG_EMAIL);
        });

        test("Rejeita e-mail sem domínio após o @", () => {
            // Termina no "@", não há nada depois
            const result = validateLead({ name: "João", email: "joao@" });
            expect(result.errors).toContain(MSG_EMAIL);
        });

        test("Rejeita e-mail sem ponto no domínio", () => {
            // O padrão exige um ponto no domínio (ex.: .com), e "dominio" não tem
            const result = validateLead({ name: "João", email: "joao@dominio" });
            expect(result.errors).toContain(MSG_EMAIL);
        });

        test("Rejeita e-mail com espaço no meio", () => {
            // O padrão proíbe espaços dentro do e-mail ([^\s@])
            const result = validateLead({ name: "João", email: "jo ao@dominio.com" });
            expect(result.errors).toContain(MSG_EMAIL);
        });

        test("Rejeita e-mail vazio", () => {
            // Cenário NEGATIVO: campo obrigatório em branco
            const result = validateLead({ name: "João", email: "" });
            expect(result.errors).toContain(MSG_EMAIL);
        });

        test("Rejeita e-mail que não é string", () => {
            // Cenário EXCEPCIONAL: tipo errado (número no lugar de texto)
            const result = validateLead({ name: "João", email: 42 });
            expect(result.errors).toContain(MSG_EMAIL);
        });

        test("Rejeita e-mail ausente (undefined)", () => {
            // Cenário EXCEPCIONAL: o campo "email" nem foi enviado
            const result = validateLead({ name: "João" });
            expect(result.errors).toContain(MSG_EMAIL);
        });
    });

    // ---------------------------------------------------------------
    // Subgrupo: regras de validação do campo "telefone"
    // Regra: é opcional, mas se for preenchido deve ser string
    // ---------------------------------------------------------------
    describe("Validação do telefone (opcional)", () => {

        test("Aceita telefone ausente", () => {
            // Como o telefone é opcional, não enviá-lo não pode gerar erro
            const result = validateLead({ name: "João", email: "a@b.com" });
            expect(result.valid).toBe(true);
        });

        test("Aceita telefone vazio", () => {
            // String vazia é "falsy" em JavaScript, então a validação é ignorada
            const result = validateLead({ name: "João", email: "a@b.com", phone: "" });
            expect(result.valid).toBe(true);
        });

        test("Aceita telefone como string", () => {
            // Cenário POSITIVO: telefone formatado como texto
            const result = validateLead({ name: "João", email: "a@b.com", phone: "(11) 91234-5678" });
            expect(result.valid).toBe(true);
        });

        test("Rejeita telefone que não é string (número)", () => {
            // Cenário NEGATIVO: número no lugar de string
            const result = validateLead({ name: "João", email: "a@b.com", phone: 11912345678 });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain(MSG_TELEFONE);
        });
    });

    // ---------------------------------------------------------------
    // Subgrupo: regras de validação da "modalidade de interesse"
    // Regra: é opcional, mas se for preenchida deve estar na lista
    // ["Online", "Presencial", "Ainda não sei"]
    // ---------------------------------------------------------------
    describe("Validação da modalidade de interesse (opcional)", () => {

        // test.each executa o mesmo teste uma vez para cada valor da lista,
        // evitando escrever três testes quase idênticos. O %s mostra o valor no nome
        test.each(["Online", "Presencial", "Ainda não sei"])(
            "Aceita a modalidade '%s'", (interest) => {
                const result = validateLead({ name: "João", email: "a@b.com", interest });
                expect(result.valid).toBe(true);
            }
        );

        test("Aceita modalidade ausente", () => {
            // Campo opcional: não enviar não pode gerar erro
            const result = validateLead({ name: "João", email: "a@b.com" });
            expect(result.valid).toBe(true);
        });

        test("Aceita modalidade vazia", () => {
            // String vazia é "falsy", então a checagem da lista é ignorada
            const result = validateLead({ name: "João", email: "a@b.com", interest: "" });
            expect(result.valid).toBe(true);
        });

        test("Rejeita modalidade fora da lista", () => {
            // "Híbrido" não é uma das opções permitidas
            const result = validateLead({ name: "João", email: "a@b.com", interest: "Híbrido" });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain(MSG_MODALIDADE);
        });

        test("Rejeita modalidade com capitalização diferente", () => {
            // A comparação diferencia maiúsculas de minúsculas:
            // "online" (minúsculo) não é igual a "Online"
            const result = validateLead({ name: "João", email: "a@b.com", interest: "online" });
            expect(result.errors).toContain(MSG_MODALIDADE);
        });
    });

    // ---------------------------------------------------------------
    // Subgrupo: comportamento geral da função (acúmulo e formato do retorno)
    // ---------------------------------------------------------------
    describe("Acúmulo de erros e formato do retorno", () => {

        test("Acumula os 4 erros quando todos os campos são inválidos", () => {
            // Todos os campos errados ao mesmo tempo: a função não deve parar
            // no primeiro erro, e sim reunir todos eles no vetor "errors"
            const result = validateLead({ name: "J", email: "x", phone: 123, interest: "Outro" });
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(4);
            // toEqual compara também a ORDEM: nome, e-mail, telefone, modalidade
            expect(result.errors).toEqual([MSG_NOME, MSG_EMAIL, MSG_TELEFONE, MSG_MODALIDADE]);
        });

        test("Retorna { valid: true, errors: [] } quando tudo é válido", () => {
            // Todos os campos corretos: o objeto retornado deve ser exatamente este
            const result = validateLead({
                name: "Maria Silva", email: "maria@email.com", phone: "11999999999", interest: "Online"
            });
            expect(result).toEqual({ valid: true, errors: [] });
        });
    });
});

// Agrupamento de testes da função normalizeCourseFilter()
// Ela converte o filtro recebido na URL (?modality=...) em um valor seguro:
// devolve "Online" ou "Presencial" se for válido; senão devolve null (sem filtro)
describe("Testes unitários da função normalizeCourseFilter()", () => {

    test("Retorna null quando o filtro é undefined", () => {
        // Cenário: a URL não tem o parâmetro ?modality
        expect(normalizeCourseFilter(undefined)).toBeNull();
    });

    test("Retorna null quando o filtro é string vazia", () => {
        // String vazia é "falsy", portanto equivale a "sem filtro"
        expect(normalizeCourseFilter("")).toBeNull();
    });

    test("Retorna null para 'Todos'", () => {
        // "Todos" é o botão que mostra todos os cursos, ou seja, sem filtro
        expect(normalizeCourseFilter("Todos")).toBeNull();
    });

    test("Retorna 'Online' para 'Online'", () => {
        // Cenário POSITIVO: valor permitido é devolvido sem alteração
        expect(normalizeCourseFilter("Online")).toBe("Online");
    });

    test("Retorna 'Presencial' para 'Presencial'", () => {
        // Cenário POSITIVO: o outro valor permitido
        expect(normalizeCourseFilter("Presencial")).toBe("Presencial");
    });

    test("Retorna null para valor inválido", () => {
        // Valor desconhecido é descartado, evitando uma consulta sem sentido
        expect(normalizeCourseFilter("Híbrido")).toBeNull();
    });

    test("Retorna null para capitalização diferente ('online')", () => {
        // A lista de permitidos diferencia maiúsculas de minúsculas
        expect(normalizeCourseFilter("online")).toBeNull();
    });

    test("Retorna null para tentativa de SQL injection", () => {
        // Cenário de SEGURANÇA: texto malicioso nunca está na lista de permitidos,
        // logo é descartado antes de chegar ao banco de dados
        expect(normalizeCourseFilter("Online' OR '1'='1")).toBeNull();
    });
});