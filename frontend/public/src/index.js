// frontend/public/src/index.js

// URL base da função do Netlify
const FUNCTION_URL = '/.netlify/functions/functions';

// Função para adicionar dados
const addData = async (text) => {
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();
    alert(result.message || 'Erro ao adicionar dados');
  } catch (error) {
    console.error('Erro ao adicionar dados:', error);
  }
};

// Função para coletar dados
const fetchData = async () => {
  try {
    const response = await fetch(FUNCTION_URL);
    const data = await response.json();

    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = ''; // Limpa os dados anteriores

    if (data.length > 0) {
      const list = document.createElement('ul');
      data.forEach(text => {
        const listItem = document.createElement('li');
        listItem.textContent = text;
        list.appendChild(listItem);
      });
      dataContainer.appendChild(list);
    } else {
      dataContainer.textContent = 'Nenhum dado encontrado.';
    }
  } catch (error) {
    console.error('Erro ao coletar dados:', error);
  }
};

// Configuração dos eventos
document.getElementById('add-data-form').addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o envio padrão do formulário

  const textInput = document.getElementById('text-input');
  addData(textInput.value);
  textInput.value = ''; // Limpa o campo de entrada
});

document.getElementById('fetch-data').addEventListener('click', fetchData);
