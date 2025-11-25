require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')

const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const apiDocsRouter = require('./routes/apiDocs');


const app = express();

const url = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PSWD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_DBNAME}`;

mongoose.connect(url).then(() => console.log("Conectado com Sucesso")).catch((err) => console.log("Erro ao Conectar" + err))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api-docs', apiDocsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products',  productRouter);

module.exports = app;
