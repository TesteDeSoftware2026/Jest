import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import { Policy } from '../data/policies';

interface PolicyCardProps {
  policy: Policy;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="h-2 bg-gradient-to-r from-[#003DA5] to-[#0059D9]"></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-block bg-blue-100 text-[#003DA5] px-3 py-1 rounded-full text-sm font-medium">
            {policy.category}
          </span>
        </div>

        <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-[#003DA5] transition-colors">
          {policy.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {policy.shortDescription}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-[#003DA5]" />
            <span className="line-clamp-1">{policy.targetAudience}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-[#003DA5]" />
            <span>{policy.region}</span>
          </div>
        </div>

        <Link
          to={`/politica/${policy.id}`}
          className="flex items-center justify-center gap-2 w-full bg-[#003DA5] hover:bg-[#002D7A] text-white py-3 rounded-lg transition-colors font-medium group"
        >
          Ver Detalhes
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
