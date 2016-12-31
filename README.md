# Modelizor

Modelizor is a tool to automatically create Model-files (see supported lanugages below) from a database schema.

[![Build Status](https://travis-ci.org/liminaab/modelizor.svg?branch=master)](https://travis-ci.org/liminaab/modelizor)
[![codecov](https://codecov.io/gh/liminaab/modelizor/branch/master/graph/badge.svg)](https://codecov.io/gh/liminaab/modelizor)

Supported languages: None yet... soon Java and then Golang.

Supported databases: None yet... soon PostgreSQL.

## About

Modelizor is meant to be used for any project (we use it internally for a very large system). It is meant to be used when an ORM is used, but the database design is important. The database if no1 prioritory, so it's designed directly (and possibly maintained with a migration tool). Since the Objects och Structs definitions are known from the database structure, they can be generated automatically once the migration tool has done its work. This is what Modelizor does.

Please note that Modelizor is a tool for automatic code generation, i.e. it is not meant to be used as an dependency or library in production system. Modelizor is used on demand in development and the code generated is to be used 

## Quickstart

`... to be defined ...`

## How it works

[Sequelize](https://github.com/sequelize/sequelize/blob/master/README.md) is used to access the database structure. Foreign keys etc are used to identify mapping tables, guess annotations and so on. The project creates files to the respective language it supports (e.g. .java or .go) in the folder where it is run. These can then be moved (or parts of the generated code copied) into your source code.

## ToDo

In order of priority

- Finish Beta for Java & Golang, based on PostgreSQL.
- Add support for Golang
- Add support for databases: MySQL, MariaDB, SQLLite, MSSQL & Oracle.