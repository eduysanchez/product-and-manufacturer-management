# Gerenciamento de Produtos e Fabricantes

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) versão 18.1.3.

# Documentação da Aplicação

## Índice

1. [Visão Geral](#visão-geral)
2. [Configuração](#configuração)
3. [Execução](#execução)
4. [Funcionalidades](#funcionalidades)
   - [Listagem de Produtos](#listagem-de-produtos)
   - [Listagem de Fabricantes](#listagem-de-fabricantes)
   - [Cadastro de Produtos](#cadastro-de-produtos)
   - [Cadastro de Fabricante](#cadastro-de-fabricante)
   - [Visualização de Detalhes](#visualização-de-detalhes)
   - [Atualização de Fabricante](#atualização-de-fabricante)
   - [Remoção de Fabricante](#remoção-de-fabricante)

## Visão Geral

Esta aplicação permite a gestão de produtos e fabricantes. As principais funcionalidades incluem a listagem, busca, cadastro, atualização e remoção de produtos e fabricantes. Além disso, a aplicação integra uma API externa para preenchimento automático de endereços a partir do CEP.

## Configuração

Para configurar a aplicação, siga os seguintes passos:

1. Clone o repositório:

   ```sh
   git clone https://github.com/eduysanchez/product-and-manufacturer-management.git
   ```

## Execução

1. Instalação de Dependências
   Execute `npm install` para instalar todas as dependências necessárias.

2. Servidor de Desenvolvimento
   Execute `npm start` para iniciar o servidor de desenvolvimento. Navegue para `http://localhost:4200/`. A aplicação será recarregada automaticamente se você alterar qualquer um dos arquivos de origem.

## Funcionalidades

### Listagem de Produtos

1. Exibir todos os produtos cadastrados: A aplicação exibe uma lista de todos os produtos cadastrados no sistema.

2. Permitir a ordenação e paginação dos resultados: Os resultados podem ser ordenados e paginados para facilitar a navegação.

3. Opção para buscar os produtos por código de barras: Os usuários podem buscar produtos específicos utilizando o código de barras.

### Listagem de Fabricantes

1. Exibir a lista de todos os fabricantes cadastrados: A aplicação exibe uma lista de todos os fabricantes cadastrados.

2. Permitir a ordenação e paginação dos resultados: Os resultados podem ser ordenados e paginados.

3. Opção para buscar fabricantes por CNPJ: Os usuários podem buscar fabricantes específicos utilizando o CNPJ.

### Cadastro de Produtos

1. Formulário para inserir os dados do produto: O formulário inclui campos para nome, fabricante, dados das embalagens, código de barras e descrição.

### Cadastro de Fabricante

1. Formulário para inserir os dados do novo fabricante: O formulário inclui campos para nome, CNPJ e endereço.

2. Integração com a API externa para preenchimento automático do endereço: O endereço é preenchido automaticamente a partir do CEP informado pelo usuário.

### Visualização de Detalhes

1. Visualizar os detalhes de um fabricante específico: Inclui todos os dados cadastrados e o endereço completo.

### Atualização de Fabricante

1. Permitir a edição dos dados de um fabricante existente: Inclui a edição do endereço.

2. Integração com a API externa para preenchimento automático do endereço ao editar o CEP.

### Remoção de Fabricante

1. Permitir a remoção de um fabricante da lista: Os usuários podem remover fabricantes cadastrados.
