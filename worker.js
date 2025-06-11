import { createUser, getUserByEmail, verifyPassword } from './auth.js';

export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Handle authentication routes
    if (path.startsWith('/api/auth/')) {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      if (path === '/api/auth/signup') {
        try {
          const { username, email, password } = await request.json();
          const result = await createUser(env, username, email, password);
          
          if (result.success) {
            return new Response(JSON.stringify({ success: true, userId: result.userId }), {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            });
          } else {
            return new Response(JSON.stringify({ success: false, error: result.error }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      }

      if (path === '/api/auth/login') {
        try {
          const { email, password } = await request.json();
          const user = await getUserByEmail(env, email);
          
          if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'User not found' }), {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }

          const isValid = await verifyPassword(password, user.password);
          if (!isValid) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }

          return new Response(JSON.stringify({ 
            success: true, 
            user: { 
              id: user.id, 
              username: user.username, 
              email: user.email 
            } 
          }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      }
    }

    // Handle Gemini API routes
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      // Get the request body
      const body = await request.json();
      
      // Forward the request to Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [{
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }]
        })
      });

      // Get the response from Gemini
      const data = await response.json();

      // Return the response with CORS headers
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
}; 