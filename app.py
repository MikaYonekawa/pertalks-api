from flask import Flask, request
from flask_cors import CORS

import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app) 

EMAIL = 'contatopertalks@gmail.com'
SENHA = 'nydt yexb grcn ofxk'

@app.route('/enviar-email', methods=['POST'])
def enviar_email():
    dados = request.get_json()
    nome = dados.get('nome')
    email = dados.get('email')
    titulo = dados.get('palestra')
    senha_palestra = dados.get('senha')

    msg = MIMEText(f"Olá {nome or 'participante'},\nObrigado por se inscrever na palestra '{titulo}'.\nAqui está a sua senha de acesso: {senha_palestra}\nGuarde essa senha para acessar o evento. Você a usará no aplicativo para fazer o check-in no local.\n\nAinda não baixou o app Pertalks? Clique aqui: www.pertalks.com.br\n\nAtenciosamente,\nEquipe do evento")
    msg['Subject'] = f"Confirmação de Inscrição - {titulo}"
    msg['From'] = EMAIL
    msg['To'] = email

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL, SENHA)
            smtp.send_message(msg)
        return {'status': 'ok', 'mensagem': 'E-mail enviado com sucesso!'}
    except Exception as e:
        return {'status': 'erro', 'mensagem': str(e)}, 500

import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)


