const admin = require('firebase-admin');
const serviceAccount = require('./keys/serviceAccountKey.json');

// Inicializar o Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://csbet-00001-default-rtdb.firebaseio.com" // Substitua com o URL do seu banco de dados
  });
}

const db = admin.firestore();

// Função para adicionar dados ao Firestore
const addData = async (data) => {
  try {
    const { text } = JSON.parse(data);
    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Campo "text" é obrigatório' }),
      };
    }
    await db.collection('texts').add({ text });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Texto adicionado com sucesso!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao adicionar texto', details: error.message }),
    };
  }
};

// Função para coletar dados do Firestore
const readData = async () => {
  try {
    const snapshot = await db.collection('texts').get();
    const texts = snapshot.docs.map(doc => doc.data().text);
    return {
      statusCode: 200,
      body: JSON.stringify(texts),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao coletar textos', details: error.message }),
    };
  }
};

// Manipulador para lidar com requisições HTTP
exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    return addData(event.body);
  } else if (event.httpMethod === 'GET') {
    return readData();
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Método não permitido' }),
  };
};
