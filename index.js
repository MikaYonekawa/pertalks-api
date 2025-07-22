const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();

// Carrega as credenciais
const keys = {
  type: 'service_account',
  project_id: 'pertalks-api',
  private_key_id: '9a82d06b23478d187f34520efd51b4be39896e51',
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: '104699692822257204188',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/pertalks-api-service%40pertalks-api.iam.gserviceaccount.com'
};


// Configura o Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({ version: 'v4', auth });

// ID da planilha e nome da aba
const SPREADSHEET_ID = '1MP7VNhmXjUUzvIw4rxvBi6hfEM83GfL0P41WjPv060I';
const SHEET_NAME = 'Página1';

// Middlewares
app.use(cors({
  origin: '*', // libera para qualquer origem
}));

app.use(express.json()); // Para application/json
app.use(express.urlencoded({ extended: true })); // Para application/x-www-form-urlencoded

// Rota
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
   // console.error(error);
console.error('Erro ao salvar no Sheets:', error.response?.data || error.message || error);

  }
});

// Inicialização
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
