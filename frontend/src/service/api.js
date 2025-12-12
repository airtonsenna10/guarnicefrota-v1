
const getApiUrl = (endpoint) => {
    // Busca a variável de ambiente ou usa o padrão 'http://localhost:8080'
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    return `${apiUrl}${endpoint}`;
};

// Função para buscar dados (GET)
export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(getApiUrl(endpoint));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not fetch data from ${endpoint}:`, error);
        throw error;
    }
};

// Envio de dados (POST, PUT, etc.)
export const sendData = async (endpoint, method = 'POST', data) => {
    try {
        const url = getApiUrl(endpoint);
        const response = await fetch(url, {
            method: method, // POST, PUT, DELETE, etc.
            headers: {
                // Essencial para o Spring Boot saber que está recebendo um JSON
                'Content-Type': 'application/json', 
            },
            // Converte o objeto JavaScript em uma string JSON para envio
            body: JSON.stringify(data), 
        });

        if (!response.ok) {
            // Lança um erro detalhado (incluindo o texto do erro da API, se disponível)
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}. Body: ${errorBody}`);
        }
        
        // Se a resposta for 201 Created (que seu Controller retorna), ele pode retornar o JSON salvo
        // Verifica se a resposta tem conteúdo antes de chamar .json()
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            // Retorna a resposta, útil para 204 No Content (DELETE) ou 201 sem corpo
            return response; 
        }

    } catch (error) {
        console.error(`Could not send data to ${endpoint}:`, error);
        throw error;
    }
};
