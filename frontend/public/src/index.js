document.addEventListener('DOMContentLoaded', () => {
  const tela = document.getElementById('tela');
  const button = document.getElementById('gerarTexto');

  // Função para buscar e exibir dados
  const fetchData = async () => {
    try {
      const response = await fetch('https://csbet.shop/netlify/functions/writeData', {
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

  // Função para gravar dados
  const sendData = async () => {
    try {
      const response = await fetch('https://csbet.shop/netlify/functions/writeData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Seu texto aqui!' }), // Texto a ser gravado
      });

      if (!response.ok) {
        throw new Error('Falha na solicitação');
      }

      const result = await response.json();
      console.log(result.message); // Exibe a resposta no console
      fetchData(); // Atualiza os dados após enviar
    } catch (error) {
      console.error('Erro ao enviar dados:', error.message);
    }
  };

  button.addEventListener('click', sendData); // Adiciona evento de clique ao botão

  fetchData(); // Chama a função para buscar e exibir dados
});
