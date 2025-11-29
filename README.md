# Guarnice Frotas - Sistema de Gestão de Frotas

Este é um sistema completo para gestão de frotas, desenvolvido com um back-end em Java com Spring Boot e um front-end em React.

## Visão Geral

O sistema permite o gerenciamento de veículos, motoristas, solicitações de viagem, autorizações e manutenções, fornecendo um dashboard central com as informações mais importantes.

## Tecnologias Utilizadas

### Back-end
- **Java 17**
- **Spring Boot 3.2.1**: Framework para criação de aplicações Java de forma rápida e robusta.
- **Spring Web**: Para criação de APIs REST.
- **Spring Data JPA**: Para persistência de dados em banco de dados relacional.
- **Spring Security**: Para controle de autenticação e autorização.
- **MySql Database**: Banco de dados para ambiente de desenvolvimento e testes.
- **Maven**: Gerenciador de dependências e build.

### Front-end
- **React 19**: Biblioteca para construção de interfaces de usuário.
- **React Bootstrap**: Componentes de UI baseados no Bootstrap.
- **Bootstrap 5**: Framework CSS para estilização.
- **@testing-library**: Para testes de componentes React.
- **npm**: Gerenciador de pacotes do Node.js.

## Como Rodar o Projeto

Para executar a aplicação, você precisará de dois terminais abertos, um para o back-end e outro para o front-end.

### 1. Rodando o Back-end (API Java)

No primeiro terminal, na raiz do projeto (`guarnice-frotas-java`), execute o seguinte comando Maven para iniciar a API Spring Boot:

```bash
mvn spring-boot:run
```

A API estará rodando em `http://localhost:8080`.

### 2. Rodando o Front-end (Interface React)

Abra um segundo terminal. Primeiro, navegue para a pasta do front-end:

```bash
cd frontend
```

Em seguida, instale as dependências do Node.js:

```bash
npm install
```

Após a instalação, inicie o servidor de desenvolvimento do React:

```bash
npm start
```

A aplicação React estará acessível em `http://localhost:3000` e se comunicará com a API do back-end.

## Estrutura do Projeto

```
/guarnice-frotas-java
|-- /frontend         # Contém o projeto React
|   |-- /public
|   |-- /src
|   |   |-- /components # Componentes React (Sidebar, Topbar, etc.)
|   |   |-- App.js
|   |   |-- App.css
|   |   `-- index.js
|   |-- package.json    # Dependências do front-end
|   `-- ...
|-- /src
|   |-- /main
|   |   |-- /java/br/com/seduc/guarnicefrota # Código-fonte do back-end
|   |   |   |-- /controller
|   |   |   |-- /model
|   |   |   |-- /repository
|   |   |   |-- /service
|   |   |   `-- GuarniceFrotaApplication.java
|   |   `-- /resources
|   |       `-- application.properties         # Configurações do Spring
|-- pom.xml           # Dependências do back-end (Maven)
`-- README.md
```

