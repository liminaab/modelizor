# Modelizor

Modelizor is a tool to automatically create Model-files (see supported lanugages below) from a database schema.

[![Build Status](https://travis-ci.org/liminaab/modelizor.svg?branch=master)](https://travis-ci.org/liminaab/modelizor)
[![codecov](https://codecov.io/gh/liminaab/modelizor/branch/master/graph/badge.svg)](https://codecov.io/gh/liminaab/modelizor)

Supported languages: Java (Hibernate, alpha stage(not tested)), Go (gorm, alpha stage).

Supported databases: PostgreSQL.

## About

Modelizor is meant to be used for any project (we use it internally for a very large system). It is meant to be used when an ORM is used, but the database design is important. The database if no1 prioritory, so it's designed directly (and possibly maintained with a migration tool). Since the Objects och Structs definitions are known from the database structure, they can be generated automatically once the migration tool has done its work. This is what Modelizor does.

Please note that Modelizor is a tool for automatic code generation, i.e. it is not meant to be used as an dependency or library in production system. Modelizor is used on demand in development and the code generated is to be used 

### Note:
The project is in "get it working, then refactor"-stage (before refactoring). The structure is going to be remade to use templates(probably doT) for generation so you can customize the output files to your liking and add more functionality.
However, it should basically be working, at least as a work releiver if you need to make alot of models with relations (you will probably have to change annotations for hibernate).

## Quickstart

`... to be defined ...`

## How it works

The app connects directly to the dabase via a node library for every type of database. SQL queries are used to extract the table definitions.

Foreign keys etc are used to identify mapping tables, guess annotations and so on. The project creates files to the respective language it supports (e.g. .java or .go) in the folder where it is run. These can then be moved (or parts of the generated code copied) into your source code.

## ToDo

In order of priority

- Add templating functionality
- Add tests
- Add support for databases: MySQL, MariaDB, SQLLite, MSSQL & Oracle.