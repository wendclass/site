import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { projectsData, Project } from '../../data/projets';
import { fetchPublicProjects } from '../../lib/supabase';
import { CtaButton } from '../ui/CtaButton';

export const ProjectsProof: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(projectsData.slice(0, 3));

  useEffect(() => {
    let isMounted = true;
    fetchPublicProjects().then((data) => {
      if (isMounted && data.length > 0) {
        setProjects(data.slice(0, 3));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProjects = projects;

  return (
    <section className="py-24 bg-ivoire-violet relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
              Preuve par les réalisations
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx">
              Des images conçues pour faire vendre
            </h2>
            <p className="mt-3 text-base sm:text-lg text-onyx/75 font-body">
              Chaque projet commence par la définition de l’action attendue de votre public, avant de concevoir les visuels pour les y conduire.
            </p>
          </div>

          <Link
            to="/projets"
            className="inline-flex items-center gap-2 text-violet-imperial font-semibold hover:text-[#7818e8] group text-sm sm:text-base font-body"
          >
            <span>Voir l'ensemble des 5 projets</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl overflow-hidden border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-onyx">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-onyx/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[11px] font-semibold text-ivoire-violet uppercase tracking-wider">
                  {project.category}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-title font-semibold text-onyx group-hover:text-violet-imperial transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-onyx/70 leading-relaxed font-body">
                    {project.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-violet-imperial/10 space-y-3">
                  <div className="flex items-start gap-2 text-xs text-onyx/80 font-body">
                    <CheckCircle className="w-4 h-4 text-violet-imperial shrink-0 mt-0.5" />
                    <span><strong className="text-onyx font-semibold">Résultat :</strong> {project.result}</span>
                  </div>

                  <Link
                    to={`/projets#${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-imperial group-hover:underline underline-offset-4"
                  >
                    <span>Découvrir l'étude de cas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 text-center">
          <CtaButton to="/projets" variant="secondary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
            Explorer tous les projets en détail
          </CtaButton>
        </div>
      </div>
    </section>
  );
};
