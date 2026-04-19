const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface User {
  id: string;
  email: string;
  is_admin: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  address?: string;
  dob?: string;
  phone?: string;
  ssn?: string;
}

export interface Citation {
  citation_id: string;
  offense: string;
  date: string;
  fine: string;
  status: string;
  location: string;
}

export interface CitationResult {
  found: boolean;
  name?: string;
  dob?: string;
  citations?: Citation[];
  message?: string;
}

export interface Submission {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  address?: string;
  dob?: string;
  phone?: string;
  ssn?: string;
  citation_searched?: string;
  zip_code?: string;
  action_taken?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  details?: string;
  timestamp: string;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}/api${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'An error occurred');
  }
  
  return response.json();
}

export const api = {
  // Auth
  register: (email: string, password: string): Promise<User> =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string): Promise<User> =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Profile
  getProfile: (userId: string): Promise<UserProfile> =>
    fetchAPI(`/profile/${userId}`),

  updateProfile: (userId: string, profile: Partial<UserProfile>): Promise<UserProfile> =>
    fetchAPI(`/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  // Citations
  searchCitations: (name: string, citation_number: string, zip_code: string): Promise<CitationResult> =>
    fetchAPI('/citations/search', {
      method: 'POST',
      body: JSON.stringify({ name, citation_number, zip_code }),
    }),

  // Admin
  getSubmissions: (): Promise<Submission[]> =>
    fetchAPI('/admin/submissions'),

  getAuditLogs: (limit: number = 100): Promise<AuditLog[]> =>
    fetchAPI(`/admin/audit-logs?limit=${limit}`),

  exportCSV: async () => {
    const response = await fetch(`${API_URL}/api/admin/submissions/export`);
    return response.blob();
  },

  recordAction: (userId: string, action: string) =>
    fetchAPI(`/admin/record-action?user_id=${userId}&action=${action}`, {
      method: 'POST',
    }),
};
