const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1/';

const getToken = () => localStorage.getItem('token');

const fetchClient = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(baseUrl + endpoint, config);

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return await response.json();
  } catch (err) {
    console.error('Error in fetchClient:', err);
    throw err;
  }
};

export default fetchClient;
