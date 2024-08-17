const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, child } = require('firebase/database');

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "csbet-00001.firebaseapp.com",
  projectId: "csbet-00001",
  storageBucket: "csbet-00001.appspot.com",
  messagingSenderId: "379404731204",
  appId: "1:379404731204:web:94eb3e29df6c0a6c214d11",
  databaseURL: "https://csbet-00001-default-rtdb.firebaseio.com/"
};

// Inicializar o Firebase
initializeApp(firebaseConfig);
const database = getDatabase();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método não permitido'
    };
  }

  let body;

  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: 'Corpo da requisição inválido'
    };
  }

  const { path, data } = body;

  try {
    const testPath = 'testConnection';
    const testData = { message: 'Conexão com Firebase bem-sucedida!' };
    await set(ref(database, testPath), testData);

    const snapshot = await get(child(ref(database), testPath));
    const testMessage = snapshot.val();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Dados gravados com sucesso!',
        testMessage
      })
    };
  } catch (error) {
    console.error('Erro ao gravar dados:', error.message);
    return {
      statusCode: 500,
      body: 'Erro ao gravar dados: ' + error.message
    };
  }
};
