import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchPolicies,
  deletePolicy,
  fetchAdminStats,
  Policy,
  PolicyStats
} from '../data/policies';
import {
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';

export const AdminPanel: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'policies' | 'reports'>('policies');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Estados para estatísticas
  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    inAnalysis: 0,
    approvalRate: 0
  });
  const [applicationsData, setApplicationsData] = useState<{ name: string; value: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Carregar políticas
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setIsLoadingPolicies(true);
        // TODO: Descomentar quando o backend estiver pronto
        // const data = await fetchPolicies();
        // setPolicies(data);

        // Temporariamente, mostra erro
        toast.error('Backend não conectado. Configure a API para gerenciar políticas.');
        setPolicies([]);
      } catch (error) {
        console.error('Erro ao carregar políticas:', error);
        toast.error('Erro ao carregar políticas.');
        setPolicies([]);
      } finally {
        setIsLoadingPolicies(false);
      }
    };

    loadPolicies();
  }, []);

  // Carregar estatísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoadingStats(true);
        // TODO: Descomentar quando o backend estiver pronto
        // const data = await fetchAdminStats();
        //
        // setStats({
        //   totalApplications: data.applications.total,
        //   approved: data.applications.approved,
        //   inAnalysis: data.applications.inAnalysis,
        //   approvalRate: Math.round((data.applications.approved / data.applications.total) * 100)
        // });
        //
        // setApplicationsData(data.policiesStats.map(p => ({
        //   name: p.policyTitle.substring(0, 20),
        //   value: p.applicationsCount
        // })));
        //
        // setStatusData(data.statusDistribution.map(s => ({
        //   name: s.status,
        //   value: s.count,
        //   color: getStatusColor(s.status)
        // })));

        // Dados vazios temporariamente
        setStats({ totalApplications: 0, approved: 0, inAnalysis: 0, approvalRate: 0 });
        setApplicationsData([]);
        setStatusData([]);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (activeTab === 'reports') {
      loadStats();
    }
  }, [activeTab]);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a política "${title}"?`)) {
      try {
        // TODO: Descomentar quando o backend estiver pronto
        // await deletePolicy(id);
        // setPolicies(policies.filter(p => p.id !== id));
        // toast.success('Política excluída com sucesso');

        toast.error('Backend não conectado. Configure a API para excluir políticas.');
      } catch (error) {
        console.error('Erro ao excluir política:', error);
        toast.error('Erro ao excluir política.');
      }
    }
  };

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie políticas públicas e visualize relatórios de adesão
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('policies')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'policies'
                  ? 'border-[#003DA5] text-[#003DA5]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Gerenciar Políticas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'border-[#003DA5] text-[#003DA5]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Relatórios
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'policies' ? (
          <>
            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar políticas..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#003DA5] focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                onClick={() => {
                  toast.error('Backend não conectado. Configure a API para criar políticas.');
                }}
                className="flex items-center gap-2 bg-[#003DA5] hover:bg-[#002D7A] text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Nova Política
              </button>
            </div>

            {/* Policies Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {isLoadingPolicies ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#003DA5] mx-auto mb-4"></div>
                  <p className="text-gray-500">Carregando políticas...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Política
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Categoria
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Região
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Público-Alvo
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPolicies.map((policy) => (
                      <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{policy.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {policy.shortDescription}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-blue-100 text-[#003DA5] px-3 py-1 rounded-full text-sm font-medium">
                            {policy.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {policy.region === 'Todo o território nacional' ? 'Nacional' : 'Regional'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                          <div className="line-clamp-2">{policy.targetAudience}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toast.error('Backend não conectado. Configure a API para editar políticas.')}
                              className="p-2 text-[#003DA5] hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(policy.id, policy.title)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredPolicies.length === 0 && (
                    <div className="p-12 text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma política encontrada</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-[#003DA5]" />
                  </div>
                  {!isLoadingStats && <TrendingUp className="w-5 h-5 text-green-600" />}
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoadingStats ? '...' : stats.totalApplications}
                </p>
                <p className="text-sm text-gray-600">Total de Solicitações</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  {!isLoadingStats && <TrendingUp className="w-5 h-5 text-green-600" />}
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoadingStats ? '...' : stats.approved}
                </p>
                <p className="text-sm text-gray-600">Aprovados</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoadingStats ? '...' : stats.inAnalysis}
                </p>
                <p className="text-sm text-gray-600">Em Análise</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoadingStats ? '...' : `${stats.approvalRate}%`}
                </p>
                <p className="text-sm text-gray-600">Taxa de Aprovação</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Solicitações por Política
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={applicationsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#003DA5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Distribuição por Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
