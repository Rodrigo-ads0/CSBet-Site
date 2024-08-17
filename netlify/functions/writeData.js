const admin = require('firebase-admin');
const path = require('path');

// Caminho para o arquivo JSON da chave de serviço
const serviceAccountPath = path.resolve(__dirname, '../keys/serviceAccountKey.json');

// Configuração do Firebase
const firebaseConfig = {
  databaseURL: "https://csbet-00001-default-rtdb.firebaseio.com/"
};

// Inicializar o Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    databaseURL: firebaseConfig.databaseURL
  });
}

const db = admin.database();

// Função para obter a referência do banco de dados
const getRef = (path) => db.ref(path);

// Função para definir dados no banco de dados
const setData = async (path, data) => {
  await db.ref(path).set(data);
};

// Função para remover dados do banco de dados
const removeData = async (path) => {
  await db.ref(path).remove();
};

// Função para obter dados do banco de dados
const getData = async (path) => {
  const snapshot = await db.ref(path).once('value');
  return snapshot.val();
};

// Função principal para lidar com a solicitação
exports.handler = async (event) => {
  let response;
  const headers = {
    'Access-Control-Allow-Origin': '*', // Permitir todas as origens
    'Access-Control-Allow-Methods': 'GET, POST', // Permitir métodos GET e POST
    'Access-Control-Allow-Headers': 'Content-Type', // Permitir cabeçalhos Content-Type
  };

  if (event.httpMethod === 'OPTIONS') {
    // Responder às solicitações prévias (preflight)
    response = {
      statusCode: 204,
      headers: headers,
      body: '',
    };
  } else if (event.httpMethod === 'POST') {
    try {
      const requestBody = JSON.parse(event.body);
      const text = requestBody.text || 'Texto padrão'; // Defina um texto padrão se não for enviado

      await setData('test/data', { message: text });

      response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ message: 'Dados gravados com sucesso' }),
      };
    } catch (error) {
      console.error('Erro ao gravar dados:', error.message);

      response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ error: 'Erro ao gravar dados', details: error.message }),
      };
    }
  } else if (event.httpMethod === 'GET') {
    try {
      const data = await getData('test/data');

      response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ data }),
      };
    } catch (error) {
      console.error('Erro ao obter dados:', error.message);

      response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ error: 'Erro ao obter dados', details: error.message }),
      };
    }
  } else {
    response = {
      statusCode: 405,
      headers: headers,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  return response;
};
