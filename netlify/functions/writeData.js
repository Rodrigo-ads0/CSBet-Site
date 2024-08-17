const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

// Sua configuração do Firebase
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

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    const { path, data } = JSON.parse(event.body);
    try {
      await set(ref(database, path), data);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Dados gravados com sucesso!' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Erro ao gravar dados: ' + error.message }),
      };
    }
  }
  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Método não permitido' }),
  };
};
