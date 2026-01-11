
const SUPABASE_URL = 'https://vffowhyotabzigqomqrd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZm93aHlvdGFiemlncW9tcXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODk5MTksImV4cCI6MjA4MzU2NTkxOX0.aFLB0DKhtJlvG5DGvSjllUkxm9NPYvW5Vp84vqFcBQY';

export type SupabaseError = {
  code: string;
  message: string;
  isTableMissing: boolean;
};

export const supabaseFetch = async (method: 'GET' | 'POST' | 'PATCH' | 'DELETE', table: string, body?: any, queryParams?: string) => {
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  
  const headers: HeadersInit = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  if (queryParams) {
    url += `?${queryParams}`;
  } else if ((method === 'PATCH' || method === 'DELETE') && body?.id) {
    url += `?id=eq.${body.id}`;
  } else if (table === 'academy_config' && method === 'GET') {
    url += `?id=eq.1`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body && method !== 'GET' && method !== 'DELETE' ? JSON.stringify(body) : undefined
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.warn(`Supabase API Notice [${table}]:`, errorData.message);
      
      // PGRST205 significa que la tabla no existe en la base de datos
      if (errorData.code === 'PGRST205' || response.status === 404) {
        return { error: { code: 'PGRST205', message: 'Table missing', isTableMissing: true } };
      }
      return { error: errorData };
    }
    
    const data = await response.json();
    if (Array.isArray(data)) {
      if (table === 'academy_config' && method === 'GET') return data[0] || null;
      if (method === 'PATCH' && data.length === 1) return data[0];
      return data;
    }
    return data;
  } catch (error) {
    console.error(`Fetch exception [${table}]:`, error);
    return { error: { message: 'Network error or table missing' } };
  }
};
