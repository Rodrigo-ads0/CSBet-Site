document.addEventListener('DOMContentLoaded', () => {
    const generateTextButton = document.getElementById('generateTextButton');
    const feedback = document.getElementById('feedback');
  
    generateTextButton.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/writeData', {  // Use o endpoint relativo
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: 'path/to/generatedText',
            data: { example: 'Texto gerado pelo botão!' }
          }),
        });
  
        if (response.ok) {
          const result = await response.json();
          feedback.textContent = result.message || 'Texto gerado com sucesso!';
          console.log('Sucesso:', result);
        } else {
          const errorText = await response.text();
          feedback.textContent = 'Erro ao gerar texto.';
          console.error('Erro:', errorText);
        }
      } catch (error) {
        feedback.textContent = 'Erro ao conectar ao servidor.';
        console.error('Erro ao fazer a requisição:', error);
      }
    });
  });
  