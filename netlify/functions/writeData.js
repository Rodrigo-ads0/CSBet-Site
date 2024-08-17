const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, remove, get, update } = require('firebase/database');

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

exports.handler = async (event) => {
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

    const { action, path, data } = body;

    try {
        switch (action) {
            case 'set':
                await set(ref(database, path), data);
                break;
            case 'remove':
                await remove(ref(database, path));
                break;
            case 'update':
                await update(ref(database, path), data);
                break;
            case 'get':
                const snapshot = await get(ref(database, path));
                return {
                    statusCode: 200,
                    body: JSON.stringify(snapshot.val())
                };
            default:
                return {
                    statusCode: 400,
                    body: 'Ação inválida'
                };
        }
        return {
            statusCode: 200,
            body: 'Operação realizada com sucesso!'
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Erro ao realizar operação: ' + error.message
        };
    }
};
