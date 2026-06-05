import React from 'react';
import { Filter } from 'lucide-react';

interface FiltersProps {
  selectedCategory: string;
  selectedRegion: string;
  selectedAudience: string;
  onCategoryChange: (category: string) => void;
  onRegionChange: (region: string) => void;
  onAudienceChange: (audience: string) => void;
  onClearFilters: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  selectedCategory,
  selectedRegion,
  selectedAudience,
  onCategoryChange,
  onRegionChange,
  onAudienceChange,
  onClearFilters
}) => {
  const hasActiveFilters = selectedCategory || selectedRegion || selectedAudience;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#003DA5]" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-[#003DA5] hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003DA5] focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Todas as categorias</option>
            <option value="Saúde">Saúde</option>
            <option value="Assistência Social">Assistência Social</option>
          </select>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
            Região
          </label>
          <select
            id="region"
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003DA5] focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Todas as regiões</option>
            <option value="Todo o território nacional">Nacional</option>
            <option value="Disponível em todas as capitais e principais municípios">Capitais e grandes cidades</option>
          </select>
        </div>

        <div>
          <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-2">
            Público-Alvo
          </label>
          <select
            id="audience"
            value={selectedAudience}
            onChange={(e) => onAudienceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003DA5] focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Todos os públicos</option>
            <option value="dependência">Dependência Química</option>
            <option value="transtornos">Transtornos Mentais</option>
            <option value="geral">População Geral</option>
            <option value="crise">Situações de Crise</option>
          </select>
        </div>
      </div>
    </div>
  );
};
