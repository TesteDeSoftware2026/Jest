import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { fetchCitizenApplications, Application } from '../data/policies';
import { FileText, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const CitizenDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'citizen') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Buscar solicitações do cidadão
  useEffect(() => {
    const loadApplications = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        // TODO: Descomentar quando o backend estiver pronto
        // const data = await fetchCitizenApplications(user.id);
        // setApplications(data);

        // Temporariamente, mostra erro
        toast.error('Backend não conectado. Configure a API para ver suas solicitações.');
        setApplications([]);
      } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
        toast.error('Erro ao carregar solicitações.');
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em análise':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Aguardando Documento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Em atendimento':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <CheckCircle className="w-5 h-5" />;
      case 'Em análise':
        return <Clock className="w-5 h-5" />;
      case 'Aguardando Documento':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Acompanhe aqui todas as suas solicitações e o status de cada uma
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Solicitações</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <FileText className="w-12 h-12 text-[#003DA5] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aprovados</p>
                <p className="text-3xl font-bold text-green-600">
                  {applications.filter(a => a.status === 'Aprovado').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Em Análise</p>
                <p className="text-3xl font-bold text-blue-600">
                  {applications.filter(a => a.status === 'Em análise').length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Minhas Solicitações</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#003DA5] mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando solicitações...</p>
            </div>
          ) : applications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {application.policyTitle}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Solicitado em {application.applicationDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Atualizado em {application.lastUpdate}</span>
                        </div>
                      </div>

                      {application.nextStep && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                          <p className="text-gray-700">
                            <strong>Próximo passo:</strong> {application.nextStep}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status}
                      </span>
                      
                      <button className="text-[#003DA5] hover:text-[#002D7A] font-medium text-sm hover:underline">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhuma solicitação ainda
              </h3>
              <p className="text-gray-500 mb-4">
                Explore as políticas disponíveis e manifeste seu interesse
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#003DA5] text-white px-6 py-2 rounded-lg hover:bg-[#002D7A] transition-colors"
              >
                Ver Políticas
              </button>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-2">Precisa de ajuda?</h3>
          <p className="text-gray-700 mb-4">
            Se você tiver dúvidas sobre o status da sua solicitação ou precisar de suporte:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Disque Saúde:</strong> 136 (ligação gratuita)</li>
            <li>• <strong>Horário de atendimento:</strong> Segunda a sexta, 8h às 20h</li>
            <li>• Procure a unidade de saúde mais próxima</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
