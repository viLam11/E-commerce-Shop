export default async function callAPI(url, method = 'GET', body, header = { 'Content-Type': 'application/json' }) {
    const options = {
      method,
      headers: header,
    };
  
    if (body && method !== 'GET') {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
  
    return fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.json(); 
        } else {
          return response.json().then((error) => {
            throw new Error(error.message || 'Error occurred');
          });
        }
      })
      .catch((error) => {
        console.error('Error in callAPI:', error.message);
        throw error;
      });
  }
