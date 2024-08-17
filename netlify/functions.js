const admin = require('firebase-admin');

// Inicializar o Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } catch (error) {
    console.error('Erro ao inicializar o Firebase Admin SDK:', error);
    throw error; // Re-throw the error so Netlify Dev logs it
  }
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
    console.error('Erro ao adicionar texto:', error);
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
    console.error('Erro ao coletar textos:', error);
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