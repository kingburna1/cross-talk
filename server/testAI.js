import fetch from 'node-fetch';

async function testAI() {
  try {
    const response = await fetch('http://localhost:5000/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello, can you give me advice on improving my supermarket inventory management?'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAI();