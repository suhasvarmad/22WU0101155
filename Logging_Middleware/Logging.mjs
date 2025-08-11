const API_URL = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzdWhhc3Zhcm1hLmRhbmR1XzIwMjZAd294c2VuLmVkdS5pbiIsImV4cCI6MTc1NDg5NTIzMywiaWF0IjoxNzU0ODk0MzMzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNDM4YTQ0M2ItMWViMC00OTdjLWI5YjEtYzljMjI5MTk1M2Y4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3VoYXMgdmFybWEgZGFuZHUiLCJzdWIiOiJjOWU0N2M4Yi1iNDRiLTRhMDAtYmE1ZC0xMjI1NWIyMDQ3NzYifSwiZW1haWwiOiJzdWhhc3Zhcm1hLmRhbmR1XzIwMjZAd294c2VuLmVkdS5pbiIsIm5hbWUiOiJzdWhhcyB2YXJtYSBkYW5kdSIsInJvbGxObyI6IjIyd3UwMTAxMTU1IiwiYWNjZXNzQ29kZSI6IlVNWFZRVCIsImNsaWVudElEIjoiYzllNDdjOGItYjQ0Yi00YTAwLWJhNWQtMTIyNTViMjA0Nzc2IiwiY2xpZW50U2VjcmV0IjoiU2pFVFdwcVRid0tKaFFFViJ9.oaHIMUxKmZjfG8Iiads7dxgxgDplw9-tBFaZYyK_A_4"; 

/**
 * A reusable logging function that sends a POST request to the Test Server's Log API.
 * @param {string} stack - The stack where the log originated (e.g., "backend", "frontend").
 * @param {string} level - The severity level of the log (e.g., "error", "info", "warn").
 * @param {string} component - The specific package or component (e.g., "handler", "db", "api").
 * @param {string} message - A descriptive log message.
 */
async function Log(stack, level, component, message) {
  if (!ACCESS_TOKEN) {
    console.error("Access Token is not set. Cannot log to API.");
    return;
  }

  const logPayload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: component.toLowerCase(),
    message: message
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(logPayload)
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Failed to log: ${JSON.stringify(data)}`);
      return;
    }

    console.log(`Log created successfully: ${data.logID}`);
  } catch (error) {
    console.error("An error occurred while trying to log:", error.message);
  }
}

export default Log;