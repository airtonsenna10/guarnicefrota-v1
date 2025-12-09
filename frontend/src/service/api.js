const getApiUrl = (endpoint) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    return `${apiUrl}${endpoint}`;
};

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
