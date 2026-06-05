import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { fetchPolicyById, createApplication, Policy } from '../data/policies';
import {
  ArrowLeft,
  FileText,
  Users,
  MapPin,
  Building,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export const PolicyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar detalhes da política ao carregar
  useEffect(() => {
    const loadPolicy = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        // TODO: Descomentar quando o backend estiver pronto
        // const data = await fetchPolicyById(id);
        // setPolicy(data);

        // Temporariamente, mostra erro
        toast.error('Backend não conectado. Configure a API para ver os detalhes da política.');
        setPolicy(null);
      } catch (error) {
        console.error('Erro ao carregar política:', error);
        toast.error('Erro ao carregar detalhes da política.');
        setPolicy(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPolicy();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#003DA5] mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando detalhes da política...</p>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Política não encontrada</h2>
          <Link to="/" className="text-[#003DA5] hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para manifestar interesse');
      navigate('/login');
      return;
    }

    if (user?.role === 'admin') {
      toast.error('Administradores não podem manifestar interesse em políticas');
      return;
    }

    if (!policy || !user) return;

    try {
      // TODO: Descomentar quando o backend estiver pronto
      // await createApplication(policy.id, user.id);

      // Temporariamente, mostra erro
      throw new Error('Backend não conectado');

      setShowSuccessMessage(true);
      toast.success('Interesse manifestado com sucesso!');

      setTimeout(() => {
        navigate('/minha-area');
      }, 2000);
    } catch (error) {
      console.error('Erro ao manifestar interesse:', error);
      toast.error('Backend não conectado. Configure a API para manifestar interesse.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#003DA5] hover:text-[#002D7A] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <span className="inline-block bg-blue-100 text-[#003DA5] px-3 py-1 rounded-full text-sm font-medium mb-3">
                {policy.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {policy.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border-b-2 border-green-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3 text-green-800">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Interesse manifestado com sucesso!</p>
                <p className="text-sm">Redirecionando para sua área...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Objective */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Objetivo da Política</h2>
              <p className="text-gray-700 leading-relaxed">{policy.objective}</p>
            </section>

            {/* Criteria */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#003DA5]" />
                Critérios de Participação
              </h2>
              <ul className="space-y-3">
                {policy.criteria.map((criterion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-[#003DA5] rounded-full flex-shrink-0 font-semibold text-sm leading-none">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{criterion}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Required Documents */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#003DA5]" />
                Documentos Necessários
              </h2>
              <ul className="space-y-3">
                {policy.requiredDocuments.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Informações Rápidas</h3>
              
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[#003DA5] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Público-Alvo</p>
                  <p className="text-gray-900">{policy.targetAudience}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#003DA5] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Abrangência</p>
                  <p className="text-gray-900">{policy.region}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-[#003DA5] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Órgão Responsável</p>
                  <p className="text-gray-900">{policy.responsibleOrganization}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#003DA5] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Prazos</p>
                  <p className="text-gray-900">{policy.deadlines}</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleApply}
              className="w-full bg-[#003DA5] hover:bg-[#002D7A] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Manifestar Interesse
            </button>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                <strong>Precisa de ajuda?</strong><br />
                Entre em contato com a unidade de saúde mais próxima ou ligue 136 (Disque Saúde).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};