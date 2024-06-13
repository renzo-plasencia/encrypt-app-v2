###### Libraries ######
from flask import Flask, render_template, request, jsonify
from cryptography.fernet import Fernet, InvalidToken

def crear_app():
    app = Flask(__name__)

    #Define main route
    @app.route('/')
    def index():
        return render_template('index.html')


    #Generate key
    @app.route('/generate_key', methods=['GET'])
    def generate_key():
        key = Fernet.generate_key() #Generas una clave de Fernet
        return jsonify({'key': key.decode()}) #Retorna en un Json Clave - Valor: 'key' -> key decodificada para obtener solo el valor.

    #Encrypt text
    @app.route('/encrypt', methods=['POST'])
    def encrypt():
        text = request.form['text'] #Obtiene texto
        key = request.form['key'].encode() #Obtiene llave
        cipher_suite = Fernet(key)
        encrypted_text = cipher_suite.encrypt(text.encode()).decode()
        return jsonify({'encrypted_text': encrypted_text})

    @app.route('/decrypt', methods=['POST'])
    def decrypt():
        encrypted_text = request.form['encrypted_text']
        key = request.form['key'].encode()
        cipher_suite = Fernet(key)
        try:
            decrypted_text = cipher_suite.decrypt(encrypted_text.encode()).decode()
            return jsonify({'decrypted_text': decrypted_text})
        except InvalidToken:
            return jsonify({'error': 'Invalid key or corrupted text'}), 400
        
    return app

if __name__ == '__main__':
    app = crear_app()
    app.run(debug=True)
