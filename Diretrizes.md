# Diretrizes do Projeto: restful-products-api

## 1. Estrutura de Branches

A estrutura de branches deve seguir um fluxo simples, com o objetivo de manter o código organizado e facilitar o trabalho em equipe (caso aplicável). As branches serão divididas da seguinte forma:

- **`main`**: Branch principal do projeto. Toda vez que uma funcionalidade estiver finalizada e validada, ela será mesclada (merge) para essa branch. O código na `main` deve ser sempre estável.

- **`develop`**: Branch de desenvolvimento. Todos os novos recursos (features), correções e melhorias serão inicialmente desenvolvidos nessa branch. Ela estará sempre à frente da `main` e será mesclada nela quando o desenvolvimento de uma funcionalidade ou conjunto de funcionalidades for concluído.

- **`feature/[nome-da-feature]`**: Branchs de funcionalidades específicas. Cada nova feature ou funcionalidade será desenvolvida em uma branch separada a partir de `develop`. Após a conclusão, a branch será mesclada de volta na `develop`. Nome da branch deve ser clara e descritiva sobre a funcionalidade que está sendo implementada. Exemplo: `feature/criar-produto`.

- **`bugfix/[nome-do-bug]`**: Branchs para corrigir erros ou bugs. Caso um bug seja identificado, crie uma branch com o prefixo `bugfix/` a partir de `develop`. Após corrigir o erro, mescle na `develop`.

- **`hotfix/[nome-do-hotfix]`**: Caso surja a necessidade de corrigir algo de urgência diretamente na `main` (por exemplo, um bug crítico em produção), será criada uma branch `hotfix/`, a partir da `main`. Após a correção, a branch será mesclada tanto na `main` quanto na `develop`.

## 2. Commits e Mensagens

- **Mensagens de Commit**: As mensagens de commit devem ser claras e objetivas, para que qualquer pessoa possa entender o que foi feito em cada alteração. Exemplo de boas práticas:
  - **Adicionar a funcionalidade de registro de usuário**
  - **Corrigir validação de preço no cadastro de produto**
  - **Atualizar documentação do README com instruções de testes**

- **Idioma dos commits**: Como é um projeto acadêmico, as mensagens podem ser em **português**, desde que seja consistente no uso.

- **Tamanho do commit**: Cada commit deve ser pequeno e focado em uma única alteração, como a implementação de uma rota, uma correção ou a melhoria de uma funcionalidade.

## 3. Pull Requests

- **Revisão de Pull Requests (PR)**: Antes de mesclar uma branch na `main` ou na `develop`, deve ser feito uma revisão do código. O objetivo é garantir que a implementação esteja funcionando conforme esperado e sem erros.

- **Descrição do PR**: Ao criar um pull request, descreva claramente o que foi feito, os testes realizados e qualquer ponto que precise de atenção especial. Exemplo:
  - **Descrição**: "Implementei a rota de criação de produto com validações de preço e estoque."

## 4. Fluxo de Trabalho

1. **Criação de Branch de Feature**:
   - Crie uma branch a partir da `develop` para cada nova funcionalidade. Exemplo:
     ```
     git checkout develop
     git checkout -b feature/nome-da-feature
     ```

2. **Desenvolvimento**:
   - Trabalhe na branch de feature e faça commits frequentes com descrições claras. Evite commits grandes ou agrupados.
   
3. **Testes Locais**:
   - Antes de finalizar, execute todos os testes necessários para garantir que o código funciona corretamente.
   
4. **Pull Request (PR)**:
   - Após concluir o desenvolvimento de uma funcionalidade, crie um pull request da sua branch de feature para a branch `develop` para revisão. Não faça PR diretamente para a branch `main`.

5. **Merge na `develop`**:
   - Quando o PR for aprovado, a branch de feature será mesclada na `develop`.

6. **Merge na `main`**:
   - Quando uma funcionalidade for considerada finalizada, e a branch `develop` estiver pronta para ser consolidada, faça o merge de `develop` para `main`.

## 5. Testes

- **Testes Unitários**: O projeto deve incluir testes automatizados para cobrir as principais rotas e funcionalidades, utilizando o Jest.
  
- **Testes Locais**: Teste as funcionalidades localmente antes de fazer o push para o repositório remoto. Certifique-se de que todos os testes passem.

## 6. Documentação

- **Swagger**: A API deve ser documentada utilizando o Swagger. Todos os endpoints devem estar descritos, com exemplos de request e response.

- **README**: O README do projeto deve conter:
  - Descrição geral do projeto.
  - Instruções de instalação e execução.
  - Como rodar os testes.
  - Exemplos de uso da API.

---

## Resumo do Fluxo de Branches:

- `main` → Código estável para produção.
- `develop` → Desenvolvimento contínuo.
- `feature/[nome]` → Para novas funcionalidades.
- `bugfix/[nome]` → Para correção de bugs.
- `hotfix/[nome]` → Para correções urgentes na produção.

