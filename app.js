require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')

const app = express();

const url = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PSWD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_DBNAME}`;

mongoose.connect(url).then(() => console.log("Conectado com Sucesso")).catch((err) => console.log("Erro ao Conectar" + err))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

module.exports = app;
