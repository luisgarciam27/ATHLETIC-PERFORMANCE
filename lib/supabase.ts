
const SUPABASE_URL = 'https://vffowhyotabzigqomqrd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZm93aHlvdGFiemlncW9tcXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODk5MTksImV4cCI6MjA4MzU2NTkxOX0.aFLB0DKhtJlvG5DGvSjllUkxm9NPYvW5Vp84vqFcBQY';

export const supabaseFetch = async (method: 'GET' | 'POST' | 'PATCH', table: string, body?: any) => {
  const url = `${SUPABASE_URL}/rest/v1/${table}${method === 'GET' ? '?id=eq.1' : '?id=eq.1'}`;
  
  const headers: HeadersInit = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!response.ok) throw new Error('Error en la comunicación con Supabase');
    
    const data = await response.json();
    return data[0] || data;
  } catch (error) {
    console.error('Supabase Error:', error);
    return null;
  }
};
