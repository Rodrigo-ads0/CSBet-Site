const admin = require('firebase-admin');

// Obtenha a chave de serviço a partir das variáveis de ambiente
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const firebaseConfig = {
  databaseURL: "https://csbet-00001-default-rtdb.firebaseio.com/"
};

// Inicializar o Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConfig.databaseURL
  });
}

const db = admin.database();

const setData = async (path, data) => {
  try {
    await db.ref(path).set(data);
  } catch (error) {
    throw new Error('Erro ao gravar dados: ' + error.message);
  }
};

const getData = async (path) => {
  try {
    const snapshot = await db.ref(path).once('value');
    return snapshot.val();
  } catch (error) {
    throw new Error('Erro ao obter dados: ' + error.message);
  }
};

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    try {
      const requestBody = JSON.parse(event.body);
      const text = requestBody.text || 'Texto padrão';

      await setData('test/data', { message: text });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Dados gravados com sucesso' }),
      };
    } catch (error) {
      console.error('Erro ao gravar dados:', error.message);

      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao gravar dados', details: error.message }),
      };
    }
  } else if (event.httpMethod === 'GET') {
    try {
      const data = await getData('test/data');

      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (error) {
      console.error('Erro ao obter dados:', error.message);

      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao obter dados', details: error.message }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método HTTP não permitido' }),
    };
  }
};
