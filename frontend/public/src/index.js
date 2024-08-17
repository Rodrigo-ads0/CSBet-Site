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
});
