// ===================================================================
// INTERFACES DE DADOS - Estruturas que virão do Backend
// ===================================================================

export interface Policy {
  id: string;
  title: string;
  category: 'Saúde' | 'Assistência Social';
  shortDescription: string;
  objective: string;
  targetAudience: string;
  region: string;
  requiredDocuments: string[];
  criteria: string[];
  deadlines: string;
  responsibleOrganization: string;
}

export interface Application {
  id: string;
  policyId: string;
  policyTitle: string;
  citizenId: string;
  citizenName: string;
  applicationDate: string;
  status: 'Em análise' | 'Aprovado' | 'Aguardando Documento' | 'Em atendimento' | 'Concluído';
  lastUpdate: string;
  nextStep?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
  cpf?: string;
}

export interface ApplicationStats {
  total: number;
  approved: number;
  inAnalysis: number;
  waitingDocument: number;
  inProgress: number;
}

export interface PolicyStats {
  policyId: string;
  policyTitle: string;
  applicationsCount: number;
}

// ===================================================================
// API ENDPOINTS - Para serem implementados no Backend
// ===================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Funções auxiliares para fazer requisições HTTP
// TODO: Implementar tratamento de erros e autenticação via tokens

/**
 * ENDPOINT: GET /api/policies
 * Retorna todas as políticas disponíveis
 * Filtros opcionais via query params: ?category=Saúde&region=Nacional&search=termo
 */
export async function fetchPolicies(filters?: {
  category?: string;
  region?: string;
  search?: string;
}): Promise<Policy[]> {
  // TODO: Implementar chamada real à API
  // const queryParams = new URLSearchParams(filters as any).toString();
  // const response = await fetch(`${API_BASE_URL}/policies?${queryParams}`);
  // if (!response.ok) throw new Error('Erro ao buscar políticas');
  // return response.json();

  throw new Error('Backend não conectado - implementar endpoint GET /api/policies');
}

/**
 * ENDPOINT: GET /api/policies/:id
 * Retorna os detalhes de uma política específica
 */
export async function fetchPolicyById(id: string): Promise<Policy | null> {
  // TODO: Implementar chamada real à API
  // const response = await fetch(`${API_BASE_URL}/policies/${id}`);
  // if (!response.ok) return null;
  // return response.json();

  throw new Error('Backend não conectado - implementar endpoint GET /api/policies/:id');
}

/**
 * ENDPOINT: POST /api/applications
 * Cria uma nova manifestação de interesse em uma política
 * Body: { policyId: string, citizenId: string }
 * Headers: { Authorization: 'Bearer <token>' }
 */
export async function createApplication(policyId: string, citizenId: string): Promise<Application> {
  // TODO: Implementar chamada real à API
  // const response = await fetch(`${API_BASE_URL}/applications`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getAuthToken()}`
  //   },
  //   body: JSON.stringify({ policyId, citizenId })
  // });
  // if (!response.ok) throw new Error('Erro ao criar solicitação');
  // return response.json();

  throw new Error('Backend não conectado - implementar endpoint POST /api/applications');
}

/**
 * ENDPOINT: GET /api/citizens/:citizenId/applications
 * Retorna todas as solicitações de um cidadão
 * Headers: { Authorization: 'Bearer <token>' }
 */
export async function fetchCitizenApplications(citizenId: string): Promise<Application[]> {
  // TODO: Implementar chamada real à API
  // const response = await fetch(`${API_BASE_URL}/citizens/${citizenId}/applications`, {
  //   headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  // });
  // if (!response.ok) throw new Error('Erro ao buscar solicitações');
  // return response.json();

  throw new Error('Backend não conectado - implementar endpoint GET /api/citizens/:citizenId/applications');
}

/**
 * ENDPOINT: GET /api/admin/applications
 * Retorna todas as solicitações (apenas para admin)
 * Headers: { Authorization: 'Bearer <admin-token>' }
 */
export async function fetchAllApplications(): Promise<Application[]> {
  // TODO: Implementar chamada real à API
  // const response = await fetch(`${API_BASE_URL}/admin/applications`, {
  //   headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  // });
  // if (!response.ok) throw new Error('Erro ao buscar solicitações');
  // return response.json();

  throw new Error('Backend não conectado - implementar endpoint GET /api/admin/applications');
}

/**
 * ENDPOINT: GET /api/admin/stats
 * Retorna estatísticas agregadas para o painel administrativo
 * Headers: { Authorization: 'Bearer <admin-token>' }
 */
export async function fetchAdminStats(): Promise<{
  applications: ApplicationStats;
  policiesStats: PolicyStats[];
  statusDistribution: { status: string; count: number; }[];
}> {
  // TODO: Implementar chamada real à API
  // const response = await fetch(`${API_BASE_URL}/admin/stats`, {
  //   headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  // });
  // if (!response.ok) throw new Error('Erro ao buscar estatísticas');
  // return response.json();

  throw new Error('Backend não conectado - implementar endpoint GET /api/admin/stats');
}

/**
 * ENDPOINT: POST /api/policies
 * Cria uma nova política (apenas admin)
 * Headers: { Authorization: 'Bearer <admin-token>' }
 */
export async function createPolicy(policy: Omit<Policy, 'id'>): Promise<Policy> {
  // TODO: Implementar chamada real à API
  // const response = await fetch(`${API_BASE_URL}/policies`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getAuthToken()}`
  //   },
  //   body: JSON.stringify(policy)
  // });
  // if (!response.ok) throw new Error('Erro ao criar política');
  // return response.json();

  throw new Error('Backend não conectado - implementar endpoint POST /api/policies');
}

/**
 * ENDPOINT: PUT /api/policies/:id
 * Atualiza uma política existente (apenas admin)
 * Headers: { Authorization: 'Bearer <admin-token>' }
 */
export async function updatePolicy(id: string, policy: Partial<Policy>): Promise<Policy> {
  // TODO: Implementar chamada real à API
  // const response = await fetch(`${API_BASE_URL}/policies/${id}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getAuthToken()}`
  //   },
  //   body: JSON.stringify(policy)
  // });
  // if (!response.ok) throw new Error('Erro ao atualizar política');
  // return response.json();

  throw new Error('Backend não conectado - implementar endpoint PUT /api/policies/:id');
}

/**
 * ENDPOINT: DELETE /api/policies/:id
 * Remove uma política (apenas admin)
 * Headers: { Authorization: 'Bearer <admin-token>' }
 */
export async function deletePolicy(id: string): Promise<void> {
  // TODO: Implementar chamada real à API
  // const response = await fetch(`${API_BASE_URL}/policies/${id}`, {
  //   method: 'DELETE',
  //   headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  // });
  // if (!response.ok) throw new Error('Erro ao deletar política');

  throw new Error('Backend não conectado - implementar endpoint DELETE /api/policies/:id');
}
