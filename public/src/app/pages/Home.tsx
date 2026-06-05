import React, { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Filters } from '../components/Filters';
import { PolicyCard } from '../components/PolicyCard';
import { fetchPolicies, Policy } from '../data/policies';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar políticas da API ao carregar o componente
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setIsLoading(true);
        // TODO: Descomentar quando o backend estiver pronto
        // const data = await fetchPolicies();
        // setPolicies(data);

        // Temporariamente, mostra erro para indicar que backend não está conectado
        toast.error('Backend não conectado. Configure a API para ver as políticas.');
        setPolicies([]);
      } catch (error) {
        console.error('Erro ao carregar políticas:', error);
        toast.error('Erro ao carregar políticas. Verifique se o backend está rodando.');
        setPolicies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPolicies();
  }, []);

  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           policy.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           policy.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || policy.category === selectedCategory;
      const matchesRegion = !selectedRegion || policy.region === selectedRegion;
      
      let matchesAudience = true;
      if (selectedAudience === 'dependência') {
        matchesAudience = policy.targetAudience.toLowerCase().includes('dependência') || 
                         policy.targetAudience.toLowerCase().includes('álcool') ||
                         policy.targetAudience.toLowerCase().includes('drogas');
      } else if (selectedAudience === 'transtornos') {
        matchesAudience = policy.targetAudience.toLowerCase().includes('transtorno');
      } else if (selectedAudience === 'geral') {
        matchesAudience = policy.targetAudience.toLowerCase().includes('toda') ||
                         policy.targetAudience.toLowerCase().includes('população');
      } else if (selectedAudience === 'crise') {
        matchesAudience = policy.targetAudience.toLowerCase().includes('crise') ||
                         policy.title.toLowerCase().includes('leitos');
      }

      return matchesSearch && matchesCategory && matchesRegion && matchesAudience;
    });
  }, [searchTerm, selectedCategory, selectedRegion, selectedAudience]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedRegion('');
    setSelectedAudience('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003DA5] to-[#0059D9] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Bem-vindo à Plataforma de Saúde Mental
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Encontre e acesse políticas públicas de saúde mental de forma simples e transparente
            </p>
          </div>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Filters
            selectedCategory={selectedCategory}
            selectedRegion={selectedRegion}
            selectedAudience={selectedAudience}
            onCategoryChange={setSelectedCategory}
            onRegionChange={setSelectedRegion}
            onAudienceChange={setSelectedAudience}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredPolicies.length === 0 ? 'Nenhuma política encontrada' : 
             filteredPolicies.length === 1 ? '1 política encontrada' :
             `${filteredPolicies.length} políticas encontradas`}
          </p>
        </div>

        {/* Policies Grid */}
        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#003DA5] mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando políticas...</p>
          </div>
        ) : filteredPolicies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map(policy => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma política encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Tente ajustar os filtros ou termo de busca
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                handleClearFilters();
              }}
              className="bg-[#003DA5] text-white px-6 py-2 rounded-lg hover:bg-[#002D7A] transition-colors"
            >
              Limpar busca e filtros
            </button>
          </div>
        )}
      </section>

      {/* Info Banner */}
      <section className="bg-blue-50 border-t border-blue-100 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Cuidar da saúde mental é cuidar da vida
            </h3>
            <p className="text-gray-700">
              Esta plataforma centraliza informações sobre políticas públicas de saúde mental 
              para facilitar o acesso da população aos serviços disponíveis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
