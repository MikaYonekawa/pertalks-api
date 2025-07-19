const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();


// Carrega as credenciais
const keys = require('./creds.json');

// Configura o Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({ version: 'v4', auth });

// ID da planilha e nome da aba
const SPREADSHEET_ID = '1MP7VNhmXjUUzvIw4rxvBi6hfEM83GfL0P41WjPv060I';
const SHEET_NAME = 'Página1';

app.use(cors());
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.post('/inscricao', async (req, res) => {
  const { nome, email, telefone, empresa, senha, palestra } = req.body;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[nome, email, telefone, empresa, senha, palestra]]
      }
    });

    res.status(200).json({ message: 'Inscrição recebida com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar dados para o Google Sheets.' });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
