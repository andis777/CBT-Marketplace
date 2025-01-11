import React from 'react';
import PsychologistCard from './PsychologistCard';
import InstitutionCard from './InstitutionCard';
import type { Psychologist, Institution } from '../types';

interface CatalogProps {
  psychologists: Psychologist[];
  institutions: Institution[];
}

const Catalog: React.FC<CatalogProps> = ({ psychologists, institutions }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Психологи</h2>
        <div className="space-y-6">
          {psychologists.map(psychologist => (
            <PsychologistCard key={psychologist.id} psychologist={psychologist} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Учебные заведения</h2>
        <div className="space-y-6">
          {institutions.map(institution => (
            <InstitutionCard key={institution.id} institution={institution} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Catalog;