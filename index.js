const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa Firebase Admin
const serviceAccount = require('./firebase-creds.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const MAX_INSCRITOS = 100;

// Configuração de email (exemplo usando Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contatopertalks@gmail.com',
    pass: 'pocx lqyn tiuk brgs' // use "senha de app" do Gmail
  }
});

// Rota de inscrição
app.post('/inscricao', async (req, res) => {
  const { nome, email, telefone, empresa, senha, palestra } = req.body;

  try {
    const inscritosRef = db.collection('inscritos');

    // Verifica duplicado
    const existe = await inscritosRef.where('email', '==', email).get();
    if (!existe.empty) {
      return res.status(400).json({ message: 'Email já inscrito.' });
    }

    // Verifica limite
    const total = await inscritosRef.get();
    if (total.size >= MAX_INSCRITOS) {
      return res.status(400).json({ message: 'Limite de inscritos atingido.' });
    }

    // Salva no Firestore
    await inscritosRef.add({
      nome, email, telefone, empresa, senha, palestra, data: new Date().toISOString()
    });

    // Envia email de confirmação
    await transporter.sendMail({
      from: 'Pertalks <seuemail@gmail.com>',
      to: email,
      subject: 'Confirmação de Inscrição - Pertalks',
      text: `Olá ${nome}, sua inscrição para a palestra "${palestra}" foi confirmada.`
    });

    res.status(200).json({ message: 'Inscrição concluída com sucesso!' });

  } catch (error) {
    console.error('Erro na inscrição:', error);
    res.status(500).json({ message: 'Erro interno ao processar inscrição.' });
  }
});

// Inicializa servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
