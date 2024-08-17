document.addEventListener('DOMContentLoaded', () => {
  const tela = document.getElementById('tela');
  
  // Função para buscar e exibir dados
  const fetchData = async () => {
    try {
      const response = await fetch('/.netlify/functions/writeData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha na solicitação');
      }

      const data = await response.json();
      tela.textContent = JSON.stringify(data.data); // Exibe os dados no elemento com id "tela"
    } catch (error) {
      console.error('Erro ao buscar dados:', error.message);
      tela.textContent = 'Erro ao carregar dados';
    }
  };

  fetchData(); // Chama a função para buscar e exibir dados

  // Adiciona o evento de clique ao botão
  const gerarTextoButton = document.getElementById('gerarTexto');
  gerarTextoButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/.netlify/functions/writeData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Texto enviado pelo botão!' }) // Envia o texto a ser gravado
      });

      if (!response.ok) {
        throw new Error('Falha na solicitação');
      }

      const result = await response.json();
      console.log('Resposta do servidor:', result.message);
      fetchData(); // Atualiza a tela após o envio dos dados
    } catch (error) {
      console.error('Erro ao enviar dados:', error.message);
    }
  });
});
