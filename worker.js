import { createUser, getUserByEmail, verifyPassword } from './auth.js';

export default {
  async fetch(request, env, ctx) {
    // CORS headers that will be used in all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',  // Allow all origins for development
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    console.log('Request:', {
      method: request.method,
      path: path,
      url: request.url
    });

    // Handle authentication routes
    if (path.startsWith('/api/auth/')) {
      console.log('Handling auth route:', path);
      
      if (request.method !== 'POST') {
        console.log('Method not allowed:', request.method);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Method not allowed',
          method: request.method,
          path: path
        }), {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }

      if (path === '/api/auth/signup') {
        try {
          const { username, email, password } = await request.json();
          console.log('Signup attempt:', { username, email });
          const result = await createUser(env, username, email, password);
          
          if (result.success) {
            return new Response(JSON.stringify({ success: true, userId: result.userId }), {
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
            });
          } else {
            return new Response(JSON.stringify({ success: false, error: result.error }), {
              status: 400,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
            });
          }
        } catch (error) {
          console.error('Signup error:', error);
          return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          });
        }
      }

      if (path === '/api/auth/login') {
        try {
          const { email, password } = await request.json();
          console.log('Login attempt:', { email });
          const user = await getUserByEmail(env, email);
          
          if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'User not found' }), {
              status: 401,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
            });
          }

          const isValid = await verifyPassword(password, user.password);
          if (!isValid) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), {
              status: 401,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
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
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Login error:', error);
          return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
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
          ...corsHeaders,
          'Content-Type': 'application/json',
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
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
  },
}; 