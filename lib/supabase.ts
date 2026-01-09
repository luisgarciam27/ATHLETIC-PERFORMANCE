
const SUPABASE_URL = 'https://vffowhyotabzigqomqrd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZm93aHlvdGFiemlncW9tcXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODk5MTksImV4cCI6MjA4MzU2NTkxOX0.aFLB0DKhtJlvG5DGvSjllUkxm9NPYvW5Vp84vqFcBQY';

export const supabaseFetch = async (method: 'GET' | 'POST' | 'PATCH', table: string, body?: any) => {
  // Siempre apuntamos al ID 1 que es nuestra configuración única
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.1`;
  
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase API Error:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    // Supabase devuelve arrays, retornamos el primer elemento para nuestra config
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};
